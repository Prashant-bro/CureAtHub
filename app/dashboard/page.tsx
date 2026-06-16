import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/features/dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Double-check on the server — middleware covers most cases,
  // but this is a defense-in-depth guard for direct server renders.
  if (!user) {
    redirect("/auth")
  }

  return <DashboardLayout />
}
