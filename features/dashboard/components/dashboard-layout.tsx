"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardSkeleton } from "./dashboard-skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Home,
  MessageCircle,
  FileText,
  Camera,
  Dumbbell,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  UserCircle,
  Sparkles,
  Trophy,
  RefreshCw,
  Crown,
  Lock,
} from "lucide-react"
import { Mitig8Logo } from "@/components/mitig8-logo"
import { DashboardHome } from "./dashboard-home"
import { DashboardProfile } from "./dashboard-profile"
import { DashboardChat } from "./dashboard-chat"
import { DashboardMealScan } from "./dashboard-meal-scan"
import { DashboardDiet } from "./dashboard-diet"
import { DashboardReportAnalyzer } from "./dashboard-report-analyzer"
import { DashboardPricing } from "./dashboard-pricing"
import { DashboardCommunity } from "./dashboard-community"

type ActiveSection = "home" | "chat" | "report-analyzer" | "meal-scan" | "diet" | "pricing" | "community"

const navItems = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "chat" as const, label: "AI Chat", icon: MessageCircle },
  { id: "report-analyzer" as const, label: "Report Analyzer", icon: FileText },
  { id: "meal-scan" as const, label: "Meal Scanner", icon: Camera },
  { id: "diet" as const, label: "Diet & Exercise", icon: Dumbbell },
  { id: "community" as const, label: "Community & Rewards", icon: Trophy },
]

