"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Flower2,
  Bell,
  Trophy,
  Crown,
  Sparkles,
  Activity,
  Flame,
  ThumbsUp,
  CreditCard,
  Lock,
} from "lucide-react"

const playTone = (freq = 440, type: OscillatorType = "sine", duration = 0.1) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {}
}

const bounceInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14, mass: 0.6 },
  },
}

const bounceInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14, mass: 0.6 },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.04 },
  },
}

export function WellnessSection() {
  const sectionRef = useRef(null)

  const [yogaActiveTab, setYogaActiveTab] = useState<"yoga" | "diet">("yoga")
  const [selectedPose, setSelectedPose] = useState(0)
  const [selectedRecipe, setSelectedRecipe] = useState(0)

  const yogaPoses = [
    { name: "Mandukasana (Frog Pose)", duration: "3 min", target: "Pancreas stimulation & digestion" },
    { name: "Paschimottanasana", duration: "2 min", target: "Abdominal organ compression" },
    { name: "Ardha Matsyendrasana", duration: "4 min", target: "Spinal twist & liver massage" },
  ]

  const dietTips = [
    { title: "Ragi & Oats Dosa", carbs: "22g", advantage: "Slow release fiber prevents spikes" },
    { title: "Sprouted Moong Salad", carbs: "14g", advantage: "High protein & magnesium content" },
    { title: "Cinnamon Mint Tea", carbs: "0g", advantage: "Naturally improves insulin sensitivity" },
  ]

  const [fastingSeconds, setFastingSeconds] = useState(48210)
  const [showReminderToast, setShowReminderToast] = useState(false)
  const [reminderSecondsLeft, setReminderSecondsLeft] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFastingSeconds((prev) => (prev > 0 ? prev - 1 : 48200))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatFastingTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const triggerMockReminder = () => {
    if (showReminderToast) return
    playTone(500, "sine", 0.08)
    setReminderSecondsLeft(4)
    setShowReminderToast(true)
  }

  useEffect(() => {
    if (showReminderToast && reminderSecondsLeft > 0) {
      const timeout = setTimeout(() => {
        setReminderSecondsLeft((prev) => {
          if (prev <= 1) {
            setShowReminderToast(false)
            playTone(800, "triangle", 0.25)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [showReminderToast, reminderSecondsLeft])

  const [likes, setLikes] = useState([18, 42])
  const [hasLiked, setHasLiked] = useState([false, false])
  const [streakCount, setStreakCount] = useState(5)

  const handleLike = (idx: number) => {
    const nextHasLiked = [...hasLiked]
    const nextLikes = [...likes]

    if (!nextHasLiked[idx]) {
      nextHasLiked[idx] = true
      nextLikes[idx] += 1
      playTone(600 + idx * 100, "sine", 0.1)
    } else {
      nextHasLiked[idx] = false
      nextLikes[idx] -= 1
      playTone(350, "sine", 0.08)
    }

    setHasLiked(nextHasLiked)
    setLikes(nextLikes)
  }

  const claimDailyStreak = () => {
    playTone(900, "sine", 0.3)
    setStreakCount((prev) => prev + 1)
  }

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually")
  const [analyticsUnlocked, setAnalyticsUnlocked] = useState(false)

  const basePrice = billingCycle === "monthly" ? 170 : 141

  return (
    <section
      id="wellness"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white via-[#FFFBF7] to-[#FFFBF7] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4">
            Wellness Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Beyond analytics — <span className="text-gradient">a complete wellness platform</span>
          </h2>
          <p className="text-slate-500 text-lg mt-4 leading-relaxed">
            Certified yoga modules, smart reminders, gamified tracking, and premium features to keep you engaged and healthy.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
          >
            <motion.div variants={bounceInLeft} className="lg:col-span-6">
              <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none">
                  <Image
                    src="/images/yoga_diet_modules.png"
                    alt="Yoga & Diet illustration"
                    width={220}
                    height={220}
                    className="rounded-tr-3xl object-cover"
                  />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                        Holistic Yoga & Diet
                      </span>
                      <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => {
                            playTone(450, "sine", 0.08)
                            setYogaActiveTab("yoga")
                          }}
                          className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                            yogaActiveTab === "yoga" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          Yoga Sequence
                        </button>
                        <button
                          onClick={() => {
                            playTone(450, "sine", 0.08)
                            setYogaActiveTab("diet")
                          }}
                          className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                            yogaActiveTab === "diet" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          Dietary Recipes
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-3">Active Modules Sandbox</h4>
                    <p className="text-[11px] text-slate-400">Click elements below to simulate natural glucose alignment routines.</p>
                  </div>

                  <div className="my-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm text-left">
                    <AnimatePresence mode="wait">
                      {yogaActiveTab === "yoga" ? (
                        <motion.div
                          key="yoga-content"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="space-y-3"
                        >
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">SELECT POSE TO PRACTICE</span>
                          <div className="space-y-2">
                            {yogaPoses.map((p, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  playTone(500 + idx * 50, "triangle", 0.1)
                                  setSelectedPose(idx)
                                }}
                                className={`p-2 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                  selectedPose === idx
                                    ? "bg-emerald-50 border-emerald-300 shadow-sm text-emerald-800"
                                    : "bg-white border-slate-100 hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${selectedPose === idx ? "bg-emerald-500 animate-ping" : "bg-slate-300"}`} />
                                  <span className="text-[11px] font-bold">{p.name}</span>
                                </div>
                                <span className="text-[9px] font-bold bg-white border border-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                                  {p.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-white border border-emerald-100 rounded-xl p-2.5 text-[10px] text-slate-600">
                            <span className="font-bold text-slate-700 block">Glucose Target:</span>
                            {yogaPoses[selectedPose].target}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="diet-content"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-3"
                        >
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">SELECT HEALTHY RECIPE</span>
                          <div className="space-y-2">
                            {dietTips.map((t, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  playTone(500 + idx * 50, "triangle", 0.1)
                                  setSelectedRecipe(idx)
                                }}
                                className={`p-2 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                  selectedRecipe === idx
                                    ? "bg-emerald-50 border-emerald-300 shadow-sm text-emerald-800"
                                    : "bg-white border-slate-100 hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${selectedRecipe === idx ? "bg-emerald-500 animate-ping" : "bg-slate-300"}`} />
                                  <span className="text-[11px] font-bold">{t.title}</span>
                                </div>
                                <span className="text-[9px] font-bold bg-white border border-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                                  {t.carbs} Carbs
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-white border border-emerald-100 rounded-xl p-2.5 text-[10px] text-slate-600">
                            <span className="font-bold text-slate-700 block">Metabolic Advantage:</span>
                            {dietTips[selectedRecipe].advantage}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={bounceInRight} className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                <Flower2 className="w-3.5 h-3.5" />
                <span>Certified Natural Modules</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                Yoga & Natural Diet Modules
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Blood-sugar-tracking yoga sequences and targeted nutritional diet guides developed to support healthy glucose levels naturally.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Guided Video Sequences</h4>
                    <p className="text-[11px] text-slate-500">Follow high-definition sequences explicitly crafted to boost metabolism and active blood digestion.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Sugar-Tracking Yoga Poses</h4>
                    <p className="text-[11px] text-slate-500">Focuses on postures target-stimulating your abdominal organs and internal pancreas layers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Natural Diet Guides</h4>
                    <p className="text-[11px] text-slate-500">Discover regional Indian meal blueprints rich in fiber, trace magnesium, and blood-stabilizing spices.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
          >
            <motion.div variants={bounceInLeft} className="lg:col-span-6 space-y-6 order-last lg:order-first">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                <Bell className="w-3.5 h-3.5" />
                <span>Automated Schedule Monitor</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                Smart Reminders
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Automated push notifications and SMS reminders to manage fasting times, medication schedules, and upcoming health checkups.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Fasting Countdown Timers</h4>
                    <p className="text-[11px] text-slate-500">Monitors your intermittent fasting window periods so you never break your fast early.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Integrated Medication Alarms</h4>
                    <p className="text-[11px] text-slate-500">Friendly alerts to remind you when to take insulin, metformin, or health supplements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">HbA1c Checkup Reminders</h4>
                    <p className="text-[11px] text-slate-500">Keeps track of standard 90-day intervals to schedule upcoming clinical lab checkups.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={bounceInRight} className="lg:col-span-6">
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                  <Image
                    src="/images/smart_reminders.png"
                    alt="Reminders illustration"
                    width={220}
                    height={220}
                    className="rounded-bl-3xl object-cover"
                  />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase">
                      Scheduler preview
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2">Active Timers Monitoring</h4>
                    <p className="text-[11px] text-slate-400">View live countdown progress or test automated schedule alarms.</p>
                  </div>

                  <div className="my-5 space-y-4">
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.06] pointer-events-none flex items-center justify-center">
                        <motion.div
                          className="w-40 h-40 border-2 border-dashed border-orange-500 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                          className="w-32 h-32 border border-dotted border-teal-500 rounded-full absolute"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1 relative z-10">INTERMITTENT FASTING WINDOW</span>
                      <span className="text-2xl font-mono font-extrabold text-slate-800 tracking-wider relative z-10 block my-1">
                        {formatFastingTime(fastingSeconds)}
                      </span>
                      <span className="text-[9px] text-emerald-600 font-bold block mt-1 relative z-10">Fasting Active (Safe Absorption Phase)</span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={triggerMockReminder}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-2.5 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Bell className="w-4 h-4" /> Simulate Medication Alarm
                      </button>

                      <AnimatePresence>
                        {showReminderToast && (
                          <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="absolute -top-36 left-0 right-0 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-2xl z-20 text-left flex items-start gap-3"
                          >
                            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0 animate-bounce">
                              <Activity className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-white leading-tight">Metformin Reminder</span>
                                <span className="text-[8px] bg-orange-500 text-white px-1.5 py-0.5 rounded-md font-extrabold animate-pulse">
                                  IN {reminderSecondsLeft}S
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300 mt-1">Take 500mg post-dinner dosage with lukewarm water.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-400">
                    Allows notifications via SMS or local mobile banners.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
          >
            <motion.div variants={bounceInLeft} className="lg:col-span-6">
              <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none">
                  <Image
                    src="/images/gamification_community.png"
                    alt="Gamification illustration"
                    width={220}
                    height={220}
                    className="rounded-tr-3xl object-cover"
                  />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase">
                      Ecosystem Arena
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2">Streaks & Group Feeds</h4>
                    <p className="text-[11px] text-slate-400">Log habits to increment your streak score, or check community status posts.</p>
                  </div>

                  <div className="my-5 space-y-3.5 text-left">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 animate-float-gentle">
                          <Flame className="w-5 h-5" fill="currentColor" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">CURRENT STREAK</span>
                          <span className="text-sm font-extrabold text-slate-800">{streakCount} Days Active</span>
                        </div>
                      </div>
                      <button
                        onClick={claimDailyStreak}
                        className="text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full hover:bg-orange-100/30 transition-all"
                      >
                        Log Workout (+1 Day)
                      </button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">COMMUNITY SNAPSHOTS</span>

                      {[
                        { user: "Aravind K.", text: "Completed 20 mins post-lunch walk! Streak level up. 🎉" },
                        { user: "Priya S.", text: "Swapped white rice for brown quinoa. Sugar spike stayed under +15! 👍" },
                      ].map((feed, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-800">{feed.user}</span>
                            <button
                              onClick={() => handleLike(idx)}
                              className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md border transition-all ${
                                hasLiked[idx]
                                  ? "bg-red-50 border-red-200 text-red-600 font-bold"
                                  : "bg-slate-50 border-slate-100 text-slate-400"
                              }`}
                            >
                              <ThumbsUp className="w-2.5 h-2.5" />
                              {likes[idx]} Likes
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">{feed.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={bounceInRight} className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Peer Accountability Network</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                Gamification & Community
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Track your health journey with streaks, metrics points, and progress badges. Connect with others in a safe, moderated community forum.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Streak Milestones</h4>
                    <p className="text-[11px] text-slate-500">Unlocks reward achievements as you maintain consecutive daily logging and walking streaks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Achievement Badges</h4>
                    <p className="text-[11px] text-slate-500">Earn metrics medals as you hit blood sugar stabilization targets or complete yoga tasks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Safe Community Forums</h4>
                    <p className="text-[11px] text-slate-500">Connect with fellow members to trade low-GI recipes, walking goals, and success stories.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
          >
            <motion.div variants={bounceInLeft} className="lg:col-span-6 space-y-6 order-last lg:order-first">
              <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold">
                <Crown className="w-3.5 h-3.5" />
                <span>Full Analytics License</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                Premium Plan
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Unlock extended report history, priority AI scheduling, advanced analytics, and personalized coaching for comprehensive diabetes management.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Unlimited Report History</h4>
                    <p className="text-[11px] text-slate-500">Maintain years of laboratory blood reports to model long-term wellness curves.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Priority AI Access</h4>
                    <p className="text-[11px] text-slate-500">Instant dedicated parsing queue for scans and questions during high-load periods.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Advanced AI Forecasting</h4>
                    <p className="text-[11px] text-slate-500">Predicts HbA1c trajectory based on daily food scanner history and active movement levels.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={bounceInRight} className="lg:col-span-6">
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                  <Image
                    src="/images/premium_plan.png"
                    alt="Premium plan illustration"
                    width={220}
                    height={220}
                    className="rounded-bl-3xl object-cover"
                  />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md uppercase">
                        Premium Subscription
                      </span>
                      <div className="flex bg-slate-200/60 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => {
                            playTone(480, "sine", 0.08)
                            setBillingCycle("monthly")
                          }}
                          className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                            billingCycle === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => {
                            playTone(480, "sine", 0.08)
                            setBillingCycle("annually")
                          }}
                          className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                            billingCycle === "annually" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          Annually
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-3">Pricing Calculator</h4>
                    <p className="text-[11px] text-slate-400">Toggle billing plans or unlock the premium analytical chart demo below.</p>
                  </div>

                  <div className="my-5 space-y-4">
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[9px] text-orange-500 font-bold block uppercase tracking-wider">7-DAY FREE TRIAL</span>
                        <span className="text-xl font-extrabold text-slate-800">₹{basePrice} <span className="text-xs font-semibold text-slate-400">/ month</span></span>
                        <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">
                          {billingCycle === "annually" ? "Billed annually (₹1,699) after trial" : "Billed monthly after trial"}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          playTone(900, "triangle", 0.25)
                          setAnalyticsUnlocked(!analyticsUnlocked)
                        }}
                        className="text-[10px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-600 hover:text-white border border-violet-100 px-3 py-2 rounded-xl transition-all"
                      >
                        {analyticsUnlocked ? "Lock Analytics" : "Preview Premium Charts"}
                      </button>
                    </div>

                    <div className="relative h-28 border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                      <div className="absolute inset-0 p-3 opacity-60 flex flex-col justify-between">
                        <span className="text-[8px] text-slate-400 font-bold block">3-MONTH SUGAR TREND FORECAST</span>
                        
                        <svg className="w-full h-12 text-violet-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path
                            d="M0 20 Q25 5 50 15 T100 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={analyticsUnlocked ? "stroke-violet-600" : "stroke-slate-400"}
                          />
                          <circle cx="50" cy="15" r="2" fill="currentColor" />
                          <circle cx="100" cy="5" r="2" fill="currentColor" />
                        </svg>

                        <div className="flex justify-between text-[7px] text-slate-400 font-semibold">
                          <span>Month 1: 7.2%</span>
                          <span>Month 2: 6.8%</span>
                          <span>Forecast: 5.9%</span>
                        </div>
                      </div>

                      {!analyticsUnlocked && (
                        <motion.div
                          key="locked-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 z-10"
                        >
                          <Lock className="w-4 h-4 text-violet-400 mb-1 animate-pulse" />
                          <span className="text-[9px] font-bold tracking-wide">METRICS ARCHIVE LOCKED</span>
                          <span className="text-[8px] text-slate-300">Unlock priority coaching to forecast trends</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Secure payments backed by Indian Gateways
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
