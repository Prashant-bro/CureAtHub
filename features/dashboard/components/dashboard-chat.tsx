"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Sparkles,
  ArrowRight,
  Menu,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "ai"
  text: string
  timestamp: Date
}

const SUGGESTION_CHIPS = [
  "How many days will it take to get my score down?",
  "What foods should I avoid?",
  "Can you create a meal plan for me?",
  "What exercises are best for me?",
  "How does stress affect diabetes?",
  "What is a healthy BMI range?",
]

const AI_HEALTH_QUESTIONS: { question: string; field: string }[] = [
  { question: "Welcome to Diapredix AI! 👋 I'm here to help assess your diabetes risk. Let me ask you a few quick questions. First, could you tell me your age?", field: "age" },
  { question: "Thank you! And what is your gender? (Male/Female/Other)", field: "gender" },
  { question: "Could you help me with your current weight in kg?", field: "weight" },
  { question: "Great! And what is your height in cm?", field: "height" },
  { question: "Do you know your blood pressure reading? (e.g., 120/80) If not, just type 'skip'.", field: "blood_pressure" },
  { question: "Have you had your cholesterol levels checked recently? If yes, what was the value? Otherwise type 'skip'.", field: "cholesterol" },
  { question: "Do you know your fasting blood glucose level? (mg/dL) Type 'skip' if unsure.", field: "fasting_glucose" },
  { question: "What about your HbA1c percentage? Type 'skip' if you don't know.", field: "hba1c" },
  { question: "Does anyone in your family have diabetes? (Parents, siblings, grandparents)", field: "family_history" },
  { question: "How would you describe your physical activity level? (Sedentary / Lightly Active / Moderately Active / Very Active)", field: "physical_activity" },
  { question: "What's your current diet type? (Vegetarian / Non-Vegetarian / Vegan / Mixed)", field: "diet_type" },
  { question: "Do you smoke? (Yes / No / Occasionally)", field: "smoking" },
  { question: "Do you consume alcohol? (Yes / No / Occasionally)", field: "alcohol" },
]

const AI_RESPONSES: Record<string, string> = {
  "How many days will it take to get my score down?":
    "Based on similar profiles, most users see a 5-10 point improvement in their risk score within 30-60 days of following personalized lifestyle changes. Consistency with diet and exercise is key! 🎯",
  "What foods should I avoid?":
    "For diabetes prevention, try to limit: refined sugars & sweets 🍭, white bread & refined grains, sugary drinks & fruit juices, processed & fried foods, and excessive red meat. Focus on whole grains, leafy greens, and lean proteins instead! 🥗",
  "Can you create a meal plan for me?":
    "I'd love to help! Based on your profile, I recommend a balanced Indian diet plan:\n\n🌅 Breakfast: Moong dal cheela with veggies\n🌞 Lunch: Brown rice, dal, sabzi, salad\n🌇 Snack: Handful of almonds + green tea\n🌙 Dinner: Roti with paneer/chicken, raita\n\nWant me to customize this further?",
  "What exercises are best for me?":
    "Great question! Here's what I recommend:\n\n🚶 30 min brisk walking daily\n🧘 Yoga (especially Surya Namaskar) - 3x/week\n💪 Light strength training - 2x/week\n🚴 Cycling or swimming - 2x/week\n\nStart slow and gradually increase intensity. Even 150 minutes of moderate activity per week makes a big difference!",
  "How does stress affect diabetes?":
    "Stress hormones like cortisol can significantly raise blood sugar levels 📈. Chronic stress may lead to insulin resistance, poor sleep, and emotional eating. Try meditation, deep breathing, or even 10 minutes of quiet time daily to manage stress effectively. 🧘‍♂️",
  "What is a healthy BMI range?":
    "A healthy BMI is typically between 18.5-24.9. For Asian populations, a BMI under 23 is considered optimal for diabetes prevention. Your BMI helps us calculate risk, but it's just one piece of the puzzle! 📊",
}

interface DashboardChatProps {
  onOpenSidebar?: () => void
}

export function DashboardChat({ onOpenSidebar }: DashboardChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [conversationStarted, setConversationStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const startConversation = () => {
    setConversationStarted(true)
    setIsTyping(true)
    setTimeout(() => {
      setMessages([
        {
          id: "ai-0",
          role: "ai",
          text: AI_HEALTH_QUESTIONS[0].question,
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)
      setQuestionIndex(1)
      inputRef.current?.focus()
    }, 800)
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      let aiResponse = ""

      if (AI_RESPONSES[text]) {
        aiResponse = AI_RESPONSES[text]
      } else if (questionIndex < AI_HEALTH_QUESTIONS.length) {
        aiResponse = AI_HEALTH_QUESTIONS[questionIndex].question
        setQuestionIndex((prev) => prev + 1)
      } else {
        aiResponse =
          "Thank you for sharing all that information! 🎉 Based on your responses, I'm analyzing your risk profile. Your personalized health plan is being generated. Check your Profile section for your updated risk score! 💪"
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1000 + Math.random() * 800)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="flex flex-col h-screen w-full relative">
      {onOpenSidebar && (
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-orange-100/30 bg-white/60 backdrop-blur-md shrink-0">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl hover:bg-orange-50 transition-colors animate-fade-in"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <span className="ml-3 text-sm font-bold text-slate-700">AI Chat</span>
        </div>
      )}

      <div className="flex-1 bg-white/60 backdrop-blur-xl overflow-hidden flex flex-col">
        {!conversationStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mb-6"
            >
              <Sparkles className="w-9 h-9 text-orange-500" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl font-bold text-[#0F172A] mb-2"
            >
              Your AI Health Assistant
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-slate-600 max-w-sm mb-8 leading-relaxed"
            >
              I'll ask you a few health questions to assess your diabetes risk and create a personalized plan.
            </motion.p>

            <motion.button
              onClick={startConversation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(255,87,34,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center gap-2"
            >
              Start Health Assessment
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-2"
            >
              <p className="w-full text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Or ask a question
              </p>
              {SUGGESTION_CHIPS.slice(0, 3).map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    startConversation()
                    setTimeout(() => handleSuggestionClick(chip), 1500)
                  }}
                  className="text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 hover:border-orange-200 px-3 py-1.5 rounded-full transition-all"
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md shadow-md shadow-orange-500/15"
                        : "bg-white border border-slate-100 text-slate-700 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1.5 ${
                        msg.role === "user" ? "text-white/50" : "text-slate-300"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start justify-start"
              >
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-slate-300 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {conversationStarted && !isTyping && messages.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-100/50">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSuggestionClick(chip)}
                  className="whitespace-nowrap text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 hover:border-orange-200 px-3 py-1.5 rounded-full transition-all shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {conversationStarted && (
          <div className="p-3 border-t border-slate-100/50 bg-white/40">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(input)
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400"
                disabled={isTyping}
              />
              <motion.button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:shadow-none transition-all"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
