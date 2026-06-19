import { AuthPage } from "@/features/auth"

// Prevent static prerendering — auth state is always dynamic
export const dynamic = "force-dynamic"

export default function Page() {
  return <AuthPage />
}
