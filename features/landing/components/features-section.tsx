"use client"

import React, { useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  FileText,
  Camera,
  Bot,
  Utensils,
  Globe,
} from "lucide-react"

const bounceInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
      mass: 0.7,
    },
  },
}

const bounceInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
      mass: 0.7,
    },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

export function FeaturesSection() {
  const sectionContainerRef = useRef(null)

  return (
    <section id="features" ref={sectionContainerRef} className="py-24 bg-gradient-to-b from-[#FDF6EE] via-white to-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C4A882 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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

        <div className="space-y-16 lg:space-y-24">
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
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase">
                    Report Analyzer Preview
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Report Parsing Visualization</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Witness the automated AI breakdown and parsing mechanism in action.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/ai_report_analysis.png"
                    alt="Report analysis illustration"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
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
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase">
                    Plate Scanner Preview
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">AI Meal Scanner</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Snap a photo of your plate to detect carbs and glycemic load index.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/ai_meal_scanner.png"
                    alt="AI Plate Scanner Simulation"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
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
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md uppercase">
                    Assistant Spark
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">AI Health Chat</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Conversational companion answering queries on blood sugar and lifestyle recommendations.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/ai_health_chat.png"
                    alt="AI Health Chat Screen Illustration"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
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
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                    Lifestyle Assistant
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Daily Wellness Blueprint</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Personalized daily menus and metabolic workout tasks.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/diet_lifestyle_coach.png"
                    alt="Diet and lifestyle coach graphic"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
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
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase">
                    Language Localization
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Regional Interface Preview</h4>
                  <p className="text-[11px] text-slate-400 max-w-[280px]">Select a language to see real-time app localization in action.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/indian_languages.png"
                    alt="Indian languages visual graphic"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
