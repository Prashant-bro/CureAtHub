import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { createClient } from "@supabase/supabase-js"
import jwt from "jsonwebtoken"

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

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
 * Verifies the OTP, manages attempt limits, and handles expiration/cleanup.
 */
async function verifyOTP(phone: string, inputOtp: string): Promise<{ success: boolean; error?: string }> {
  const otpKey = `otp:${phone}`
  const data: any = await redis.get(otpKey)

  if (!data) {
    return { success: false, error: "Invalid or expired OTP. Please request a new one." }
  }

  // Handle both string and parsed object outputs from Upstash SDK
  const parsed = typeof data === "string" ? JSON.parse(data) : data

  // Brute force protection: check max attempts
  if (parsed.attempts >= 5) {
    await redis.del(otpKey)
    return { success: false, error: "Too many attempts. Please request a new OTP." }
  }

  // Validate match
  if (parsed.otp !== inputOtp) {
    parsed.attempts += 1
    const ttl = await redis.ttl(otpKey)
    if (ttl > 0) {
      await redis.set(otpKey, JSON.stringify(parsed), { ex: ttl })
    } else {
      await redis.del(otpKey)
    }
    return { success: false, error: "Invalid OTP. Please try again." }
  }

  // If match, remove OTP key to prevent reuse
  await redis.del(otpKey)
  return { success: true }
}

/**
 * Finds existing user by phone or creates a new one.
 * Strategy: try to create first — if phone already exists, look up the existing user.
 */
async function findOrCreateUser(phone: string): Promise<string> {
  // Try creating a new user first
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    phone: phone,
    phone_confirm: true,
  })

  // If created successfully, return the new user ID
  if (!createError && newUser?.user) {
    return newUser.user.id
  }

  const isPhoneExists = createError && (
    (createError as any).code === "phone_exists" ||
    (createError as any).status === 422 ||
    createError.message?.toLowerCase().includes("already registered")
  )

  // If phone already exists, find the existing user
  if (isPhoneExists) {
    const normalizedInput = phone.replace(/\D/g, "")
    // Paginate through users to find by phone
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

      // No more pages
      if (data.users.length < perPage) break
      page++
    }
  }

  // If we get here, something unexpected happened
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
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const formattedPhone = phone.trim()
    const trimmedOtp = otp.trim()

    // 1. Validate OTP
    const verificationResult = await verifyOTP(formattedPhone, trimmedOtp)
    if (!verificationResult.success) {
      return NextResponse.json({ error: verificationResult.error }, { status: 400 })
    }

    // 2. Identify or construct Supabase Auth User
    const userId = await findOrCreateUser(formattedPhone)

    // 3. Establish customized JWT credentials session
    const session = createSession(userId, formattedPhone)

    return NextResponse.json({
      success: true,
      user: { id: userId },
      session,
    })
  } catch (error: any) {
    console.error("Verify OTP Endpoint Error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
