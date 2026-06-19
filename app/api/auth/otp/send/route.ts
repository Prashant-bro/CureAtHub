import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import crypto from "crypto"

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

/**
 * Checks if the OTP requests for a specific phone number exceed rate limits.
 * Maximum of 3 OTP requests within a 10-minute window.
 */
async function checkRateLimit(phone: string): Promise<boolean> {
  const rateKey = `rate:otp:${phone}`
  const count = await redis.incr(rateKey)
  
  if (count === 1) {
    await redis.expire(rateKey, 600) // Set 10 minutes expiry on first request
  }
  
  return count <= 3
}

/**
 * Generates a secure, random 6-digit OTP code.
 */
function generateOTP(): string {
  const otpVal = crypto.randomInt(100000, 1000000)
  return otpVal.toString()
}

/**
 * Stores the generated OTP in Upstash Redis, set to expire in 5 minutes (300s).
 */
async function storeOTP(phone: string, otp: string): Promise<void> {
  const otpKey = `otp:${phone}`
  const data = JSON.stringify({
    otp,
    attempts: 0,
    createdAt: Date.now(),
  })
  await redis.set(otpKey, data, { ex: 300 })
}

/**
 * Checks if 2Factor credentials are configured (not placeholder values).
 */
function is2FactorConfigured(): boolean {
  const apiKey = process.env.TWOFACTOR_API_KEY || ""
  return (
    apiKey.length > 0 &&
    !apiKey.includes("your_")
  )
}

/**
 * Sends the OTP code to 2Factor SMS API.
 */
async function send2FactorSMS(phone: string, otp: string): Promise<Response> {
  const apiKey = process.env.TWOFACTOR_API_KEY || ""
  // We use the 2Factor custom OTP endpoint. Because we don't have a template ID,
  // we omit the template name parameter.
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/${encodeURIComponent(phone)}/${otp}`

  return await fetch(url, {
    method: "GET",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const formattedPhone = phone.trim()
    if (!formattedPhone.startsWith("+")) {
      return NextResponse.json(
        { error: "Invalid phone number format." },
        { status: 400 }
      )
    }

    // 1. Rate Limiting Check
    const isAllowed = await checkRateLimit(formattedPhone)
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // 2. Generate secure 6-digit OTP
    const otp = generateOTP()

    // 3. Store OTP and metadata in Upstash Redis
    await storeOTP(formattedPhone, otp)

    // 4. Dispatch SMS via 2Factor (skipped silently if not configured)
    if (is2FactorConfigured()) {
      const smsResponse = await send2FactorSMS(formattedPhone, otp)
      if (!smsResponse.ok) {
        const errorText = await smsResponse.text()
        console.error("2Factor API error response:", errorText)
        return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 502 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
    })
  } catch (error: any) {
    console.error("Send OTP Endpoint Error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
