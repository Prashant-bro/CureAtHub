import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  // ── Route Guards ──────────────────────────────────────────
  const { pathname } = request.nextUrl

  // Get mock-login cookie for frontend-only testing bypass
  const isMockLoggedIn = request.cookies.get('mock-login')?.value === 'true'

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
