import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { redis } from '@/lib/rateLimitOtp'
import jwt from 'jsonwebtoken'

/**
 * Supabase middleware utility.
 * Refreshes the user's session cookie on every request so it never
 * expires unexpectedly mid-session. Must be called from middleware.ts.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do NOT remove this line.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── Route Guards & Session Checks ─────────────────────────
  const { pathname } = request.nextUrl
  // mock-login is ONLY honoured in development to prevent production auth bypass
  const isMockLoggedIn = process.env.NODE_ENV === 'development'
    && request.cookies.get('mock-login')?.value === 'true'

  // Single-device restriction check
  const bypassRoutes = ['/api/auth/session/register', '/auth/callback', '/api/auth/otp/verify']
  const shouldBypassCheck = bypassRoutes.some((route) => pathname.startsWith(route))

  if (user && !isMockLoggedIn && !shouldBypassCheck) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const decoded = jwt.decode(session.access_token) as any
        const sessionId = decoded?.session_id
        const userId = user.id

        if (sessionId && userId) {
          const activeSessionId = await redis.get(`active_session:${userId}`)
          if (activeSessionId && activeSessionId !== sessionId) {
            // Active session doesn't match current session -> logout
            await supabase.auth.signOut()

            if (pathname.startsWith('/api/')) {
              const apiResponse = NextResponse.json(
                { error: "unauthorized", message: "Logged out from another device." },
                { status: 401 }
              )
              // Copy cookies updated by signOut() to the response
              supabaseResponse.cookies.getAll().forEach((cookie) => {
                apiResponse.cookies.set(cookie.name, cookie.value, {
                  path: cookie.path,
                  domain: cookie.domain,
                  maxAge: cookie.maxAge,
                  secure: cookie.secure,
                  httpOnly: cookie.httpOnly,
                  sameSite: cookie.sameSite,
                })
              })
              return apiResponse
            } else if (pathname !== '/auth') {
              const url = request.nextUrl.clone()
              url.pathname = '/auth'
              url.searchParams.set('error', 'multiple_devices')

              const redirectResponse = NextResponse.redirect(url)
              // Copy cookies updated by signOut() to the response
              supabaseResponse.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value, {
                  path: cookie.path,
                  domain: cookie.domain,
                  maxAge: cookie.maxAge,
                  secure: cookie.secure,
                  httpOnly: cookie.httpOnly,
                  sameSite: cookie.sameSite,
                })
              })
              return redirectResponse
            }
          }
        }
      }
    } catch (err) {
      console.error("Middleware single-device check error:", err)
    }
  }

  // Unauthenticated users trying to access protected routes → redirect to /auth
  const protectedRoutes = ['/dashboard', '/auth/onboarding']
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !user && !isMockLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Authenticated users trying to access /auth → redirect to /dashboard
  if (pathname === '/auth' && (user || isMockLoggedIn)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
