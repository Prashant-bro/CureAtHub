import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { verifyUserId } from '@/lib/rateLimitOtp'

/**
 * Server-side Supabase client.
 * Reads/writes cookies for session management in Server Components,
 * Route Handlers, and Server Actions.
 * ⚠️ Never import this in Client Components.
 */
export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookie mutation is handled
            // by the middleware refresh instead.
          }
        },
      },
    }
  )

  // Wrap client.auth.getUser to fallback to signed otp-user-id cookie
  const originalGetUser = client.auth.getUser.bind(client.auth)
  client.auth.getUser = async (jwtToken?: string) => {
    const result = await originalGetUser(jwtToken)
    if (!result.data.user) {
      const signedCookie = cookieStore.get("otp-user-id")?.value
      if (signedCookie) {
        const verifiedUserId = verifyUserId(signedCookie)
        if (verifiedUserId) {
          return {
            data: {
              user: {
                id: verifiedUserId,
                aud: "authenticated",
                role: "authenticated",
                email: "",
                phone: "",
                app_metadata: {},
                user_metadata: {},
                created_at: "",
              } as any,
            },
            error: null,
          }
        }
      }
    }
    return result
  }

  return client
}
