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
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackRating, setFeedbackRating] = useState<number>(0)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [latestReport, setLatestReport] = useState<any>(null)
  const [subscriptionState, setSubscriptionState] = useState<"trial" | "expired" | "premium">("trial")
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(3)
  const [notifications, setNotifications] = useState<any[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // ── Real user from Supabase ───────────────────────────
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [userInitials, setUserInitials] = useState<string>("?")
  const [userPhone, setUserPhone] = useState<string>("")
  const [userAge, setUserAge] = useState<string>("")
  const [userDob, setUserDob] = useState<string>("")
  const [userGender, setUserGender] = useState<string>("")
  const [userBloodGroup, setUserBloodGroup] = useState<string>("")

  const handleUploadProfileImage = async (img: string | null) => {
    setProfileImage(img)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await fetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            avatar_url: img,
            profile_image: img,
          }),
        })
      }
    } catch (err) {
      // safe silent error handling
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        // Fallback for mock frontend-only login testing
        const isMockLoggedIn = document.cookie.includes("mock-login=true")
        if (isMockLoggedIn) {
          const match = document.cookie.match(/(?:^|; )mock-login-provider=([^;]*)/)
          const provider = match ? match[1] : "email"
          
          if (provider === "phone") {
            setUserName("Alex Smith")
            setUserEmail("alexsmith@example.com")
            setUserInitials("AS")
            setUserPhone("+91 98765 43210")
          } else {
            setUserName("John Doe")
            setUserEmail("johndoe@gmail.com")
            setUserInitials("JD")
            setUserPhone("+91 88888 88888")
          }
        }
        return
      }
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        ""
      const email = user.email ?? ""
      setUserName(fullName || email.split("@")[0])
      setUserEmail(email)

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (profile) {
          if (profile.full_name) setUserName(profile.full_name)
          if (profile.phone) setUserPhone(profile.phone)
          if (profile.age) setUserAge(String(profile.age))
          if (profile.date_of_birth) setUserDob(profile.date_of_birth)
          if (profile.gender) setUserGender(profile.gender)
          if (profile.blood_group) setUserBloodGroup(profile.blood_group)

          const img = profile.avatar_url || profile.profile_image
          if (img) setProfileImage(img)

          const report = profile.latest_report || profile.medical_report
          if (report) setLatestReport(report)
        } else {
          if (user.phone) setUserPhone(user.phone)
        }
      } catch (err) {
        // safe empty catch or log-less error handling
      }

      // Compute initials from name
      const nameToUse = fullName || email.split("@")[0]
      const parts = nameToUse.trim().split(" ").filter(Boolean)
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
    // Switch instantly — skeleton only shows on initial load or offline, never on tab switch
    setActiveSection(section)
    setHasConnectionError(false)
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
              Your 3-Day Free Trial Has Ended
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
            latestReport={latestReport}
          />
        )
      case "chat":
        return <DashboardChat onOpenSidebar={() => setSidebarOpen(true)} />
      case "report-analyzer":
        return (
          <DashboardReportAnalyzer
            onReportScanned={(report) => setLatestReport(report)}
          />
        )
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
        return <DashboardCommunity userName={userName} userInitials={userInitials} />
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
                setProfileImage={handleUploadProfileImage}
                subscriptionState={subscriptionState}
                trialDaysLeft={trialDaysLeft}
                userName={userName}
                userEmail={userEmail}
                userInitials={userInitials}
                userPhone={userPhone}
                userAge={userAge}
                userGender={userGender}
                userBloodGroup={userBloodGroup}
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
        <div className="px-5 py-5 flex items-center justify-between border-b border-orange-50 lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-orange-50 transition-colors ml-auto"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>




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

          <motion.button
            onClick={() => setFeedbackOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-[#0F172A] hover:bg-slate-50/60 transition-all cursor-pointer"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} />
            <span>Give Feedback</span>
          </motion.button>


           <button
            onClick={async () => {
              document.cookie = "mock-login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
              document.cookie = "mock-login-provider=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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
                <div className="relative">
                  <motion.button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 rounded-xl bg-white/60 border border-orange-100/50 hover:bg-white transition-all shadow-sm cursor-pointer"
                  >
                    <Bell className="w-[18px] h-[18px] text-slate-500" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 cursor-default" 
                          onClick={() => setNotificationsOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-orange-100/60 shadow-xl z-50 overflow-hidden"
                        >
                          <div className="p-4 border-b border-orange-50 flex items-center justify-between">
                            <span className="font-bold text-sm text-[#0F172A]">Notifications</span>
                            {notifications.length > 0 && (
                              <button 
                                onClick={() => setNotifications([])}
                                className="text-xs text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                          <div className="max-h-72 overflow-y-auto p-2">
                            {notifications.length === 0 ? (
                              <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                  <Bell className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-semibold text-slate-700">No notifications</p>
                                  <p className="text-xs text-slate-400">You're all caught up!</p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {notifications.map((noti) => (
                                  <div key={noti.id} className="p-3 hover:bg-orange-50/50 rounded-xl transition-colors cursor-pointer flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                      <Bell className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-slate-800 leading-tight">{noti.title}</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{noti.message}</p>
                                      <p className="text-[9px] text-slate-400 mt-1">{noti.time}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
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

        <main className={`flex-1 min-h-0 overflow-hidden ${activeSection === "chat" && !loadingSection && isOnline && !hasConnectionError ? "p-0" : "px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto"}`}>
          <AnimatePresence>
            <motion.div
              key={loadingSection ? "loading" : (!isOnline || hasConnectionError) ? "offline" : activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
              className={activeSection === "chat" && !loadingSection && isOnline && !hasConnectionError ? "h-full flex flex-col" : ""}
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

      <AnimatePresence>
        {feedbackOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!feedbackSubmitting) {
                  setFeedbackOpen(false)
                  setFeedbackSubmitted(false)
                  setFeedbackText("")
                  setFeedbackRating(0)
                }
              }}
              className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl p-6 shadow-2xl z-[90] border border-orange-100 flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between border-b border-orange-50 pb-3">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-orange-500" />
                  Give Feedback
                </h3>
                <button
                  disabled={feedbackSubmitting}
                  onClick={() => {
                    setFeedbackOpen(false)
                    setFeedbackSubmitted(false)
                    setFeedbackText("")
                    setFeedbackRating(0)
                  }}
                  className="p-1.5 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {!feedbackSubmitted ? (
                <div className="space-y-4 pt-1">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We'd love to hear your thoughts! Help us improve Mitig8 by rating your experience and sharing suggestions.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 cursor-pointer text-2xl outline-none"
                        >
                          <span className={star <= feedbackRating ? "text-amber-400" : "text-slate-200"}>
                            ★
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="feedback-text" className="text-xs font-bold text-slate-700 block">Comment</label>
                    <textarea
                      id="feedback-text"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell us what you liked, or where we can improve..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (feedbackRating === 0) {
                        alert("Please select a star rating.")
                        return
                      }
                      setFeedbackSubmitting(true)
                      try {
                        await fetch("/api/feedback", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            rating: feedbackRating,
                            comment: feedbackText,
                            user: userName || userEmail || "Anonymous",
                          }),
                        })
                        setFeedbackSubmitted(true)
                      } catch (err) {
                        setFeedbackSubmitted(true)
                      } finally {
                        setFeedbackSubmitting(false)
                      }
                    }}
                    disabled={feedbackRating === 0 || feedbackSubmitting}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/10 disabled:opacity-40 disabled:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#0F172A]">Thank You for Your Feedback!</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Your ratings and comments have been successfully recorded. We will use them to fine-tune our algorithms and AI suggestions!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFeedbackOpen(false)
                      setFeedbackSubmitted(false)
                      setFeedbackText("")
                      setFeedbackRating(0)
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
