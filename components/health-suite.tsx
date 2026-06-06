"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Calculator,
  Calendar,
  Timer,
  Send,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Brain,
  Apple,
  Activity,
  Flame,
  ShieldAlert,
  ArrowRight,
  User,
  Info
} from "lucide-react"

// Types & Helpers for AI Chat
interface Message {
  sender: "user" | "bot"
  text: string
  timestamp: Date
}

const PRESETS = [
  { label: "Lower Blood Sugar Quickly", query: "How can I lower my blood sugar quickly?" },
  { label: "Normal HbA1c Levels", query: "What is a normal HbA1c level?" },
  { label: "Low-Carb Snack Ideas", query: "Suggest a quick low-carb snack." }
]

const BOT_RESPONSES: Record<string, string> = {
  "How can I lower my blood sugar quickly?":
    "To lower blood sugar quickly, consider drinking plenty of water, doing light exercises like a brisk 15-minute walk, and avoiding refined carbs. Consistent sleep and fiber intake also keep your levels stable.",
  "What is a normal HbA1c level?":
    "A normal HbA1c level is below 5.7%. A level between 5.7% and 6.4% indicates prediabetes, and 6.5% or higher indicates diabetes. Tracking this over 3 months is crucial!",
  "Suggest a quick low-carb snack.":
    "Excellent low-carb snacks include: a handful of almonds or walnuts, sliced cucumber with hummus, boiled eggs, or a bowl of fresh berries (which have a low glycemic index)."
}

// Sound Synthesis Helper using Web Audio API
const playBeep = (frequency = 523.25, duration = 0.5) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const audioCtx = new AudioContextClass()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration)

    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + duration)
  } catch (e) {
    console.error("Web Audio API not allowed or blocked: ", e)
  }
}

