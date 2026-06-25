import { NextRequest, NextResponse } from "next/server"
import { getRealIP, redis } from "@/lib/rateLimitOtp"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ──────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to submit feedback." },
        { status: 401 }
      )
    }

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

    const { rating, comment, user: feedbackUser } = await req.json()

    if (!rating) {
      return NextResponse.json({ error: "Rating is required" }, { status: 400 })
    }

    const feedbackItem = {
      rating,
      comment: comment || "",
      user: feedbackUser || "Anonymous",
      timestamp: new Date().toISOString(),
    }

    // Store in Supabase
    const { error: insertError } = await supabase
      .from("feedback")
      .insert({
        user_id: user.id,
        rating,
        comment: comment || "",
      })

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Feedback submission API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

