"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  FileText,
  Camera,
  Bot,
  Utensils,
  Globe,
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Send,
  CheckSquare,
  Volume2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
} from "lucide-react"

// Speech synthesizer sound helper for subtle micro-interactions
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
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {
    // Ignore blockages of AudioContext
  }
}

// Bounce-in animation variants (Beato-style) — lightweight, GPU-friendly
const bounceInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 14,
      mass: 0.6,
    },
  },
}

const bounceInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 14,
      mass: 0.6,
    },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.04,
    },
  },
}

export function FeaturesSection() {
  const sectionContainerRef = useRef(null)
  // ==========================================
  // STATE WIDGET 1: AI REPORT SCANNER
  // ==========================================
  const [reportScanStep, setReportScanStep] = useState<"idle" | "uploading" | "scanning" | "finished">("idle")
  const [scanProgress, setScanProgress] = useState(0)
  const reportRef = useRef(null)

  const startReportScan = () => {
    playChime(600, "sine", 0.15)
    setReportScanStep("uploading")
    setScanProgress(0)
  }

  useEffect(() => {
    if (reportScanStep === "uploading") {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setReportScanStep("scanning")
            playChime(750, "triangle", 0.2)
            return 100
          }
          return prev + 10
        })
      }, 150)
      return () => clearInterval(interval)
    } else if (reportScanStep === "scanning") {
      const timeout = setTimeout(() => {
        setReportScanStep("finished")
        playChime(880, "sine", 0.3)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [reportScanStep])

  // ==========================================
  // STATE WIDGET 2: AI MEAL SCANNER
  // ==========================================
  const [portion, setPortion] = useState<0.5 | 1 | 1.5>(1)
  const [showSpikeInfo, setShowSpikeInfo] = useState(false)

  const mealCarbs = Math.round(42 * portion)
  const mealGlycemicLoad = Math.round(14 * portion)
  const predictedSpike = Math.round(30 * portion)

  // ==========================================
  // STATE WIDGET 3: AI HEALTH CHAT
  // ==========================================
  interface ChatMsg {
    sender: "user" | "bot"
    text: string
  }

  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      sender: "bot",
      text: "Namaste! I am your AI Health Assistant. Ask me any question about blood sugar, recipes, or test metrics.",
    },
  ])
  const [chatIsTyping, setChatIsTyping] = useState(false)

  const quickChats = [
    { label: "Banana for HbA1c 7?", query: "Can I eat bananas if my HbA1c is 7.0?" },
    { label: "Best bedtime snack?", query: "What is a good diabetes-friendly snack before sleeping?" },
  ]

  const sendChatMessage = (query: string) => {
    if (!query.trim()) return
    playChime(500, "sine", 0.1)
    setChatMessages((prev) => [...prev, { sender: "user", text: query }])
    setChatInput("")
    setChatIsTyping(true)

    setTimeout(() => {
      let reply = "Based on general guidelines, low-GI foods are recommended. Consult with a doctor for diagnosis."
      const q = query.toLowerCase()
      if (q.includes("banana")) {
        reply = "Bananas are rich in potassium but contain fast carbs. With an HbA1c of 7.0 (borderline/diabetic), you can enjoy a half-banana paired with some almonds or peanut butter to slow sugar absorption!"
      } else if (q.includes("snack") || q.includes("bedtime")) {
        reply = "A great bedtime snack is a small handful of walnuts, pumpkin seeds, or cucumber slices with hummus. These contain protein and healthy fats which keep blood glucose stable overnight and prevent morning spikes."
      } else if (q.includes("rice")) {
        reply = "Polished white rice has a high Glycemic Index and can spike glucose quickly. Consider substituting it with Brown Rice, Foxtail Millet, or Quinoa, or control portion size and mix in plenty of high-fiber vegetables."
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }])
      setChatIsTyping(false)
      playChime(660, "sine", 0.2)
    }, 1200)
  }

  // ==========================================
  // STATE WIDGET 4: COACH CHECKLIST
  // ==========================================
  const [coachTasks, setCoachTasks] = useState([
    { id: 1, label: "Drink 3L of water today", points: 10, completed: true },
    { id: 2, label: "15 min brisk walk after lunch", points: 20, completed: false },
    { id: 3, label: "Pranayama (10 mins deep breathing)", points: 15, completed: false },
    { id: 4, label: "Limit fast-carb intake under 80g", points: 25, completed: true },
  ])

  const toggleCoachTask = (id: number) => {
    setCoachTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed
          if (nextState) playChime(700, "triangle", 0.15)
          else playChime(400, "sine", 0.1)
          return { ...t, completed: nextState }
        }
        return t
      })
    )
  }

  const completedCount = coachTasks.filter((t) => t.completed).length
  const totalPoints = coachTasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0)

  // ==========================================
  // STATE WIDGET 5: INDIAN LANGUAGES
  // ==========================================
  const [langIndex, setLangIndex] = useState(0)
  const languages = [
    { code: "en", name: "English", welcome: "Everything you need to manage diabetes." },
    { code: "hi", name: "हिंदी (Hindi)", welcome: "मधुमेह को नियंत्रित करने के लिए सब कुछ यहाँ है।" },
    { code: "ta", name: "தமிழ் (Tamil)", welcome: "நீரிழிவு நோயை நிர்வகிக்க தேவையான அனைத்தும்." },
    { code: "te", name: "తెలుగు (Telugu)", welcome: "మధుమేహాన్ని అదుపులో ఉంచుకోవడానికి కావలసినదంతా." },
    { code: "mr", name: "मराठी (Marathi)", welcome: "मधुमेह नियंत्रित ठेवण्यासाठी सर्व काही येथे उपलब्ध आहे।" },
    { code: "bn", name: "বাংলা (Bengali)", welcome: "ডায়াবেটিস নিয়ন্ত্রণের জন্য প্রয়োজনীয় সমস্ত কিছু।" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)", welcome: "ಮಧುಮೇಹವನ್ನು ನಿರ್ವಹಿಸಲು ಬೇಕಾದ ಎಲ್ಲವೂ ಇಲ್ಲಿದೆ." },
  ]

  const rotateLanguage = (idx: number) => {
    playChime(550, "sine", 0.08)
    setLangIndex(idx)
  }

  return (
    <section id="features" ref={sectionContainerRef} className="py-24 bg-gradient-to-b from-[#FDF6EE] via-white to-white relative overflow-hidden">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C4A882 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Everything you need to <span className="text-gradient">stay ahead of diabetes</span>
          </h2>
          <p className="text-slate-500 text-lg mt-4 leading-relaxed">
            From lab report AI analysis to meal scanning and personalized coaching — all built with cutting-edge AI and designed for every Indian.
          </p>
        </div>

        {/* Feature cards — Beato-style bounce transitions */}
        <div className="space-y-16 lg:space-y-24">
            {/* ========================================================================= */}
            {/* FEATURE 1: AI REPORT ANALYSIS */}
            {/* ========================================================================= */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
            >
        
          <motion.div variants={bounceInLeft} className="lg:col-span-6 space-y-6 order-last lg:order-first">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>Smart Diagnostic Reader</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              AI Report Analysis
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Upload your lab report PDFs and get instant, clear explanations of every health metric. Our AI parses raw data and flags what matters.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">No Complex Jargon</h4>
                  <p className="text-[11px] text-slate-500">Converts technical medical indicators into terms any non-professional can fully understand.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Color-Coded Risk Indicators</h4>
                  <p className="text-[11px] text-slate-500">Instantly flags parameters that fall outside standard ranges (Normal, Borderline, Danger).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Historical Health Tracking</h4>
                  <p className="text-[11px] text-slate-500">Integrates metrics across reports over time to show long-term wellness trends.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={bounceInRight} className="lg:col-span-6">
            <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Background Art */}
              <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                <Image
                  src="/images/ai_report_analysis.png"
                  alt="Report analysis illustration"
                  width={240}
                  height={240}
                  className="rounded-bl-3xl object-cover"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase">
                    Interactive Mockup
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Report Parsing Sandbox</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Simulate report uploads and witness the AI breakdown mechanism.</p>
                </div>

                <div className="my-6">
                  <AnimatePresence mode="wait">
                    {reportScanStep === "idle" && (
                      <motion.div
                        key="idle-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-white flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors"
                        onClick={startReportScan}
                      >
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Click to Upload Report</span>
                        <span className="text-[10px] text-slate-400 mt-1">Accepts PDF or Image files (e.g., blood test)</span>
                      </motion.div>
                    )}

                    {reportScanStep === "uploading" && (
                      <motion.div
                        key="uploading-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3"
                      >
                        <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                        <span className="text-xs font-bold text-slate-700">Uploading `blood_report_Q2.pdf`</span>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[200px]">
                          <div className="bg-teal-600 h-1.5 rounded-full transition-all duration-150" style={{ width: `${scanProgress}%` }} />
                        </div>
                      </motion.div>
                    )}

                    {reportScanStep === "scanning" && (
                      <motion.div
                        key="scanning-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-2 relative overflow-hidden min-h-[140px]"
                      >
                        {/* Scanning Laser Beam Line */}
                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_8px_rgba(20,184,166,0.8)] z-20"
                          animate={{
                            top: ["0%", "100%", "0%"]
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-700">AI Report Parser at work...</span>
                        <p className="text-[10px] text-slate-400 animate-pulse">Extracting values and matching metrics against health benchmarks.</p>
                      </motion.div>
                    )}

                    {reportScanStep === "finished" && (
                      <motion.div
                        key="finished-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <span className="text-[10px] text-slate-400 font-bold">ANALYZED METRICS</span>
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Fully Parsed
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                              <span className="text-[9px] text-slate-400 font-bold block">HbA1c Level</span>
                              <span className="text-sm font-extrabold text-red-600">7.2%</span>
                              <span className="text-[9px] text-red-600/90 font-medium block">High (Action Required)</span>
                            </div>
                            <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                              <span className="text-[9px] text-slate-400 font-bold block">Fasting Glucose</span>
                              <span className="text-sm font-extrabold text-amber-600">126 mg/dL</span>
                              <span className="text-[9px] text-amber-600/90 font-medium block">Borderline High</span>
                            </div>
                          </div>

                          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-2.5 text-[10px] text-slate-600 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-800 block">AI Assessment Note:</span>
                              Average sugar has climbed. Prioritize whole-wheat chapatis and active walking routines.
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setReportScanStep("idle")}
                          className="w-full text-center text-[10px] font-bold text-teal-600 hover:text-teal-700 bg-white border border-teal-100 py-2 rounded-xl transition-all"
                        >
                          Clear & Scan Another Report
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* FEATURE 2: AI MEAL SCANNER */}
        {/* ========================================================================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
        >
          <motion.div variants={bounceInLeft} className="lg:col-span-6">
            <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase">
                      Nutrition Scanner
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2">Dosa & Sambar Scan</h4>
                  </div>
                  <button
                    onClick={() => {
                      playChime(620, "sine", 0.1)
                      setShowSpikeInfo(!showSpikeInfo)
                    }}
                    className="text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full hover:bg-orange-100/50 transition-all"
                  >
                    {showSpikeInfo ? "Show Nutrition" : "Show Predicted Spike"}
                  </button>
                </div>

                <div className="my-5 relative flex items-center justify-center bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800">
                  {/* Photo of Food */}
                  <Image
                    src="/images/ai_meal_scanner.png"
                    alt="AI Plate Scanner Simulation"
                    fill
                    className="object-cover opacity-80"
                  />

                  {/* Scanner Graphic Overlays */}
                  <div className="absolute inset-0 border border-orange-500/30 animate-pulse pointer-events-none" />
                  
                  {/* Target Bounding Box 1 */}
                  <div className="absolute top-1/4 left-1/4 w-32 h-20 border-2 border-dashed border-teal-400 rounded-lg flex flex-col justify-between p-1 bg-black/20 pointer-events-none">
                    <span className="text-[8px] bg-teal-400 text-black px-1 rounded-sm w-fit font-bold font-sans">Masala Dosa</span>
                    <span className="text-[8px] text-white/90 font-bold self-end bg-black/40 px-1 rounded-sm">1 unit</span>
                  </div>

                  {/* Target Bounding Box 2 */}
                  <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-dashed border-orange-400 rounded-full flex flex-col justify-between p-1 bg-black/20 pointer-events-none">
                    <span className="text-[8px] bg-orange-400 text-white px-1 rounded-sm w-fit font-bold font-sans">Sambar</span>
                    <span className="text-[8px] text-white/90 font-bold self-end bg-black/40 px-1 rounded-sm">1 bowl</span>
                  </div>

                  {/* Portion Slider overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                    <span className="text-[9px] text-slate-300 font-bold">Portion Size:</span>
                    <div className="flex gap-1.5">
                      {[0.5, 1, 1.5].map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            playChime(400 + val * 100, "triangle", 0.08)
                            setPortion(val as any)
                          }}
                          className={`text-[9px] font-bold px-2.5 py-1 rounded-md transition-all ${
                            portion === val ? "bg-orange-500 text-white shadow-sm" : "bg-white/10 text-slate-300 hover:bg-white/20"
                          }`}
                        >
                          {val === 0.5 ? "Small" : val === 1 ? "Normal" : "Large"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Values summary */}
                <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center justify-between text-left">
                  <AnimatePresence mode="wait">
                    {!showSpikeInfo ? (
                      <motion.div
                        key="nutrition-vals"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="grid grid-cols-2 gap-4 w-full"
                      >
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Est. Carb Load</span>
                          <span className="text-xs font-bold text-slate-800">{mealCarbs}g Carbs</span>
                          <p className="text-[9px] text-slate-500">Medium glycemic impact</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Glycemic Load Index</span>
                          <span className="text-xs font-bold text-orange-600">{mealGlycemicLoad} GL</span>
                          <p className="text-[9px] text-slate-500">Moderate portion safety</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="spike-vals"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Est. Blood Sugar Change</span>
                          <span className="text-sm font-extrabold text-orange-600">+{predictedSpike} mg/dL</span>
                          <span className="text-[9px] text-slate-500 block">Peak estimated in 45-60 mins</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-100">
                          <TrendingDown className="w-3.5 h-3.5" /> Normal range absorption
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={bounceInRight} className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Meal Scanner</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              AI Meal Scanner
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Snap a photo of your plate — get instant carb estimates and predicted blood sugar impact. Know what you eat before it affects you.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Designed for Indian Kitchens</h4>
                  <p className="text-[11px] text-slate-500">Fine-tuned database recognizes complex multi-ingredient Indian items like curries, chapatis, idlis, and biryanis.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Spike Projection Analysis</h4>
                  <p className="text-[11px] text-slate-500">Combines insulin history and dish composition to model a mock post-meal blood sugar graph before you eat.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Portion Adjustment Slider</h4>
                  <p className="text-[11px] text-slate-500">Dial the portion weight up or down to find the sweet spot where carbohydrate load remains safe.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* FEATURE 3: AI HEALTH CHAT */}
        {/* ========================================================================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
        >
          <motion.div variants={bounceInLeft} className="lg:col-span-6 space-y-6 order-last lg:order-first">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold">
              <Bot className="w-3.5 h-3.5" />
              <span>Contextual Health Companion</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              AI Health Chat
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Our advanced conversational AI explains your health metrics clearly without making diagnoses. Ask anything, anytime.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Educational Dialogue Focus</h4>
                  <p className="text-[11px] text-slate-500">Provides clear, objective information on glycemic indexes, recipe conversions, and lifestyle methods without diagnostic claims.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Available 24 Hours a Day</h4>
                  <p className="text-[11px] text-slate-500">Ask questions late at night or early morning regarding symptoms, nutrition values, or insulin metrics.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Contextual Medical Sync</h4>
                  <p className="text-[11px] text-slate-500">Remembers your uploaded lab reports so it can contextualize recipes according to your current HbA1c values.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={bounceInRight} className="lg:col-span-6">
            <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Image background block */}
              <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none">
                <Image
                  src="/images/ai_health_chat.png"
                  alt="AI Health Chat Screen Illustration"
                  width={240}
                  height={240}
                  className="rounded-tr-3xl object-cover"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
                {/* Chat Widget Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 bg-slate-50/80">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Bot className="w-4.5 h-4.5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Assistant Spark</h4>
                      <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 bg-slate-100/70 border px-2 py-0.5 rounded-md font-semibold">
                    Safe Sandbox
                  </span>
                </div>

                {/* Dialog Messages Pane */}
                <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[180px] pr-1 scrollbar-thin">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-violet-600 text-white rounded-tr-none shadow-sm"
                            : "bg-white text-slate-700 border border-violet-100/60 rounded-tl-none text-left"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {chatIsTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-violet-100/60 rounded-2xl rounded-tl-none px-3.5 py-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Prompts Panel */}
                <div className="mt-3 pt-2 border-t border-slate-100 bg-slate-50/90 z-25">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {quickChats.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => sendChatMessage(c.query)}
                        className="text-[9px] font-bold text-violet-700 bg-violet-50 hover:bg-violet-600 hover:text-white border border-violet-100 rounded-full px-2.5 py-1.5 transition-all text-left"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Text Submission Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      sendChatMessage(chatInput)
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a query (e.g. Can I eat rice?)..."
                      className="flex-1 border border-slate-200 focus:border-violet-400 focus:outline-none rounded-xl px-3 py-2 text-[11px] text-slate-700 bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-3 flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* FEATURE 4: DIET & LIFESTYLE COACH */}
        {/* ========================================================================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
        >
          <motion.div variants={bounceInLeft} className="lg:col-span-6">
            <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Image illustration box */}
              <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
                <Image
                  src="/images/diet_lifestyle_coach.png"
                  alt="Diet and lifestyle coach graphic"
                  width={240}
                  height={240}
                  className="rounded-tl-3xl object-cover"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                    Lifestyle Assistant
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Daily Wellness Blueprint</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Complete daily targets to increase your natural metabolic score.</p>
                </div>

                <div className="my-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-left space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-[10px] font-bold text-slate-400">TODAY'S TO-DOS</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ★ {totalPoints} XP Gained
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {coachTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => toggleCoachTask(t.id)}
                        className={`flex items-center gap-3 p-2 border rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${
                          t.completed ? "bg-emerald-50/30 border-emerald-200" : "bg-white border-slate-100"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                            t.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                          }`}
                        >
                          {t.completed && <CheckSquare className="w-3.5 h-3.5" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[11px] font-semibold block leading-tight ${t.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                            {t.label}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${t.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          +{t.points} XP
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 w-24">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${(completedCount / coachTasks.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{completedCount}/{coachTasks.length} Completed</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      Keep it up!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={bounceInRight} className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
              <Utensils className="w-3.5 h-3.5" />
              <span>Tailored Lifestyle Blueprint</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              Diet & Lifestyle Coach
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Receive personalized weekly meal blueprints and targeted risk-mitigation routines based on your unique health profile and preferences.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Weekly Customized Menus</h4>
                  <p className="text-[11px] text-slate-500">Weekly regional menu boards showing breakfast, lunch, and dinner recipes adapted to your taste bud preferences.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Holistic Yoga Modules</h4>
                  <p className="text-[11px] text-slate-500">Provides guided yoga routines (like Surya Namaskar, Mandukasana) developed to improve metabolic health naturally.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Reward & Streak Gamification</h4>
                  <p className="text-[11px] text-slate-500">Build habit consistency by logging tasks daily, earning wellness points, and unlocking badges.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ========================================================================= */}
        {/* FEATURE 5: 8+ INDIAN LANGUAGES */}
        {/* ========================================================================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-12 gap-12 items-center py-8 relative"
        >
          <motion.div variants={bounceInLeft} className="lg:col-span-6 space-y-6 order-last lg:order-first">
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>Multilingual Healthcare Access</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
              8+ Indian Languages
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Full voice and text support in Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, and more. Healthcare in your mother tongue.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Voice-Activated Accessibility</h4>
                  <p className="text-[11px] text-slate-500">Perfect for elderly relatives. Speak in Hindi, Tamil, or Telugu, and let the assistant explain report readings vocally.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Complex Medical Translation</h4>
                  <p className="text-[11px] text-slate-500">Deciphers heavy clinical terminology into simple, traditional local descriptions that feel comfortable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 mt-0.5 flex-shrink-0 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Cross-Script Compatibility</h4>
                  <p className="text-[11px] text-slate-500">Ask questions in Romanised script (Hinglish/Tanglish) and get perfectly localized standard scripts back.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={bounceInRight} className="lg:col-span-6">
            <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Image illustration background */}
              <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
                <Image
                  src="/images/indian_languages.png"
                  alt="Indian languages visual graphic"
                  width={240}
                  height={240}
                  className="rounded-bl-3xl object-cover"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase">
                    Language Localization
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Regional Interface Preview</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Select a language to see real-time app localization in action.</p>
                </div>

                {/* Animated Speech/Interface card */}
                <div className="my-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-left min-h-[110px] flex flex-col justify-center space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">APP LOCALIZATION STATE</span>
                    <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Volume2 className="w-3 h-3" /> Voice Ready
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={langIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5"
                    >
                      <span className="text-[10px] text-sky-600 font-extrabold uppercase">{languages[langIndex].name}</span>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {languages[langIndex].welcome}
                      </p>
                      <p className="text-[10px] text-slate-400 italic font-sans leading-normal">
                        "मधुमेह की रिपोर्ट अपलोड करें और घर की भाषा में समझें"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Language button grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  {languages.map((l, idx) => (
                    <button
                      key={l.code}
                      onClick={() => rotateLanguage(idx)}
                      className={`text-[10px] font-bold py-2 rounded-xl border transition-all text-center ${
                        langIndex === idx
                          ? "bg-sky-50 border-sky-300 text-sky-700 shadow-sm"
                          : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {l.name.split(" ")[0]}
                    </button>
                  ))}
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
