"use client"

import React from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"

interface DashboardHomeProps {
  onNavigateToChat: () => void
  onNavigateToDiet: () => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export function DashboardHome({ onNavigateToChat, onNavigateToDiet }: DashboardHomeProps) {
  const riskScore = 32
  const comparisonPercent = 70

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const progress = (riskScore / 100) * circumference

  const handleShare = async () => {
    const shareData = {
      title: "My Diapredix Health Score",
      text: `My diabetes risk score is ${riskScore}/100. I'm healthier than ${comparisonPercent}% of users on Diapredix! Check yours →`,
      url: "https://diapredix.com",
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
        alert("Link copied to clipboard!")
      }
    } catch { /* user cancelled */ }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Welcome back, <span className="text-gradient">Rahul</span> 👋
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

      {/* Health Risk Card */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1a2744] to-[#0F172A] p-6 sm:p-8 shadow-2xl shadow-slate-900/20"
      >
        {/* Decorative */}
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
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Health Risk Card</h3>
                <p className="text-white/40 text-xs">Powered by Diapredix AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Share Button */}
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
                <span className="text-[10px] font-bold text-white/70">DIAPREDIX</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-center">
            {/* Left: Info */}
            <div className="space-y-5">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Patient Name</p>
                <p className="text-white font-bold text-xl">Rahul Sharma</p>
              </div>

              {/* Risk Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-600">Low Risk</span>
                </div>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-white/50 text-xs">Last updated today</span>
              </div>

              {/* Comparison Stat */}
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

              {/* Actions Row */}
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

            {/* Right: Risk Score Gauge */}
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Droplets, label: "Water Intake", value: "6 / 8 glasses", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: Flame, label: "Calories", value: "1,420 kcal", color: "text-orange-500", bg: "bg-orange-50" },
          { icon: Dumbbell, label: "Activity", value: "32 min", color: "text-purple-500", bg: "bg-purple-50" },
          { icon: Clock, label: "Sleep", value: "7.5 hrs", color: "text-indigo-500", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp} initial="hidden" animate="visible" custom={i + 2}
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

      {/* Today's Schedule & Diet Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Meal Plan */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={6}
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
              View All <ArrowRight className="w-3 h-3" />
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

        {/* Today's Schedule */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={7}
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
              View All <ArrowRight className="w-3 h-3" />
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
    </div>
  )
}
