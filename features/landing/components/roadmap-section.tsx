"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView, useScroll, useSpring } from "framer-motion"
import Image from "next/image"
import {
  RefreshCw,
  AlertOctagon,
  CheckCircle,
  MapPin,
  UtensilsCrossed,
  TrendingDown,
} from "lucide-react"

const playChime = (freq = 440, type: OscillatorType = "sine", duration = 0.1) => {
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

export function RoadmapSection() {
  const containerRef = useRef(null)
  const isContainerInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  const scaleY = useSpring(scrollYProgress, { stiffness: 180, damping: 12, restDelta: 0.001 })

  const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced">("idle")
  const [cgmVal, setCgmVal] = useState(118)
  const [bpmVal, setBpmVal] = useState(72)
  const [lastSyncText, setLastSyncText] = useState("Never")

  const triggerSync = () => {
    if (syncState === "syncing") return
    playChime(520, "sine", 0.1)
    setSyncState("syncing")
    
    setTimeout(() => {
      setSyncState("synced")
      setCgmVal(106)
      setBpmVal(68)
      setLastSyncText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      playChime(660, "sine", 0.25)
    }, 2500)
  }

  const [crashSimulated, setCrashSimulated] = useState(false)
  const [chartData, setChartData] = useState([125, 120, 118, 122, 115, 110])

  const triggerCrashSimulation = () => {
    playChime(400, "triangle", 0.15)
    setCrashSimulated(!crashSimulated)
  }

  useEffect(() => {
    if (crashSimulated) {
      setChartData([122, 115, 105, 90, 75, 62])
      playChime(300, "sawtooth", 0.3)
    } else {
      setChartData([125, 120, 118, 122, 115, 110])
    }
  }, [crashSimulated])

  const [bookingStep, setBookingStep] = useState<"step1" | "step2" | "step3" | "success">("step1")
  const [selectedLab, setSelectedLab] = useState("")

  const advanceBooking = (lab: string) => {
    playChime(600, "sine", 0.08)
    setSelectedLab(lab)
    setBookingStep("step2")
  }

  const [mealPlan, setMealPlan] = useState<"daily" | "weekly">("weekly")
  const [deliveryUnlocked, setDeliveryUnlocked] = useState(false)

  const mealPrice = mealPlan === "daily" ? 149 : 949

  return (
    <section
      id="roadmap"
      ref={containerRef}
      className="py-24 relative overflow-hidden bg-[#FFFDFB]"
    >
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C4A882 1px, transparent 0)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="inline-block text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4">
            Roadmap Upgrades
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Building the future of <span className="text-gradient">diabetes care</span>
          </h2>
          <p className="text-slate-500 text-lg mt-4 leading-relaxed">
            Our roadmap for post-funding upgrades — from wearable integrations to predictive alerts and food delivery.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-[3px] -translate-x-1/2 bg-slate-100 rounded-full">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-teal-500 via-rose-500 via-blue-500 to-amber-500 origin-top rounded-full shadow-[0_0_8px_rgba(20,184,166,0.3)]"
              style={{ scaleY }}
            />
          </div>

          <div className="space-y-24 lg:space-y-36">
            <div className="grid lg:grid-cols-12 gap-12 items-center relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, margin: "-120px" }}
                transition={{ type: "spring", stiffness: 400, damping: 8, delay: 0.1 }}
                className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-md items-center justify-center z-20"
              >
                <motion.div
                  className="w-3.5 h-3.5 rounded-full bg-teal-500"
                  animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: ["0 0 0 0 rgba(20,184,166,0.4)", "0 0 0 8px rgba(20,184,166,0)", "0 0 0 0 rgba(20,184,166,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 lg:text-right space-y-4"
              >
                <span className="inline-block text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                  Phase 1 — Coming Soon
                </span>
                <h3 className="text-2xl font-bold text-slate-800">Wearable & IoT Integration</h3>
                <p className="text-slate-600 text-sm leading-relaxed lg:ml-auto lg:max-w-md">
                  Deep synchronization with Apple Health, Google Fit, Fitbit, and Continuous Glucose Monitors for real-time health data streaming.
                </p>
              </motion.div>

              <div className="hidden lg:block lg:col-span-2" />

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left">
                  <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
                    <Image
                      src="/images/wearable_integration.png"
                      alt="Wearable integration graphic"
                      width={180}
                      height={180}
                      className="rounded-tl-2xl object-cover"
                    />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase">
                        IoT SYNC PREVIEW
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-2">Continuous Glucose Monitors</h4>
                      <p className="text-[11px] text-slate-400">Sync with devices to pull real-time glucose and activity streams.</p>
                    </div>

                    <div className="my-5 grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                        <span className="text-[8px] font-bold text-slate-400 block uppercase">CGM SENSOR</span>
                        <span className="text-xl font-extrabold text-teal-600">{syncState === "syncing" ? "..." : `${cgmVal} mg/dL`}</span>
                        <span className="text-[8px] text-slate-500 block">Last 5 min average</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                        <span className="text-[8px] font-bold text-slate-400 block uppercase">HEART RATE</span>
                        <span className="text-xl font-extrabold text-slate-700">{syncState === "syncing" ? "..." : `${bpmVal} bpm`}</span>
                        <span className="text-[8px] text-slate-500 block">Apple Watch feed</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[9px] text-slate-400">Last Synced: <span className="font-semibold">{lastSyncText}</span></span>
                      <button
                        onClick={triggerSync}
                        disabled={syncState === "syncing"}
                        className="text-[9px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white border border-teal-100 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncState === "syncing" ? "animate-spin" : ""}`} />
                        {syncState === "syncing" ? "Syncing..." : "Sync Devices"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-center relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, margin: "-120px" }}
                transition={{ type: "spring", stiffness: 400, damping: 8, delay: 0.1 }}
                className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-md items-center justify-center z-20"
              >
                <motion.div
                  className="w-3.5 h-3.5 rounded-full bg-rose-500"
                  animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: ["0 0 0 0 rgba(244,63,94,0.4)", "0 0 0 8px rgba(244,63,94,0)", "0 0 0 0 rgba(244,63,94,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 order-last lg:order-first"
              >
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left">
                  <div className="absolute left-0 bottom-0 opacity-15 pointer-events-none">
                    <Image
                      src="/images/predictive_alerts.png"
                      alt="Predictive alert graphic"
                      width={180}
                      height={180}
                      className="rounded-tr-2xl object-cover"
                    />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md uppercase">
                          ML SUGAR ALERTS
                        </span>
                        <button
                          onClick={triggerCrashSimulation}
                          className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-3.5 py-1 rounded-full transition-all"
                        >
                          {crashSimulated ? "Reset sugar trend" : "Simulate Sugar Crash"}
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-2">Active Crash Predictions</h4>
                      <p className="text-[11px] text-slate-400">Models physical exercises and insulin targets to prevent spikes.</p>
                    </div>

                    <div className="my-4 space-y-3">
                      <div className="h-16 border border-slate-100 bg-slate-50/50 rounded-xl p-2 flex flex-col justify-between relative">
                        <span className="text-[8px] text-slate-400 font-bold">120-MIN MEAL METALLIC FORECAST</span>
                        
                        <svg className="w-full h-8 text-rose-500" viewBox="0 0 120 30" preserveAspectRatio="none">
                          <motion.path
                            key={crashSimulated ? "crash-curve" : "normal-curve"}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8 }}
                            d={crashSimulated ? "M 0 5 L 24 8 L 48 12 L 72 20 L 96 26 L 120 28" : "M 0 5 L 24 6 L 48 8 L 72 7 L 96 10 L 120 8"}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          />
                        </svg>

                        <div className="flex justify-between text-[7px] text-slate-400 font-semibold">
                          <span>{chartData[0]} mg/dL</span>
                          <span>{chartData[3]} mg/dL</span>
                          <span>{chartData[5]} mg/dL</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {crashSimulated && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-[10px] text-red-800 flex items-start gap-2 animate-pulse"
                          >
                            <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold text-red-900 block">⚠️ Hypoglycemia Warning</span>
                              Glucose level heading to {chartData[5]} mg/dL in 15 mins. Consume 15g fast-acting sugar.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="hidden lg:block lg:col-span-2" />

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-4"
              >
                <span className="inline-block text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                  Phase 2 — Coming Soon
                </span>
                <h3 className="text-2xl font-bold text-slate-800">Predictive Hypo/Hyper Alerts</h3>
                <p className="text-slate-600 text-sm leading-relaxed lg:max-w-md">
                  Proactive time-series ML models predicting blood sugar crashes or sudden spikes using your activity data and insulin logs.
                </p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-center relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, margin: "-120px" }}
                transition={{ type: "spring", stiffness: 400, damping: 8, delay: 0.1 }}
                className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-md items-center justify-center z-20"
              >
                <motion.div
                  className="w-3.5 h-3.5 rounded-full bg-blue-500"
                  animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: ["0 0 0 0 rgba(59,130,246,0.4)", "0 0 0 8px rgba(59,130,246,0)", "0 0 0 0 rgba(59,130,246,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.0,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 lg:text-right space-y-4"
              >
                <span className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                  Phase 3 — Coming Soon
                </span>
                <h3 className="text-2xl font-bold text-slate-800">Diagnostic Lab Integrations</h3>
                <p className="text-slate-600 text-sm leading-relaxed lg:ml-auto lg:max-w-md">
                  Direct API linkages with local diagnostic networks to orchestrate home-collection blood test bookings seamlessly from the app.
                </p>
              </motion.div>

              <div className="hidden lg:block lg:col-span-2" />

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left">
                  <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
                    <Image
                      src="/images/diagnostic_labs.png"
                      alt="Diagnostic labs graphic"
                      width={180}
                      height={180}
                      className="rounded-tl-2xl object-cover"
                    />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                        LAB BOOKINGS
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-2">Home Collection Booking</h4>
                      <p className="text-[11px] text-slate-400">Direct bookings for diagnostic HbA1c collections.</p>
                    </div>

                    <div className="my-4 bg-slate-50 border border-slate-100 rounded-2xl p-3 shadow-sm min-h-[100px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {bookingStep === "step1" && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                          >
                            <span className="text-[8px] font-bold text-slate-400 block uppercase">SELECT DIAGNOSTIC NETWORK</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => advanceBooking("Lal PathLabs")}
                                className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-2 text-center text-[10px] font-bold transition-all text-slate-700"
                              >
                                Lal PathLabs
                              </button>
                              <button
                                onClick={() => advanceBooking("Thyrocare")}
                                className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-2 text-center text-[10px] font-bold transition-all text-slate-700"
                              >
                                Thyrocare
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {bookingStep === "step2" && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2.5 text-left"
                          >
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              Confirm Lab: {selectedLab}
                            </div>
                            <div className="bg-white border border-slate-100 rounded-lg p-2 flex items-center justify-between text-[10px]">
                              <div>
                                <span className="font-bold block text-slate-800">HbA1c & Fasting Sugar</span>
                                <span className="text-slate-400">Reports ready in 12 hours</span>
                              </div>
                              <span className="font-extrabold text-blue-600">₹699</span>
                            </div>
                            <button
                              onClick={() => {
                                playChime(750, "sine", 0.25)
                                setBookingStep("success")
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-[10px] font-bold shadow-sm"
                            >
                              Confirm Booking
                            </button>
                          </motion.div>
                        )}

                        {bookingStep === "success" && (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-1.5"
                          >
                            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                            <span className="text-[11px] font-extrabold text-slate-800 block">Home Collection Requested!</span>
                            <p className="text-[9px] text-slate-500 max-w-[200px] mx-auto leading-normal">
                              A laboratory technician will arrive tomorrow morning at 8:00 AM.
                            </p>
                            <button
                              onClick={() => setBookingStep("step1")}
                              className="text-[9px] text-blue-600 hover:underline block mx-auto pt-1 font-bold"
                            >
                              Create new test booking
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-center relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, margin: "-120px" }}
                transition={{ type: "spring", stiffness: 400, damping: 8, delay: 0.1 }}
                className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-200 shadow-md items-center justify-center z-20"
              >
                <motion.div
                  className="w-3.5 h-3.5 rounded-full bg-amber-500"
                  animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: ["0 0 0 0 rgba(245,158,11,0.4)", "0 0 0 8px rgba(245,158,11,0)", "0 0 0 0 rgba(245,158,11,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 order-last lg:order-first"
              >
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left">
                  <div className="absolute left-0 bottom-0 opacity-15 pointer-events-none">
                    <Image
                      src="/images/diabetic_delivery.png"
                      alt="Food delivery graphic"
                      width={180}
                      height={180}
                      className="rounded-tr-2xl object-cover"
                    />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase">
                          DIET FOOD DELIVERY
                        </span>

                        <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            onClick={() => {
                              playChime(420, "sine", 0.08)
                              setMealPlan("daily")
                            }}
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-md transition-all ${
                              mealPlan === "daily" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                            }`}
                          >
                            Single Trial
                          </button>
                          <button
                            onClick={() => {
                              playChime(420, "sine", 0.08)
                              setMealPlan("weekly")
                            }}
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-md transition-all ${
                              mealPlan === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                            }`}
                          >
                            Weekly Pack
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-2">Low-Glycemic Meal Boxes</h4>
                      <p className="text-[11px] text-slate-400">Fresh dietitian-approved meals delivered daily to your home.</p>
                    </div>

                    <div className="my-4 bg-slate-50 border border-slate-100 rounded-2xl p-3 shadow-sm text-left space-y-2">
                      <div className="flex items-center justify-between text-[10px] border-b border-slate-100/60 pb-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                          Ragi Khichdi & baked paneer
                        </span>
                        <span className="font-extrabold text-amber-600">₹{mealPrice}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white border border-slate-100 rounded-lg p-1.5">
                          <span className="text-[7px] text-slate-400 font-bold block">CARB LIMIT</span>
                          <span className="text-xs font-extrabold text-slate-700">32g</span>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-lg p-1.5">
                          <span className="text-[7px] text-slate-400 font-bold block">FIBER RATING</span>
                          <span className="text-xs font-extrabold text-emerald-600">High</span>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-lg p-1.5">
                          <span className="text-[7px] text-slate-400 font-bold block">EST. GLY LOAD</span>
                          <span className="text-xs font-extrabold text-amber-600">11 (Low)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playChime(850, "sine", 0.3)
                        setDeliveryUnlocked(!deliveryUnlocked)
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-2 text-[10px] font-bold shadow-sm"
                    >
                      {deliveryUnlocked ? "Cancel Schedule" : "Setup Delivery Schedule"}
                    </button>
                  </div>
                </div>
              </motion.div>

              <div className="hidden lg:block lg:col-span-2" />

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-4"
              >
                <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                  Phase 4 — Coming Soon
                </span>
                <h3 className="text-2xl font-bold text-slate-800">Diabetic Food Delivery</h3>
                <p className="text-slate-600 text-sm leading-relaxed lg:max-w-md">
                  Dedicated delivery partnerships for portioned, low-glycemic, diabetic-friendly meals custom-tailored to your risk metrics.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
