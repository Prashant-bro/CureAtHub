"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Activity,
  ArrowLeft,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Lock,
  User,
  ChevronRight,
  Shield,
  CheckCircle,
} from "lucide-react"

type AuthTab = "signin" | "signup"
type AuthMethod = "mobile" | "email"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("signin")
  const [authMethod, setAuthMethod] = useState<AuthMethod>("mobile")
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [otpTimer])

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setOtpSent(true)
      setOtpTimer(30)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const resetState = () => {
    setOtpSent(false)
    setOtpValues(["", "", "", "", "", ""])
    setPhone("")
    setEmail("")
    setPassword("")
    setName("")
    setOtpTimer(0)
  }

  const switchTab = (tab: AuthTab) => {
    resetState()
    setActiveTab(tab)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 16, mass: 0.8 },
    },
    exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.2 } },
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C4A882 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />
      <motion.div
        className="absolute top-20 -left-32 w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,87,34,0.06) 0%, transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 -right-32 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,87,34,0.04) 0%, transparent 70%)" }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Activity className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#0F172A]">Dia</span>
            <span className="text-gradient">predix</span>
          </span>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 18 }}
          className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-orange-500/[0.06] overflow-hidden"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100">
            {(["signin", "signup"] as AuthTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all relative ${
                  activeTab === tab ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "signin" ? "Sign In" : "Sign Up"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-7">
            {/* Header Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-xl font-bold text-[#0F172A]">
                  {activeTab === "signin" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {activeTab === "signin"
                    ? "Sign in to access your health dashboard"
                    : "Start your AI-powered health journey today"}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Google Login */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Auth Method Switcher */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-5 border border-slate-200/60">
              <button
                onClick={() => { setAuthMethod("mobile"); resetState() }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  authMethod === "mobile"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile + OTP
              </button>
              <button
                onClick={() => { setAuthMethod("email"); resetState() }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  authMethod === "email"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email + Password
              </button>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {authMethod === "mobile" ? (
                <motion.div
                  key="mobile-form"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Name field for signup */}
                  {activeTab === "signup" && (
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl text-sm text-slate-700 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {!otpSent ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1.5">Mobile Number</label>
                        <div className="relative flex gap-2">
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm text-slate-600 font-semibold shrink-0">
                            +91
                          </div>
                          <div className="relative flex-1">
                            <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              maxLength={10}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                              placeholder="Enter 10-digit number"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl text-sm text-slate-700 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleSendOtp}
                        disabled={phone.length < 10}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-slate-300 disabled:to-slate-300 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        Send OTP
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-600">Enter 6-digit OTP</label>
                          <button
                            onClick={() => setOtpSent(false)}
                            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                          >
                            Change number
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-3">
                          OTP sent to <span className="font-bold text-slate-600">+91 {phone}</span>
                        </p>

                        {/* OTP Boxes */}
                        <div className="flex gap-2 justify-between">
                          {otpValues.map((val, idx) => (
                            <input
                              key={idx}
                              ref={(el) => { otpRefs.current[idx] = el }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-12 h-12 text-center text-lg font-bold bg-slate-50 border-2 border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl outline-none transition-all text-slate-800"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {otpTimer > 0
                            ? `Resend in ${otpTimer}s`
                            : (
                              <button
                                onClick={() => setOtpTimer(30)}
                                className="text-orange-600 font-bold hover:underline"
                              >
                                Resend OTP
                              </button>
                            )
                          }
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={otpValues.some((v) => !v)}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-slate-300 disabled:to-slate-300 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        {activeTab === "signin" ? "Sign In" : "Create Account"}
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="email-form"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Name field for signup */}
                  {activeTab === "signup" && (
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl text-sm text-slate-700 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl text-sm text-slate-700 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-600">Password</label>
                      {activeTab === "signin" && (
                        <button className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={activeTab === "signup" ? "Create a strong password" : "Enter your password"}
                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl text-sm text-slate-700 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={!email || !password}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-slate-300 disabled:to-slate-300 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {activeTab === "signin" ? "Sign In" : "Create Account"}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms for signup */}
            {activeTab === "signup" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-slate-400 text-center mt-4 leading-relaxed"
              >
                By signing up, you agree to our{" "}
                <span className="text-orange-600 font-semibold cursor-pointer hover:underline">Terms of Service</span>{" "}
                and{" "}
                <span className="text-orange-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
              </motion.p>
            )}
          </div>
        </motion.div>


      </div>
    </div>
  )
}
