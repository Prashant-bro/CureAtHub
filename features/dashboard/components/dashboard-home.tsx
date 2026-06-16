"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
  ExternalLink,
  Share2,
  Salad,
  Dumbbell,
  Clock,
  Droplets,
  Flame,
  ArrowRight,
  CalendarDays,
  Sun,
  Moon,
  Coffee,
  FileText,
  X,
  Copy,
  Download,
  Check,
  Loader2,
} from "lucide-react"

interface DashboardHomeProps {
  onNavigateToChat: () => void
  onNavigateToDiet: () => void
  onNavigateToReportAnalyzer: () => void
  userName?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
}

export function DashboardHome({ onNavigateToChat, onNavigateToDiet, onNavigateToReportAnalyzer, userName = "" }: DashboardHomeProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [sharingStatus, setSharingStatus] = useState<"idle" | "generating" | "done">("idle")

  const riskScore = 32
  const comparisonPercent = 70

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const progress = (riskScore / 100) * circumference

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Welcome back, <span className="text-gradient">{userName.split(" ")[0] || "there"}</span> 👋
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">Here's your health overview for today</p>
        </div>
        <motion.div
          className="hidden sm:flex items-center gap-2 bg-white/70 border border-orange-100/50 rounded-xl px-4 py-2 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CalendarDays className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-semibold text-slate-600">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2744] to-[#0F172A] p-6 sm:p-8 shadow-2xl shadow-slate-900/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </svg>
        </div>
        <motion.div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Health Risk Card</h3>
                <p className="text-white/40 text-xs">Powered by Mitig8 AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                title="Share your health score"
              >
                <Share2 className="w-4 h-4 text-white/70" />
              </motion.button>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Shield className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] font-bold text-white/70">MITIG8</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="space-y-5">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Patient Name</p>
                <p className="text-white font-bold text-xl">{userName || "Patient"}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-600">Low Risk</span>
                </div>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-white/50 text-xs">Last updated today</span>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/80 text-sm font-medium">Platform Comparison</span>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  Your health is better than <span className="text-emerald-400 font-bold text-lg">{comparisonPercent}%</span> of people on this platform
                </p>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${comparisonPercent}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  onClick={onNavigateToChat}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(255,87,34,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Try Yours
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white/80 px-4 py-2.5 rounded-xl font-semibold text-sm border border-white/10 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share Score
                </motion.button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
                  <motion.circle
                    cx="60" cy="60" r={radius} fill="none"
                    stroke="url(#riskGradientHome)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                  />
                  <defs>
                    <linearGradient id="riskGradientHome" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="50%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-3xl sm:text-4xl font-bold text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    {riskScore}
                  </motion.span>
                  <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mt-1">Risk Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={2}
        className="relative overflow-hidden rounded-3xl bg-[#FFF6EE] border border-orange-200/50 p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
        onClick={onNavigateToReportAnalyzer}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex gap-4 items-start sm:items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                AI Health Report Analyzer
                <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1 max-w-2xl">
                Upload your lab test PDF reports. Our AI immediately extracts glycemic metrics (HbA1c, glucose levels) to compile an interactive diagnostic dashboard.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation()
              onNavigateToReportAnalyzer()
            }}
            className="whitespace-nowrap inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
          >
            Analyze Report <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Droplets, label: "Water Intake", value: "6 / 8 glasses", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: Flame, label: "Calories", value: "1,420 kcal", color: "text-orange-500", bg: "bg-orange-50" },
          { icon: Dumbbell, label: "Activity", value: "32 min", color: "text-purple-500", bg: "bg-purple-50" },
          { icon: Clock, label: "Sleep", value: "7.5 hrs", color: "text-indigo-500", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp} initial="hidden" animate="visible" custom={i + 3}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2.5`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-sm font-bold text-[#0F172A] mt-0.5">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={7}
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Salad className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Today's Meal Plan</h4>
            </div>
            <button
              onClick={onNavigateToDiet}
              className="text-[11px] font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { time: "7:30 AM", icon: Coffee, meal: "Breakfast", food: "Moong dal cheela, green chutney", cal: "280 kcal", done: true },
              { time: "12:30 PM", icon: Sun, meal: "Lunch", food: "Brown rice, dal, mixed sabzi", cal: "420 kcal", done: true },
              { time: "4:00 PM", icon: Coffee, meal: "Snack", food: "Almonds + green tea", cal: "120 kcal", done: false },
              { time: "8:00 PM", icon: Moon, meal: "Dinner", food: "Roti, paneer bhurji, raita", cal: "380 kcal", done: false },
            ].map((item, i) => (
              <motion.div
                key={item.meal}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  item.done ? "bg-emerald-50/50 border border-emerald-100/50" : "bg-slate-50/40 border border-slate-100/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.done ? "bg-emerald-100" : "bg-slate-100"}`}>
                  <item.icon className={`w-4 h-4 ${item.done ? "text-emerald-500" : "text-slate-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{item.meal}</span>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                    {item.done && <span className="text-[9px] font-bold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded-full">Done</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.food}</p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 shrink-0">{item.cal}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={8}
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Today's Schedule</h4>
            </div>
            <button
              onClick={onNavigateToDiet}
              className="text-[11px] font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { time: "6:00 AM", activity: "Morning Walk", duration: "30 min", icon: "🚶", done: true },
              { time: "7:00 AM", activity: "Yoga & Stretching", duration: "20 min", icon: "🧘", done: true },
              { time: "10:00 AM", activity: "Blood Sugar Check", duration: "5 min", icon: "🩸", done: true },
              { time: "5:00 PM", activity: "Evening Exercise", duration: "45 min", icon: "💪", done: false },
              { time: "9:00 PM", activity: "Meditation", duration: "15 min", icon: "🧘‍♂️", done: false },
              { time: "10:00 PM", activity: "Night Blood Sugar Check", duration: "5 min", icon: "🩸", done: false },
            ].map((item, i) => (
              <motion.div
                key={item.activity}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  item.done ? "bg-blue-50/50 border border-blue-100/50" : "bg-slate-50/40 border border-slate-100/50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 text-base shadow-sm">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{item.activity}</span>
                    {item.done && <span className="text-[9px] font-bold text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">Done</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.time} • {item.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {shareDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShareDialogOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDF6EE] border border-orange-100 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100/50 bg-[#FFF6EE]/50">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Share Full Health Card</h3>
                </div>
                <button
                  onClick={() => setShareDialogOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div className="text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Export Preview</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1a2744] to-[#0F172A] p-5 text-white shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[11px] font-black tracking-wider text-orange-400">MITIG8 CARD</span>
                    </div>
                    <span className="text-[8px] font-bold text-white/50">{userName || "Patient"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[8px] text-white/40 uppercase tracking-widest">Diabetes Risk</p>
                      <h4 className="text-xl font-extrabold mt-0.5">32 <span className="text-xs text-white/40">/ 100</span></h4>
                      <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full mt-2 text-[8px] font-bold w-fit">
                        <Sparkles className="w-2 h-2" /> Low Risk
                      </div>
                    </div>

                    <div className="w-16 h-16 relative flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - 0.32)} />
                      </svg>
                      <span className="absolute text-xs font-black">32%</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 mt-4 pt-3 flex justify-between items-center text-[7px] text-white/30">
                    <span>Better than 70% of users</span>
                    <span>Verify at: mitig8.com</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      setSharingStatus("generating")
                      setTimeout(() => {
                        setSharingStatus("done")
                        setTimeout(() => {
                          setSharingStatus("idle")
                          alert("Full Health Card downloaded as Image (PNG) successfully!")
                        }, 800)
                      }, 1200)
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    disabled={sharingStatus !== "idle"}
                  >
                    {sharingStatus === "generating" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating Card Image...
                      </>
                    ) : sharingStatus === "done" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Card Image Downloaded!
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Download Full Card Image
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      const shareText = `Check out my Mitig8 Health Card!\nMy diabetes risk is 32/100 (Low Risk) and better than 70% of platform users. View card at: https://mitig8.com/share/rahul-sharma-risk-32`
                      await navigator.clipboard.writeText(shareText)
                      alert("Share link with full card copied to clipboard!")
                    }}
                    className="w-full bg-white hover:bg-orange-50/25 text-[#0F172A] border border-orange-200/50 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    Copy Share Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
