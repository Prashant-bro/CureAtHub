import { NextRequest, NextResponse } from "next/server"
import { getRealIP, redis } from "@/lib/rateLimitOtp"

export async function POST(req: NextRequest) {
  try {
    const ip = getRealIP(req)
    const limitKey = `rate:feedback:ip:${ip}`
    const count = await redis.incr(limitKey)
    if (count === 1) {
      await redis.expire(limitKey, 60)
    }
    if (count > 5) {
      return NextResponse.json(
        { error: "Too many feedback submissions. Please wait a minute and try again." },
        { status: 429 }
      )
    }

    const { rating, comment, user } = await req.json()

    if (!rating) {
      return NextResponse.json({ error: "Rating is required" }, { status: 400 })
    }

    const feedbackItem = {
      rating,
      comment: comment || "",
      user: user || "Anonymous",
      timestamp: new Date().toISOString(),
    }

    // Store in Redis list
    await redis.lpush("mitig8_feedback", JSON.stringify(feedbackItem))

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Feedback submission API error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
