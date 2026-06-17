"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Lock,
  User,
  ChevronRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  KeyRound,
  Send,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Mitig8Logo } from "@/components/mitig8-logo"

type AuthTab = "signin" | "signup"
type AuthMethod = "mobile" | "email"
type PasswordStrength = "weak" | "fair" | "good" | "strong"

// ── Password Strength Helpers ────────────────────────────
interface StrengthRule {
  label: string
  test: (pw: string) => boolean
}

const strengthRules: StrengthRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Number (0-9)", test: (pw) => /[0-9]/.test(pw) },
  { label: "Special character (!@#…)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

function getStrength(pw: string): { level: PasswordStrength; score: number } {
  const score = strengthRules.filter((r) => r.test(pw)).length
  if (score <= 1) return { level: "weak", score }
  if (score === 2) return { level: "fair", score }
  if (score === 3) return { level: "good", score }
  return { level: "strong", score }
}

const strengthMeta: Record<PasswordStrength, { color: string; bar: string; label: string }> = {
  weak:   { color: "text-red-500",    bar: "bg-red-400",    label: "Weak" },
  fair:   { color: "text-orange-500", bar: "bg-orange-400", label: "Fair" },
  good:   { color: "text-yellow-500", bar: "bg-yellow-400", label: "Good" },
  strong: { color: "text-green-500",  bar: "bg-green-500",  label: "Strong" },
}

// ── Component ────────────────────────────────────────────
export function AuthPage() {
  const router = useRouter()
  const supabase = createClient()

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

  // ── Auth state ───────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // ── Forgot Password state ────────────────────────────────
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState<string | null>(null)
  const [forgotSuccess, setForgotSuccess] = useState(false)

  // ── Password strength ────────────────────────────────────
  const [showStrength, setShowStrength] = useState(false)
  const strength = getStrength(password)
  const meta = strengthMeta[strength.level]

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [otpTimer])

  // Check for error param from OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    if (error) setAuthError(decodeURIComponent(error))
  }, [])

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
    setAuthError(null)
    setSuccessMessage(null)
    setShowStrength(false)
  }

  const switchTab = (tab: AuthTab) => {
    resetState()
    setActiveTab(tab)
  }

  // ── Email / Password Auth ────────────────────────────────
  const handleEmailAuth = async () => {
    if (!email || !password) return
    setIsLoading(true)
    setAuthError(null)
    setSuccessMessage(null)

    try {
      if (activeTab === "signin") {
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
        } catch (err) {
          console.warn("Supabase auth failed, running in mock mode:", err)
        }
        document.cookie = "mock-login=true; path=/"
        document.cookie = "mock-login-provider=email; path=/"
        router.push("/auth/onboarding")
      } else {
        // Sign Up — enforce password strength
        if (strength.score < 3) {
          throw new Error("Please use a stronger password before signing up.")
        }
        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
          if (error) throw error
          setSuccessMessage(
            "Account created! Check your email for a confirmation link before signing in."
          )
        } catch (err) {
          console.warn("Supabase signup failed, running in mock mode:", err)
          document.cookie = "mock-login=true; path=/"
          document.cookie = "mock-login-provider=email; path=/"
          setSuccessMessage(
            "Account created (Mock Mode)! Redirecting to onboarding..."
          )
          setTimeout(() => {
            router.push("/auth/onboarding")
          }, 1500)
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      setAuthError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Google OAuth ─────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setAuthError(null)

    // Simulate Google Sign-In and transition to onboarding for pure frontend testing
    setTimeout(() => {
      document.cookie = "mock-login=true; path=/"
      document.cookie = "mock-login-provider=google; path=/"
      router.push("/auth/onboarding")
    }, 800)
  }

  // ── Forgot Password ──────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!forgotEmail) return
    setForgotLoading(true)
    setForgotError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setForgotSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset email."
      setForgotError(message)
    } finally {
      setForgotLoading(false)
    }
  }

  const closeForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotEmail("")
    setForgotError(null)
    setForgotSuccess(false)
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

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Mitig8Logo size="lg" theme="dark" animated={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 18 }}
          className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-orange-500/[0.06] overflow-hidden"
        >
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

            {/* ── Error / Success Banners ── */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{authError}</span>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-4 flex items-start gap-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-xs font-medium"
                >
                  <span>✓ {successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Google OAuth Button ── */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
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
              )}
              Continue with Google
            </motion.button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

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
                        onClick={() => {
                          document.cookie = "mock-login=true; path=/";
                          document.cookie = "mock-login-provider=phone; path=/";
                          router.push('/auth/onboarding');
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-slate-300 disabled:to-slate-300 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        {activeTab === "signin" ? "Sign In" : "Create Account"}
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* ── Email + Password Form ── */
                <motion.div
                  key="email-form"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
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
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(email)
                            setShowForgotPassword(true)
                          }}
                          className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                        >
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
                        onFocus={() => activeTab === "signup" && setShowStrength(true)}
                        onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
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

                    {/* ── Password Strength Indicator ── */}
                    <AnimatePresence>
                      {activeTab === "signup" && showStrength && password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          className="mt-3 space-y-2.5 overflow-hidden"
                        >
                          {/* Strength bar */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex gap-1">
                              {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                  key={i}
                                  className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200"
                                >
                                  <motion.div
                                    className={`h-full rounded-full ${meta.bar}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: i < strength.score ? "100%" : "0%" }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                            <span className={`text-[11px] font-bold ${meta.color} min-w-[40px]`}>
                              {meta.label}
                            </span>
                          </div>

                          {/* Rules checklist */}
                          <div className="grid grid-cols-2 gap-1">
                            {strengthRules.map((rule) => {
                              const passed = rule.test(password)
                              return (
                                <motion.div
                                  key={rule.label}
                                  className="flex items-center gap-1.5"
                                  animate={{ opacity: 1 }}
                                >
                                  {passed ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-slate-300 shrink-0" />
                                  )}
                                  <span
                                    className={`text-[10px] font-medium transition-colors ${
                                      passed ? "text-green-600" : "text-slate-400"
                                    }`}
                                  >
                                    {rule.label}
                                  </span>
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={!email || !password || isLoading}
                    onClick={handleEmailAuth}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-slate-300 disabled:to-slate-300 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {activeTab === "signin" ? "Sign In" : "Create Account"}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {activeTab === "signup" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-slate-400 text-center mt-4 leading-relaxed"
              >
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-orange-600 font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-orange-600 font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Forgot Password Modal ────────────────────────────── */}
      <AnimatePresence>
        {showForgotPassword && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForgotPassword}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-orange-500/10 border border-slate-100 p-7">
                <AnimatePresence mode="wait">
                  {!forgotSuccess ? (
                    <motion.div
                      key="forgot-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-5"
                    >
                      {/* Icon + Title */}
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                          <KeyRound className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-[#0F172A]">Forgot your password?</h2>
                          <p className="text-xs text-slate-500 mt-1">
                            No worries — we&apos;ll email you a reset link right away.
                          </p>
                        </div>
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {forgotError && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2.5 text-xs font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span>{forgotError}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Email Input */}
                      <div>
                        <label className="text-xs font-bold text-slate-600 block mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                            placeholder="you@example.com"
                            autoFocus
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-xl text-sm text-slate-700 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={closeForgotPassword}
                          className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleForgotPassword}
                          disabled={!forgotEmail || forgotLoading}
                          className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          {forgotLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Send Link
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Success State */
                    <motion.div
                      key="forgot-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center gap-4 py-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-bold text-[#0F172A]">Check your inbox!</h2>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          We&apos;ve sent a password reset link to{" "}
                          <span className="font-semibold text-slate-700">{forgotEmail}</span>.
                          <br />It may take a minute or two to arrive.
                        </p>
                      </div>
                      <button
                        onClick={closeForgotPassword}
                        className="mt-1 w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg shadow-orange-500/20 hover:from-orange-500 hover:to-orange-400 transition-all"
                      >
                        Back to Sign In
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
