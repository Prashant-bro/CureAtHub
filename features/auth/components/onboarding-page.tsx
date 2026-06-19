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
  Heart,
  Droplets,
} from "lucide-react"
import { Mitig8Logo } from "@/components/mitig8-logo"
import { createClient } from "@/lib/supabase/client"

type LoginProvider = "phone" | "google_email"

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
]

const BLOOD_GROUP_OPTIONS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
]

export function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  // Simulator State (so user can toggle between paths on the frontend)
  const [provider, setProvider] = useState<LoginProvider>("phone")

  // Form Field States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [phoneInput, setPhoneInput] = useState("")

  // Auth session data
  const [userId, setUserId] = useState<string | null>(null)
  const [authPhone, setAuthPhone] = useState<string | null>(null)

  // UI & Loading States
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Helper to calculate age in years from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return ""
    const today = new Date()
    const birthDate = new Date(dobString)
    let computedAge = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--
    }
    return computedAge >= 0 ? String(computedAge) : ""
  }

  // Handle DOB change and compute age
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDob(val)
    const computedAge = calculateAge(val)
    setAge(computedAge)
  }

  // Check session and cookies on mount
  useEffect(() => {
    async function loadSession() {
      // Try getting user from Supabase session first
      const { data: { user } } = await supabase.auth.getUser()

      let currentUserId: string | null = null
      let currentPhone: string | null = null

      if (user) {
        currentUserId = user.id
        setUserId(user.id)

        // Check if user signed in via phone or email/Google
        if (user.phone) {
          setProvider("phone")
          setAuthPhone(user.phone)
          currentPhone = user.phone
        } else if (user.email) {
          setProvider("google_email")
          setName(user.user_metadata?.full_name || user.user_metadata?.name || "")
          setEmail(user.email)
        }
      } else {
        // Fallback to sessionStorage for phone OTP flow
        if (typeof window !== "undefined") {
          const storedUserId = sessionStorage.getItem("auth_user_id")
          const storedPhone = sessionStorage.getItem("auth_phone")

          if (storedUserId) {
            currentUserId = storedUserId
            setUserId(storedUserId)
          }
          if (storedPhone) {
            setAuthPhone(storedPhone)
            currentPhone = storedPhone
            setProvider("phone")
          }

          // Check cookie for provider info
          const match = document.cookie.match(/(?:^|; )mock-login-provider=([^;]*)/)
          const savedProvider = match ? match[1] : null
          if (savedProvider === "email" || savedProvider === "google") {
            setProvider("google_email")
          }
        }
      }

      // If we have a userId, fetch the existing profile to avoid asking for details again
      if (currentUserId) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUserId)
            .maybeSingle()

          if (profile) {
            // Check if profile is complete (has name, email, age, dob, gender, bloodGroup)
            if (
              profile.full_name &&
              profile.email &&
              profile.age &&
              profile.date_of_birth &&
              profile.gender &&
              profile.blood_group
            ) {
              // Redirect to dashboard immediately
              router.push("/dashboard")
              return
            }

            // Pre-populate fields we have
            if (profile.full_name) setName(profile.full_name)
            if (profile.email) setEmail(profile.email)
            if (profile.age) setAge(String(profile.age))
            if (profile.date_of_birth) setDob(profile.date_of_birth)
            if (profile.gender) setGender(profile.gender)
            if (profile.blood_group) setBloodGroup(profile.blood_group)
            if (profile.phone) {
              const cleaned = profile.phone.replace("+91", "")
              setPhoneInput(cleaned)
            }
          } else if (currentPhone && !authPhone) {
            setAuthPhone(currentPhone)
          }
        } catch (err) {
          console.error("Error loading profile:", err)
        }
      }
    }

    loadSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset fields on provider toggle to show clean dynamic behavior
  useEffect(() => {
    setErrors({})
    setSubmitError(null)
  }, [provider])

  // Simple validation logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 1. Full Name Validation
    if (provider === "phone") {
      if (!name.trim()) {
        newErrors.name = "Full name is required."
      } else if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters."
      } else if (!/^[A-Za-z\s.'-]+$/.test(name.trim())) {
        newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes."
      }

      // 2. Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email.trim()) {
        newErrors.email = "Email address is required."
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address."
      }
    } else if (provider === "google_email") {
      // 3. Phone number validation (Google Auth user must provide one)
      if (!phoneInput.trim()) {
        newErrors.phone = "Phone number is required."
      } else if (!/^\d{10}$/.test(phoneInput.trim())) {
        newErrors.phone = "Please enter a valid 10-digit mobile number."
      } else if (!/^[6-9]\d{9}$/.test(phoneInput.trim())) {
        newErrors.phone = "Indian mobile numbers must start with 6, 7, 8, or 9."
      }
    }

    // 4. Age Validation
    if (!age) {
      newErrors.age = "Age is required."
    } else {
      const ageNum = parseInt(age, 10)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = "Please enter a valid age between 1 and 120."
      }
    }

    // 5. DOB Validation
    if (!dob) {
      newErrors.dob = "Date of birth is required."
    } else {
      const birthDate = new Date(dob)
      const today = new Date()
      if (isNaN(birthDate.getTime()) || birthDate > today) {
        newErrors.dob = "Date of birth cannot be in the future."
      } else {
        // Enforce that calculated age matches the age field
        const computed = calculateAge(dob)
        if (computed !== age) {
          newErrors.age = "Computed age from date of birth does not match."
        }
      }
    }

    // 6. Gender & Blood Group Validation
    if (!gender) {
      newErrors.gender = "Please select your gender."
    }

    if (!bloodGroup) {
      newErrors.bloodGroup = "Please select your blood group."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setSubmitError(null)

    try {
      // If we don't have a userId, we can't save the profile
      if (!userId) {
        throw new Error("User session not found. Please go back and sign in again.")
      }

      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          full_name: name.trim(),
          email: email.trim(),
          phone: provider === "phone" ? (authPhone || null) : (phoneInput ? `+91${phoneInput}` : null),
          age: age,
          date_of_birth: dob,
          gender: gender,
          blood_group: bloodGroup,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile.")
      }

      // Clean up sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth_user_id")
        sessionStorage.removeItem("auth_phone")
      }

      setShowSuccess(true)

      // Redirect to dashboard after showing success state
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      setSubmitError(message)
      setIsLoading(false)
    }
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

                  {/* Submit Error Banner */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-medium"
                      >
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{submitError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                          className="space-y-4 overflow-hidden"
                        >
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 text-xs text-slate-600">
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
                          </div>

                          {/* Phone Number Input for Google Auth users */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Mobile Phone Number</label>
                            <div className="relative flex gap-2">
                              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm text-slate-600 font-semibold shrink-0 font-mono">
                                +91
                              </div>
                              <div className="relative flex-1">
                                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                <input
                                  type="tel"
                                  maxLength={10}
                                  value={phoneInput}
                                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
                                  placeholder="Enter 10-digit number"
                                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-700 outline-none transition-all ${
                                    errors.phone
                                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                      : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                  }`}
                                />
                              </div>
                            </div>
                            {errors.phone && (
                              <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                              </p>
                            )}
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
                            placeholder="Derived from DOB"
                            value={age}
                            readOnly
                            disabled
                            className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed"
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
                            onChange={handleDobChange}
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

                    {/* Gender and Blood Group */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Gender */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 block">Gender</label>
                        <div className="relative">
                          <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer ${
                              gender ? "text-slate-700" : "text-slate-400"
                            } ${
                              errors.gender
                                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            }`}
                          >
                            <option value="" disabled>Select gender</option>
                            {GENDER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {/* Custom dropdown arrow */}
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.gender && (
                          <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.gender}
                          </p>
                        )}
                      </div>

                      {/* Blood Group */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 block">Blood Group</label>
                        <div className="relative">
                          <Droplets className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer ${
                              bloodGroup ? "text-slate-700" : "text-slate-400"
                            } ${
                              errors.bloodGroup
                                ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            }`}
                          >
                            <option value="" disabled>Select blood group</option>
                            {BLOOD_GROUP_OPTIONS.map((bg) => (
                              <option key={bg} value={bg}>
                                {bg}
                              </option>
                            ))}
                          </select>
                          {/* Custom dropdown arrow */}
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.bloodGroup && (
                          <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.bloodGroup}
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
