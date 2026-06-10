"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Activity,
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
} from "lucide-react"
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
  const router = useRouter()

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <DashboardHome
            onNavigateToChat={() => setActiveSection("chat")}
            onNavigateToDiet={() => setActiveSection("diet")}
            onNavigateToReportAnalyzer={() => setActiveSection("report-analyzer")}
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
        return <DashboardPricing />
      case "community":
        return <DashboardCommunity />
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex">
      {/* Mobile Sidebar Overlay */}
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

      {/* Profile Panel Overlay */}
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

      {/* Profile Slide-out Panel */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-[#FDF6EE] border-l border-orange-100/50 z-[70] flex flex-col shadow-2xl"
          >
            {/* Panel Header */}
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
            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <DashboardProfile
                onNavigateToChat={() => { setProfileOpen(false); setActiveSection("chat") }}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-white/70 backdrop-blur-xl border-r border-orange-100/50 z-50 flex flex-col transition-transform lg:transition-none duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between border-b border-orange-50">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#0F172A]">Dia</span>
              <span className="text-gradient">predix</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* User Mini-Profile (clickable → opens profile panel) */}
        <button
          onClick={() => { setProfileOpen(true); setSidebarOpen(false) }}
          className="px-5 py-4 border-b border-orange-50 flex items-center gap-3 hover:bg-orange-50/40 transition-colors w-full text-left group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow overflow-hidden shrink-0">
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              "RS"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0F172A] truncate">Rahul Sharma</p>
            <p className="text-[11px] text-slate-400 truncate">View Profile →</p>
          </div>
          <UserCircle className="w-5 h-5 text-slate-300 group-hover:text-orange-400 transition-colors" />
        </button>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
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

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t border-orange-50 space-y-1">
          <button
            onClick={() => {
              setActiveSection("pricing")
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
              activeSection === "pricing"
                ? "text-orange-600 bg-orange-50/80"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/60"
            }`}
          >
            {activeSection === "pricing" && (
              <motion.div
                layoutId="sidebar-indicator-bottom"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <Sparkles className="w-[18px] h-[18px]" strokeWidth={activeSection === "pricing" ? 2.5 : 2} />
            <span>Prices</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/60 transition-all">
            <Settings className="w-[18px] h-[18px]" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-50/60 transition-all"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Log Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0">
        {/* Header */}
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
                    "RS"
                  )}
                </motion.button>
              </div>
            </div>
          </header>
        )}

        {/* Section Content */}
        <main className={`flex-1 ${activeSection === "chat" ? "p-0" : "px-4 sm:px-6 lg:px-8 py-6"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className={activeSection === "chat" ? "h-screen flex flex-col" : ""}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
