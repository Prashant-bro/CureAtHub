import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
