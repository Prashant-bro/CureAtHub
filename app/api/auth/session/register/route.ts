import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { redis } from "@/lib/rateLimitOtp"
import jwt from "jsonwebtoken"

/**
 * Registers the active session ID in Redis for a logged-in user.
 * Called immediately after successful client-side sign-in.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: "unauthorized", message: "No active session found." },
        { status: 401 }
      )
    }

    const token = session.access_token
    const decoded = jwt.decode(token) as any
    const userId = decoded?.sub
    const sessionId = decoded?.session_id

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: "invalid_token", message: "Invalid session token claims." },
        { status: 400 }
      )
    }

    // Register active session ID in Redis with 7-day expiration (matches refresh token expiration)
    await redis.set(`active_session:${userId}`, sessionId, { ex: 60 * 60 * 24 * 7 })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Register Session Endpoint Error:", error)
    return NextResponse.json(
      { error: "internal_error", message: "Failed to register active session." },
      { status: 500 }
    )
  }
}
