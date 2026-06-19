import { NextResponse } from "next/server"
import crypto from "crypto"
import {
  getRealIP,
  checkRateLimits,
  RateLimitLayer,
  redis,
} from "@/lib/rateLimitOtp"

/**
 * Sends the OTP code to 2Factor SMS API.
 */
async function send2FactorSMS(localPhone: string, otp: string): Promise<Response> {
  const apiKey = process.env.TWOFACTOR_API_KEY || ""
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/${encodeURIComponent(localPhone)}/${otp}`

  return await fetch(url, {
    method: "GET",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: "Missing phone number.",
        },
        { status: 400 }
      )
    }

    const formattedPhone = phone.trim()
    
    // Strict Indian phone number validation: 91 followed by exactly 10 digits
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

    // Run all 4 layers of rate limiting
    const rateLimitResult = await checkRateLimits(formattedPhone, ip)
    if (!rateLimitResult.allowed) {
      if (rateLimitResult.layer === RateLimitLayer.GLOBAL) {
        return NextResponse.json(
          {
            error: "service_unavailable",
            message: rateLimitResult.reason || "OTP service is temporarily busy. Please try again shortly.",
          },
          { status: 503 }
        )
      } else {
        return NextResponse.json(
          {
            error: "rate_limited",
            message: rateLimitResult.reason || "Too many requests. Please try again later.",
            retry_after_seconds: rateLimitResult.retryAfter || 0,
          },
          { status: 429 }
        )
      }
    }

    // Generate secure 6-digit OTP
    const otpVal = crypto.randomInt(100000, 1000000)
    const otp = otpVal.toString()

    // Store OTP in Upstash Redis (TTL: 300 seconds)
    const otpKey = `otp:${formattedPhone}`
    const data = JSON.stringify({
      otp,
      attempts: 0,
      createdAt: Date.now(),
    })
    await redis.set(otpKey, data, { ex: 300 })

    // Send OTP via 2Factor (GET request, strip 91 prefix)
    const localPhone = formattedPhone.slice(2)
    const apiKey = process.env.TWOFACTOR_API_KEY

    if (!apiKey) {
      console.error("Missing TWOFACTOR_API_KEY environment variable.")
      // Delete stored OTP and return 503
      await redis.del(otpKey)
      return NextResponse.json(
        {
          error: "service_unavailable",
          message: "OTP service is temporarily busy. Please try again shortly.",
        },
        { status: 503 }
      )
    }

    let smsSuccess = false
    let smsAttempts = 0

    // Try sending SMS, retry once on failure
    while (smsAttempts < 2 && !smsSuccess) {
      try {
        const smsResponse = await send2FactorSMS(localPhone, otp)
        if (smsResponse.ok) {
          smsSuccess = true
        } else {
          const errorText = await smsResponse.text()
          console.error(`2Factor API error (Attempt ${smsAttempts + 1}):`, errorText)
        }
      } catch (err) {
        console.error(`2Factor fetch error (Attempt ${smsAttempts + 1}):`, err)
      }
      smsAttempts++
    }

    if (!smsSuccess) {
      // Clean up stored OTP and return 503
      await redis.del(otpKey)
      return NextResponse.json(
        {
          error: "service_unavailable",
          message: "OTP service is temporarily busy. Please try again shortly.",
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
    })
  } catch (error: unknown) {
    console.error("Send OTP Endpoint Error:", error)
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    )
  }
}
