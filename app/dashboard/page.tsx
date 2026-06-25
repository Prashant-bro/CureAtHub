import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/features/dashboard"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const isMockLoggedIn = process.env.NODE_ENV === 'development'
    && cookieStore.get("mock-login")?.value === "true"

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isMockLoggedIn) {
    redirect("/auth")
  }

  return <DashboardLayout />
}