const sectionSubtitles: Record<ActiveSection, string> = {
  home: "Your health overview at a glance",
  chat: "Chat with your AI health assistant",
  "report-analyzer": "Analyze health reports & medical PDFs",
  "meal-scan": "Scan & analyze your meals",
  diet: "Track diet & exercise plans",
  pricing: "Premium upgrade plans and pricing offers",
  community: "See success stories, leaderboards, and rewards",
}

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [subscriptionState, setSubscriptionState] = useState<"trial" | "expired" | "premium">("trial")
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(7)
  const router = useRouter()
  const supabase = createClient()

  // ── Real user from Supabase ───────────────────────────
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [userInitials, setUserInitials] = useState<string>("?")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        ""
      const email = user.email ?? ""
      setUserName(fullName || email.split("@")[0])
      setUserEmail(email)
      // Compute initials from name
      const parts = fullName.trim().split(" ").filter(Boolean)
      if (parts.length >= 2) {
        setUserInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase())
      } else if (parts.length === 1) {
        setUserInitials(parts[0].slice(0, 2).toUpperCase())
      } else {
        setUserInitials(email.slice(0, 2).toUpperCase())
      }
    })
  }, [])

  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [loadingSection, setLoadingSection] = useState<boolean>(true)
  const [hasConnectionError, setHasConnectionError] = useState<boolean>(false)

  const checkIsSlowConnection = (): boolean => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      if (conn) {
        if (conn.saveData || ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) {
          return true
        }
      }
    }
    return false
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(window.navigator.onLine)
      const handleOnline = () => {
        setIsOnline(true)
        setHasConnectionError(false)
      }
      const handleOffline = () => {
        setIsOnline(false)
      }
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      const isPoorConnection = checkIsSlowConnection()
      if (!isPoorConnection && window.navigator.onLine) {
        setLoadingSection(false)
      } else {
        const loadTimer = setTimeout(() => {
          setLoadingSection(false)
          if (!window.navigator.onLine) {
            setHasConnectionError(true)
          }
        }, 1200)

        return () => {
          window.removeEventListener("online", handleOnline)
          window.removeEventListener("offline", handleOffline)
          clearTimeout(loadTimer)
        }
      }

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  const handleSectionChange = (section: ActiveSection) => {
    const isPoorConnection = checkIsSlowConnection()

    if (!isPoorConnection && window.navigator.onLine) {
      setActiveSection(section)
      setHasConnectionError(false)
      setLoadingSection(false)
      return
    }

    setLoadingSection(true)
    setHasConnectionError(false)

    setTimeout(() => {
      setActiveSection(section)
      if (!window.navigator.onLine) {
        setHasConnectionError(true)
      }
      setLoadingSection(false)
    }, 1200)
  }

  const handleRetryConnection = () => {
    setLoadingSection(true)
    setTimeout(() => {
      setLoadingSection(false)
      if (!window.navigator.onLine) {
        setHasConnectionError(true)
      } else {
        setHasConnectionError(false)
      }
    }, 1000)
  }

  const renderSection = () => {
    if (subscriptionState === "expired" && activeSection !== "pricing") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shadow-lg shadow-red-500/10 border border-red-100 animate-bounce">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase animate-pulse">
              Trial Expired
            </span>
            <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mt-2">
              Your 7-Day Free Trial Has Ended
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your trial period has expired and access to Mitig8 features is currently suspended. Please subscribe to a premium plan to continue tracking your blood glucose, scanning meals, and chatting with the AI.
            </p>
          </div>
          <button
            onClick={() => handleSectionChange("pricing")}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Subscribe to Premium Plan
          </button>
        </div>
      )
    }

    switch (activeSection) {
      case "home":
        return (
          <DashboardHome
            onNavigateToChat={() => handleSectionChange("chat")}
            onNavigateToDiet={() => handleSectionChange("diet")}
            onNavigateToReportAnalyzer={() => handleSectionChange("report-analyzer")}
            userName={userName}
          />
        )
      case "chat":
        return <DashboardChat onOpenSidebar={() => setSidebarOpen(true)} />
      case "report-analyzer":
        return <DashboardReportAnalyzer />
      case "meal-scan":
        return <DashboardMealScan />
      case "diet":
        return <DashboardDiet />
      case "pricing":
        return (
          <DashboardPricing
            subscriptionState={subscriptionState}
            onSubscribe={(planName, price) => {
              setSubscriptionState("premium")
              alert(`Thank you for subscribing! Your ${planName} is now active. Full Premium access has been successfully unlocked.`)
            }}
          />
        )
      case "community":
        return <DashboardCommunity />
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProfileOpen(false)}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-[#FDF6EE] border-l border-orange-100/50 z-[70] flex flex-col shadow-2xl"
          >
            <div className="px-5 py-4 flex items-center justify-between border-b border-orange-100/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">My Profile</h3>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="p-2 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <DashboardProfile
                onNavigateToChat={() => { setProfileOpen(false); handleSectionChange("chat") }}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                subscriptionState={subscriptionState}
                trialDaysLeft={trialDaysLeft}
                userName={userName}
                userEmail={userEmail}
                userInitials={userInitials}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-white/70 backdrop-blur-xl border-r border-orange-100/50 z-50 flex flex-col transition-transform lg:transition-none duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 flex items-center justify-between border-b border-orange-50">
          <Link href="/">
            <Mitig8Logo size="sm" theme="dark" animated={false} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <button
          onClick={() => { setProfileOpen(true); setSidebarOpen(false) }}
          className="px-5 py-4 border-b border-orange-50 flex items-center gap-3 hover:bg-orange-50/40 transition-colors w-full text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow overflow-hidden shrink-0">
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              userInitials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0F172A] truncate">{userName}</p>
            {subscriptionState === "premium" ? (
              <div className="flex items-center gap-1 mt-0.5">
                <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-amber-600">Premium Member</span>
              </div>
            ) : subscriptionState === "expired" ? (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-500">Trial Expired</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-bold text-orange-500">Trial: {trialDaysLeft}d left</span>
              </div>
            )}
          </div>
          <UserCircle className="w-5 h-5 text-slate-300 group-hover:text-orange-400 transition-colors" />
        </button>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  handleSectionChange(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? "text-orange-600 bg-orange-50/80"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/60"
                }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
              </motion.button>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-orange-50 space-y-1">
          <motion.button
            onClick={() => {
              handleSectionChange("pricing")
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
              activeSection === "pricing"
                ? "text-orange-600 bg-orange-50/80"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/60"
            }`}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeSection === "pricing" && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <Crown className="w-[18px] h-[18px]" strokeWidth={activeSection === "pricing" ? 2.5 : 2} />
            <span>Pricing & Plans</span>
            {activeSection === "pricing" && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
          </motion.button>

          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/60 transition-all">
            <Settings className="w-[18px] h-[18px]" />
            <span>Settings</span>
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/")
              router.refresh()
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-50/60 transition-all"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Log Out</span>
          </button>
        </div>


      </motion.aside>

      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {activeSection !== "chat" && (
          <header className="sticky top-0 z-30 bg-[#FDF6EE]/80 backdrop-blur-xl border-b border-orange-100/40 px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <Menu className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">
                    {navItems.find((n) => n.id === activeSection)?.label}
                  </h2>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    {sectionSubtitles[activeSection]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-xl bg-white/60 border border-orange-100/50 hover:bg-white transition-all shadow-sm"
                >
                  <Bell className="w-[18px] h-[18px] text-slate-500" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                </motion.button>
                <motion.button
                  onClick={() => setProfileOpen(true)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  {profileImage ? (
                    <img src={profileImage} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    userInitials
                  )}
                </motion.button>
              </div>
            </div>
          </header>
        )}

        {!isOnline && (
          <div className="bg-red-500 text-white text-[11px] font-bold px-4 py-2.5 flex items-center justify-between shadow-sm z-50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Offline Mode: The application is currently running offline. Checking network quality...</span>
            </div>
          </div>
        )}

        <main className={`flex-1 ${activeSection === "chat" && !loadingSection && isOnline && !hasConnectionError ? "p-0" : "px-4 sm:px-6 lg:px-8 py-6"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingSection ? "loading" : (!isOnline || hasConnectionError) ? "offline" : activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className={activeSection === "chat" && !loadingSection && isOnline && !hasConnectionError ? "h-screen flex flex-col" : ""}
            >
              {loadingSection ? (
                <DashboardSkeleton type="loading" />
              ) : (!isOnline || hasConnectionError) ? (
                <DashboardSkeleton type="offline" onRetry={handleRetryConnection} />
              ) : (
                renderSection()
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
