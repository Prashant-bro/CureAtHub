import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redis } from '@/lib/rateLimitOtp'
import jwt from 'jsonwebtoken'

/**
 * OAuth & Email Confirmation Callback Handler
 *
 * Supabase redirects to this route after:
 *   1. Google OAuth sign-in/sign-up
 *   2. Email confirmation link click
 *   3. Password reset link click
 *
 * Route: /auth/callback
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // After successful auth, send user here
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Register session in Redis for single-device restriction
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const decoded = jwt.decode(session.access_token) as any
          const userId = decoded?.sub
          const sessionId = decoded?.session_id
          if (userId && sessionId) {
            await redis.set(`active_session:${userId}`, sessionId, { ex: 60 * 60 * 24 * 7 })
          }
        }
      } catch (err) {
        console.error("Failed to register session in callback:", err)
      }

      // Redirect to the intended destination
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // In development: use the local origin
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // In production: use the forwarded host (handles proxy/CDN)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // If code exchange failed, redirect to auth page with an error message
  return NextResponse.redirect(
    `${origin}/auth?error=Could+not+authenticate+user`
  )
}
