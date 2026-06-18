"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Info,
} from "lucide-react"
import { Mitig8Logo } from "@/components/mitig8-logo"

type LoginProvider = "phone" | "google_email"

export function OnboardingPage() {
  const router = useRouter()

  // Simulator State (so user can toggle between paths on the frontend)
  const [provider, setProvider] = useState<LoginProvider>("phone")

  // Form Field States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [dob, setDob] = useState("")

  // UI & Loading States
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Check cookie on mount to set initial provider
  useEffect(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|; )mock-login-provider=([^;]*)/)
      const savedProvider = match ? match[1] : null
      if (savedProvider === "phone") {
        setProvider("phone")
      } else if (savedProvider === "email" || savedProvider === "google") {
        setProvider("google_email")
      }
    }
  }, [])

  // Reset fields on provider toggle to show clean dynamic behavior
  useEffect(() => {
    setErrors({})
    if (provider === "google_email") {
      // Prefilled values as if they came from Google/Email Auth
      setName("John Doe")
      setEmail("johndoe@gmail.com")
      setAge("")
      setDob("")
    } else {
      setName("")
      setEmail("")
      setAge("")
      setDob("")
    }
  }, [provider])

  // Simple validation logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (provider === "phone") {
      if (!name.trim()) {
        newErrors.name = "Full name is required."
      } else if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters."
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.trim()) {
        newErrors.email = "Email address is required."
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address."
      }
    }

    if (!age) {
      newErrors.age = "Age is required."
    } else {
      const ageNum = parseInt(age, 10)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = "Please enter a valid age between 1 and 120."
      }
    }

    if (!dob) {
      newErrors.dob = "Date of birth is required."
    } else {
      const birthDate = new Date(dob)
      const today = new Date()
      if (isNaN(birthDate.getTime()) || birthDate > today) {
        newErrors.dob = "Please enter a valid date in the past."
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    // Simulate Frontend Submission API Call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      
      // Redirect to dashboard after showing success state
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }, 1200)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 18 },
    },
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] relative overflow-hidden flex flex-col items-center justify-center px-4 py-8">
      {/* ── Background Patterns ── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C4A882 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />
      <motion.div
        className="absolute top-20 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,87,34,0.06) 0%, transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,87,34,0.04) 0%, transparent 70%)" }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        


        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <Mitig8Logo size="lg" theme="dark" animated={false} />
        </motion.div>

        {/* ── Main Onboarding Card ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-orange-500/[0.04] overflow-hidden"
        >
          <div className="p-7 sm:p-9">
            
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#0F172A]">Profile Completed!</h2>
                    <p className="text-sm text-slate-500 mt-1.5">
                      Your preferences have been saved. Taking you to your dashboard...
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-center text-xs text-orange-500 font-bold gap-2 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form-screen" className="space-y-6">
                  {/* Title Section */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 rounded-full text-xs font-bold mb-3">
                      <Sparkles className="w-3 h-3 animate-pulse" /> Complete Setup
                    </span>
                    <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                      Tell us a bit about yourself
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Please provide these essential health details to personalize your glucose recommendations.
                    </p>
                  </div>

                  {/* Onboarding Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <AnimatePresence mode="popLayout">
                      {provider === "phone" ? (
                        <motion.div
                          key="phone-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5 overflow-hidden"
                        >
                          {/* Full Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-700 outline-none transition-all ${
                                  errors.name
                                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                }`}
                              />
                            </div>
                            {errors.name && (
                              <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                              </p>
                            )}
                          </div>

                          {/* Email Address */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                              <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-700 outline-none transition-all ${
                                  errors.email
                                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                }`}
                              />
                            </div>
                            {errors.email && (
                              <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="read-only-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 overflow-hidden text-xs text-slate-600"
                        >
                          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/50">
                            <span className="font-bold text-slate-500">Sign-in Account Details</span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase text-[9px] tracking-wider">
                              Synced
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Name</p>
                              <p className="font-semibold text-slate-700 mt-0.5">{name || "Not Available"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                              <p className="font-semibold text-slate-700 mt-0.5">{email || "Not Available"}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dynamic Inputs (Age and DOB) for both methods */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Age */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 block">Age (Years)</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="number"
                            placeholder="e.g. 28"
                            min="1"
                            max="120"
                            value={age}
                            onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                            className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-700 outline-none transition-all ${
                              errors.age
                                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            }`}
                          />
                        </div>
                        {errors.age && (
                          <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.age}
                          </p>
                        )}
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 block">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-700 outline-none transition-all ${
                              errors.dob
                                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            }`}
                          />
                        </div>
                        {errors.dob && (
                          <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.dob}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isLoading}
                      type="submit"
                      className="w-full mt-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving details...
                        </>
                      ) : (
                        <>
                          Save & Continue <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>

      </div>
    </div>
  )
}
