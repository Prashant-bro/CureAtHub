import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import jwt from "jsonwebtoken"
import {
  getRealIP,
  checkIPRateLimit,
  timingSafeCompare,
  RateLimitLayer,
  redis,
} from "@/lib/rateLimitOtp"

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Finds existing user by phone or creates a new one.
 * Strategy: try to create first — if phone already exists, look up the existing user.
 */
async function findOrCreateUser(phone: string): Promise<string> {
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    phone: phone,
    phone_confirm: true,
  })

  if (!createError && newUser?.user) {
    return newUser.user.id
  }

  const isPhoneExists = createError && (
    (createError as any).code === "phone_exists" ||
    (createError as any).status === 422 ||
    createError.message?.toLowerCase().includes("already registered")
  )

  if (isPhoneExists) {
    const normalizedInput = phone.replace(/\D/g, "")
    let page = 1
    const perPage = 50
    while (true) {
      const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      })
      if (listError) throw listError

      const found = data.users.find((u) => {
        if (!u.phone) return false
        return u.phone.replace(/\D/g, "") === normalizedInput
      })
      if (found) return found.id

      if (data.users.length < perPage) break
      page++
    }
  }

  throw createError || new Error("Unable to find or create user.")
}

/**
 * Creates custom JWT tokens mimicking Supabase session credentials.
 */
function createSession(userId: string, phone: string) {
  const secret = process.env.SUPABASE_JWT_SECRET || ""
  if (!secret) {
    throw new Error("SUPABASE_JWT_SECRET environment variable is missing.")
  }

  const now = Math.floor(Date.now() / 1000)
  const iss = `${supabaseUrl}/auth/v1`

  const accessTokenPayload = {
    iss,
    sub: userId,
    aud: "authenticated",
    exp: now + 3600, // 1 hour expiration
    iat: now,
    role: "authenticated",
    aal: "aal1",
    phone: phone,
    email: "",
    is_anonymous: false,
    app_metadata: {
      provider: "phone",
      providers: ["phone"],
    },
    user_metadata: {},
  }

  const accessToken = jwt.sign(accessTokenPayload, secret)

  const refreshTokenPayload = {
    sub: userId,
    exp: now + 60 * 60 * 24 * 7, // 7 days expiration
    iat: now,
  }

  const refreshToken = jwt.sign(refreshTokenPayload, secret)

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 3600,
    token_type: "bearer",
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !otp) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: "Missing required fields: phone and otp.",
        },
        { status: 400 }
      )
    }

    const formattedPhone = phone.trim()
    const trimmedOtp = otp.trim()

    // Validate phone number structure
    const phoneRegex = /^91\d{10}$/
    if (!phoneRegex.test(formattedPhone)) {
      return NextResponse.json(
        {
          error: "invalid_phone",
          message: "Phone number must be in the format 91XXXXXXXXXX.",
        },
        { status: 400 }
      )
    }

    // Extract client IP
    const ip = getRealIP(request)

    // Check IP rate limit only on verify
    const ipRateLimitResult = await checkIPRateLimit(ip, formattedPhone)
    if (!ipRateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message: ipRateLimitResult.reason || "Too many verification attempts from this connection. Please try again later.",
          retry_after_seconds: ipRateLimitResult.retryAfter || 0,
        },
        { status: 429 }
      )
    }

    // Retrieve the stored OTP structure from Upstash Redis
    const otpKey = `otp:${formattedPhone}`
    const data: any = await redis.get(otpKey)

    if (!data) {
      return NextResponse.json(
        {
          error: "invalid_otp",
          message: "Invalid or expired OTP. Please request a new one.",
        },
        { status: 400 }
      )
    }

    const parsed = typeof data === "string" ? JSON.parse(data) : data

    // Brute force protection: check max verification attempts
    if (parsed.attempts >= 5) {
      await redis.del(otpKey)
      return NextResponse.json(
        {
          error: "rate_limited",
          message: "Too many attempts. Please request a new OTP.",
        },
        { status: 429 }
      )
    }

    // Compare stored OTP with input in a timing-safe manner
    const isOtpMatched = timingSafeCompare(parsed.otp, trimmedOtp)

    if (!isOtpMatched) {
      parsed.attempts += 1
      
      // If the incremented attempts reach 5, delete the key immediately
      if (parsed.attempts >= 5) {
        await redis.del(otpKey)
        return NextResponse.json(
          {
            error: "rate_limited",
            message: "Too many attempts. Please request a new OTP.",
          },
          { status: 429 }
        )
      }

      // Preserve TTL
      const ttl = await redis.ttl(otpKey)
      if (ttl > 0) {
        await redis.set(otpKey, JSON.stringify(parsed), { ex: ttl })
      } else {
        await redis.del(otpKey)
      }

      return NextResponse.json(
        {
          error: "invalid_otp",
          message: "Invalid OTP. Please try again.",
        },
        { status: 400 }
      )
    }

    // OTP matched: delete the key immediately to prevent reuse
    await redis.del(otpKey)

    // Find or create the user in Supabase
    const userId = await findOrCreateUser(formattedPhone)

    // Create customized JWT session credentials
    const session = createSession(userId, formattedPhone)

    return NextResponse.json({
      success: true,
      user: { id: userId },
      session,
    })
  } catch (error: unknown) {
    console.error("Verify OTP Endpoint Error:", error)
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    )
  }
}