export function InteractiveHealthSuite() {
  const [activeTab, setActiveTab] = useState<"chat" | "risk" | "plan" | "timer">("chat")

  // --- TAB 1: AI CHAT STATE ---
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your AI Health Assistant. Ask me anything about blood sugar, dietary choices, or diabetic wellness metrics.",
      timestamp: new Date()
    }
  ])
  const [inputVal, setInputVal] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    // User message
    const userMsg: Message = { sender: "user", text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInputVal("")
    setIsTyping(true)

    // Simulate bot thinking and typing
    setTimeout(() => {
      const normalizedText = text.trim()
      let replyText =
        "That's a great question! For a fully personalized assessment, consult with a health advisor. Remember to check blood sugar levels regularly."
      
      if (BOT_RESPONSES[normalizedText]) {
        replyText = BOT_RESPONSES[normalizedText]
      } else {
        // Simple keywords matches
        const lower = normalizedText.toLowerCase()
        if (lower.includes("sugar") || lower.includes("glucose")) {
          replyText = "Fasting blood glucose levels below 100 mg/dL are normal. Levels between 100-125 mg/dL indicate prediabetes. Regular light cardio helps maintain healthy levels."
        } else if (lower.includes("diet") || lower.includes("eat") || lower.includes("food")) {
          replyText = "Prioritize whole foods with a low Glycemic Index (GI) like leafy greens, whole grains, pulses, and lean proteins. Try to avoid sugary beverages and processed food."
        } else if (lower.includes("exercise") || lower.includes("workout") || lower.includes("yoga")) {
          replyText = "150 minutes of moderate physical activity per week is highly recommended. Incorporating yoga poses like Bhujangasana or light squats can improve insulin sensitivity."
        }
      }

      setMessages(prev => [...prev, { sender: "bot", text: replyText, timestamp: new Date() }])
      setIsTyping(false)
      playBeep(440, 0.15) // Play low notification beep when message arrives
    }, 1500)
  }

  // --- TAB 2: RISK CALCULATOR STATE ---
  const [age, setAge] = useState(35)
  const [weight, setWeight] = useState(70) // kg
  const [height, setHeight] = useState(170) // cm
  const [familyHistory, setFamilyHistory] = useState("no")
  const [activity, setActivity] = useState("moderate")
  const [dietType, setDietType] = useState("balanced")
  const [riskReport, setRiskReport] = useState<{ score: number; level: "Low" | "Moderate" | "High"; advice: string } | null>(null)

  const calculateRisk = () => {
    let score = 0
    
    // Age factor
    if (age > 45) score += 3
    else if (age > 30) score += 1

    // BMI factor
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    if (bmi >= 30) score += 4
    else if (bmi >= 25) score += 2

    // Family History factor
    if (familyHistory === "yes") score += 3

    // Activity factor
    if (activity === "sedentary") score += 3
    else if (activity === "light") score += 2
    else if (activity === "moderate") score += 1

    // Diet factor
    if (dietType === "high-carb") score += 3
    else if (dietType === "balanced") score += 1

    let level: "Low" | "Moderate" | "High" = "Low"
    let advice = ""

    if (score >= 9) {
      level = "High"
      advice = "We highly recommend speaking to a general practitioner for an HbA1c screening. Focus on reducing carbohydrates, eliminating refined sugar, and adding daily aerobic exercises."
    } else if (score >= 5) {
      level = "Moderate"
      advice = "Your risk is moderate. Focus on maintaining a balanced diet, tracking your daily workouts, and getting 7-8 hours of quality sleep to lower factors."
    } else {
      level = "Low"
      advice = "Great job! Keep up the healthy habits: drink plenty of water, perform yoga exercises, and consume fiber-rich meals to maintain a low risk index."
    }

    setRiskReport({ score, level, advice })
    playBeep(587.33, 0.35) // Play D5 chime upon successful calculation
  }

  // --- TAB 3: PLANNER STATE ---
  const [selectedGoal, setSelectedGoal] = useState<"sugar" | "weight" | "active">("sugar")
  
  const PLAN_DATA = {
    sugar: {
      meals: {
        breakfast: "Sprouted Moong Dal Chilla with Mint Chutney (Low GI, Protein-rich)",
        lunch: "Brown Rice/Quinoa with Mixed Vegetable Curry and Greek Yogurt",
        dinner: "Grilled Tofu/Paneer Salad with cucumbers, tomatoes, and pumpkin seeds"
      },
      yoga: [
        { name: "Paschimottanasana", desc: "Seated forward bend: stimulates liver & pancreas.", duration: "2 mins" },
        { name: "Ardha Matsyendrasana", desc: "Half spinal twist: tones internal abdominal organs.", duration: "3 mins" },
        { name: "Shavasana", desc: "Corpse pose: calms nervous system and lowers cortisol.", duration: "5 mins" }
      ]
    },
    weight: {
      meals: {
        breakfast: "Oatmeal cooked in almond milk, topped with chia seeds and walnuts",
        lunch: "Sautéed chicken breast/chana bowl with baby spinach, tomatoes, and olive oil",
        dinner: "Steamed broccoli, cauliflower, and paneer bowl with light vegetable broth"
      },
      yoga: [
        { name: "Surya Namaskar", desc: "Sun Salutations: dynamic sequence boosting metabolism.", duration: "5 rounds" },
        { name: "Naukasana", desc: "Boat pose: strengthens core abdominal muscles.", duration: "1 min" },
        { name: "Trikonasana", desc: "Triangle pose: stretches waist, burns side fat.", duration: "2 mins" }
      ]
    },
    active: {
      meals: {
        breakfast: "Scrambled eggs or Paneer bhurji with a slice of whole wheat toast",
        lunch: "Whole wheat wraps stuffed with hummus, grilled vegetables, and bell peppers",
        dinner: "Lentil soup (dal) with a side of stir-fried green beans and tofu"
      },
      yoga: [
        { name: "Virabhadrasana II", desc: "Warrior 2: improves lung capacity and builds stamina.", duration: "2 mins" },
        { name: "Vrikshasana", desc: "Tree pose: enhances body balance, focus, and posture.", duration: "2 mins" },
        { name: "Bhujangasana", desc: "Cobra pose: expands chest, strengthens spinal column.", duration: "2 mins" }
      ]
    }
  }

  // --- TAB 4: TIMER STATE ---
  const EXERCISES = [
    { name: "Bhujangasana (Cobra)", duration: 30, color: "from-orange-500 to-orange-600" },
    { name: "Dhanurasana (Bow Pose)", duration: 45, color: "from-teal-500 to-teal-600" },
    { name: "Plank (Core Hold)", duration: 60, color: "from-violet-500 to-purple-600" },
    { name: "Brisk Paced Walk (Indoor)", duration: 60, color: "from-blue-500 to-indigo-600" }
  ]
  const [selectedExIndex, setSelectedExIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(EXERCISES[0].duration)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTimeLeft(EXERCISES[selectedExIndex].duration)
    setTimerRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [selectedExIndex])

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false)
            if (timerRef.current) clearInterval(timerRef.current)
            // Play alarm sound
            playBeep(880, 0.4) // A5 note
            setTimeout(() => playBeep(880, 0.4), 200)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerRunning])

  const toggleTimer = () => {
    setTimerRunning(!timerRunning)
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setTimeLeft(EXERCISES[selectedExIndex].duration)
  }

  const progressPercent = (timeLeft / EXERCISES[selectedExIndex].duration) * 100

  return (
    <section id="interactive-suite" className="py-24 bg-gradient-to-b from-[#FFFBF7] via-white to-[#FDF6EE] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full opacity-10 bg-[radial-gradient(circle,_rgba(255,87,34,0.12)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full opacity-10 bg-[radial-gradient(circle,_rgba(13,148,136,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4">
            Interactive Health Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Try Our <span className="text-gradient">AI Health Tools</span> Instantly
          </h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Test drive our real-time interactive widgets. Chat with the virtual coach, calculate risk indexes, view targeted plan blueprints, or run the inbuilt exercise counter.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#FAF0E4]/60 border border-[#F0E6D9] rounded-2xl max-w-2xl mx-auto mb-8 shadow-sm">
          {[
            { id: "chat", label: "AI Health Chat", icon: MessageSquare, color: "text-orange-600" },
            { id: "risk", label: "Risk Calculator", icon: Calculator, color: "text-teal-600" },
            { id: "plan", label: "Diet & Yoga Planner", icon: Calendar, color: "text-violet-600" },
            { id: "timer", label: "Workout Timer", icon: Timer, color: "text-blue-600" }
          ].map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  playBeep(659.25, 0.08) // E5 note on clicking tabs
                }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isActive ? "text-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl shadow-md border border-orange-100"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className={`w-4 h-4 ${tab.color}`} />
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 min-h-[480px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* TAB 1: AI HEALTH CHAT */}
            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-[420px] justify-between w-full"
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Diabetes Assistant</h4>
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online & Ready
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1">
                    <Info className="w-3 h-3 text-slate-500" /> Educational only
                  </span>
                </div>

                {/* Message Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-orange-500 text-white rounded-tr-none shadow-md"
                            : "bg-[#FFFBF7] text-slate-700 border border-orange-100 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#FFFBF7] border border-orange-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Preset Prompts & Inputs */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(p.query)}
                        className="text-[10px] font-bold text-orange-700 hover:text-white bg-orange-50 hover:bg-orange-600 border border-orange-100 rounded-full px-3 py-1.5 transition-all duration-300 shadow-sm"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      handleSendMessage(inputVal)
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      placeholder="Ask me a health question..."
                      className="flex-1 border border-slate-200 focus:border-orange-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-700 placeholder-slate-400"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl px-4 py-2.5 flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB 2: RISK CALCULATOR */}
            {activeTab === "risk" && (
              <motion.div
                key="risk-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full grid md:grid-cols-12 gap-8 items-center"
              >
                {/* Form Controls */}
                <div className="md:col-span-7 space-y-4 text-left">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-teal-600" /> Complete Risk Profile
                  </h4>

                  {/* Age selector */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <label>Age: {age} years</label>
                      <span className="text-slate-400">18 - 85</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="85"
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      className="w-full accent-teal-600 bg-slate-100 rounded-lg h-2 appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Height & Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Weight (kg)</label>
                      <input
                        type="number"
                        min="35"
                        max="150"
                        value={weight}
                        onChange={e => setWeight(Number(e.target.value))}
                        className="w-full border border-slate-200 focus:border-teal-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Height (cm)</label>
                      <input
                        type="number"
                        min="100"
                        max="220"
                        value={height}
                        onChange={e => setHeight(Number(e.target.value))}
                        className="w-full border border-slate-200 focus:border-teal-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Radios for history & activity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Family History</label>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setFamilyHistory("yes")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            familyHistory === "yes"
                              ? "bg-teal-50 border-teal-300 text-teal-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setFamilyHistory("no")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            familyHistory === "no"
                              ? "bg-teal-50 border-teal-300 text-teal-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Diet Type</label>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setDietType("balanced")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            dietType === "balanced"
                              ? "bg-teal-50 border-teal-300 text-teal-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          Balanced
                        </button>
                        <button
                          type="button"
                          onClick={() => setDietType("high-carb")}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            dietType === "high-carb"
                              ? "bg-teal-50 border-teal-300 text-teal-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          High Carbs
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Daily Activity Level</label>
                    <select
                      value={activity}
                      onChange={e => setActivity(e.target.value)}
                      className="w-full border border-slate-200 focus:border-teal-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-700 bg-white"
                    >
                      <option value="sedentary">Sedentary (desk work, no workout)</option>
                      <option value="light">Lightly Active (1-2 days walk/week)</option>
                      <option value="moderate">Moderately Active (3-4 workouts/week)</option>
                      <option value="active">Highly Active (daily sports/intense activity)</option>
                    </select>
                  </div>

                  <button
                    onClick={calculateRisk}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl py-3 font-semibold text-xs mt-3 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] transition-all"
                  >
                    <Calculator className="w-4 h-4" /> Calculate Risk Score
                  </button>
                </div>

                {/* Score Report Display */}
                <div className="md:col-span-5 flex flex-col justify-center items-center h-full min-h-[300px] border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                  {riskReport ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 w-full"
                    >
                      <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                        {/* Circle score bg */}
                        <div className="absolute inset-0 rounded-full border-[10px] border-slate-50" />
                        <div
                          className={`absolute inset-0 rounded-full border-[10px] ${
                            riskReport.level === "High"
                              ? "border-red-500"
                              : riskReport.level === "Moderate"
                              ? "border-amber-500"
                              : "border-emerald-500"
                          }`}
                          style={{
                            clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                            transform: `rotate(${Math.min(riskReport.score * 20, 360)}deg)`
                          }}
                        />
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-slate-800">{riskReport.score}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score Index</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Risk Diagnosis</span>
                        <h5
                          className={`text-lg font-extrabold ${
                            riskReport.level === "High"
                              ? "text-red-600"
                              : riskReport.level === "Moderate"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {riskReport.level} Risk Profile
                        </h5>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] text-slate-500 leading-relaxed text-left">
                        <span className="font-bold text-slate-700 block mb-1">Tailored Care Advice:</span>
                        {riskReport.advice}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-700">Calculated Report Pending</h5>
                        <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-1 leading-normal">
                          Input your body details and lifestyle factors on the left to verify your risk profile index.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: PLANNER */}
            {activeTab === "plan" && (
              <motion.div
                key="plan-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full text-left space-y-6"
              >
                {/* Mode Selectors */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-slate-600">Select Goal Blueprint:</span>
                  <div className="flex gap-2">
                    {[
                      { id: "sugar", label: "Sugar Control", color: "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100/30" },
                      { id: "weight", label: "Weight Loss", color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100/30" },
                      { id: "active", label: "Active Stature", color: "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100/30" }
                    ].map(goal => {
                      const isSel = selectedGoal === goal.id
                      return (
                        <button
                          key={goal.id}
                          onClick={() => {
                            setSelectedGoal(goal.id as any)
                            playBeep(493.88, 0.1) // B4 tone
                          }}
                          className={`px-4 py-2 border rounded-full text-xs font-bold transition-all duration-300 ${
                            isSel ? goal.color + " ring-2 ring-offset-2 ring-slate-400" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {goal.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Split Plan Grid */}
                <div className="grid md:grid-cols-2 gap-8 pt-2">
                  {/* Left: Diet Schedule */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Apple className="w-4 h-4 text-orange-500" /> Healthy Menu Blueprint
                    </h5>
                    
                    <div className="space-y-3">
                      {[
                        { label: "Breakfast (8:30 AM)", val: PLAN_DATA[selectedGoal].meals.breakfast },
                        { label: "Lunch (1:30 PM)", val: PLAN_DATA[selectedGoal].meals.lunch },
                        { label: "Dinner (8:00 PM)", val: PLAN_DATA[selectedGoal].meals.dinner }
                      ].map((m, idx) => (
                        <div key={idx} className="bg-[#FFFBF7] border border-orange-100/50 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 text-orange-600 text-[10px] font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block">{m.label}</span>
                            <span className="text-xs font-semibold text-slate-700 leading-normal">{m.val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Yoga Routines */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-teal-500" /> Yoga & Recovery Poses
                    </h5>

                    <div className="space-y-3">
                      {PLAN_DATA[selectedGoal].yoga.map((y, idx) => (
                        <div key={idx} className="bg-teal-50/20 border border-teal-100/50 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3.5">
                            <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 text-teal-600 text-[10px] font-bold">
                              ✓
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">{y.name}</span>
                              <span className="text-[11px] text-slate-500 leading-normal">{y.desc}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-teal-600 bg-white border border-teal-100 px-2.5 py-1 rounded-full flex-shrink-0">
                            {y.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: WORKOUT TIMER */}
            {activeTab === "timer" && (
              <motion.div
                key="timer-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full grid md:grid-cols-12 gap-8 items-center"
              >
                {/* Exercise Selector */}
                <div className="md:col-span-6 space-y-4 text-left">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-violet-600" /> Selected Routine
                  </h4>

                  <div className="space-y-2.5">
                    {EXERCISES.map((ex, idx) => {
                      const isSelected = selectedExIndex === idx
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedExIndex(idx)
                            playBeep(330, 0.1) // E4 note
                          }}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 ${
                            isSelected
                              ? "bg-violet-50/50 border-violet-300 shadow-md scale-[1.01]"
                              : "bg-white border-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${ex.color}`} />
                            <span className={`text-xs font-bold ${isSelected ? "text-slate-800" : "text-slate-500"}`}>
                              {ex.name}
                            </span>
                          </div>
                          <span className={`text-[10px] font-extrabold bg-white border px-3 py-1 rounded-full ${isSelected ? "text-violet-600 border-violet-100" : "text-slate-400 border-slate-100"}`}>
                            {ex.duration}s
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Progress Circle Timer */}
                <div className="md:col-span-6 flex flex-col justify-center items-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* SVG progress ring */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="88"
                        cy="88"
                        r="76"
                        className="stroke-slate-50"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="88"
                        cy="88"
                        r="76"
                        className="stroke-violet-500"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 76}
                        strokeDashoffset={2 * Math.PI * 76 * (1 - progressPercent / 100)}
                        transition={{ ease: "linear", duration: 1 }}
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-slate-800 tabular-nums">
                        {timeLeft}s
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                        Remaining
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-4 mt-6">
                    <button
                      onClick={toggleTimer}
                      className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg hover:shadow-violet-500/30 active:scale-90 transition-all duration-300"
                    >
                      {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-sm active:scale-90 transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
