"use client"

import React, { useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Flower2,
  Bell,
  Trophy,
  Crown,
} from "lucide-react"

const bounceInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20, mass: 0.7 },
  },
}

const bounceInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20, mass: 0.7 },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

export function WellnessSection() {
  const sectionRef = useRef(null)

  return (
    <section
      id="wellness"
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white via-[#FFFBF7] to-[#FFFBF7] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C4A882 1px, transparent 0)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full mb-4">
            Wellness Suite
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Designed for <span className="text-gradient">holistic glucose management</span>
          </h2>
          <p className="text-slate-500 text-lg mt-4 leading-relaxed">
            Support your metabolic health through natural lifestyle shifts, habit tracking, and clinical synchronization.
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
              <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                    Active Modules
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-3">Yoga & Diet Modules</h4>
                  <p className="text-[11px] text-slate-400">Natural glucose alignment routines customized for daily health.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/yoga_diet_modules.png"
                    alt="Yoga & Diet illustration"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
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
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase">
                    Scheduler Preview
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Active Timers Monitoring</h4>
                  <p className="text-[11px] text-slate-400">Automated reminders for fasting windows, meals, and medication times.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/smart_reminders.png"
                    alt="Reminders illustration"
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
              <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase">
                    Ecosystem Arena
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">Streaks & Group Feeds</h4>
                  <p className="text-[11px] text-slate-400">Log habits to increment your streak score and view community status posts.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/gamification_community.png"
                    alt="Gamification illustration"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
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
              <div className="bg-slate-50 border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md uppercase">
                    Premium Subscription
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-3">Pricing Calculator</h4>
                  <p className="text-[11px] text-slate-400">Choose between flexible pricing models with advanced health analytics.</p>
                </div>

                <div className="relative mt-6 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                  <Image
                    src="/images/premium_plan.png"
                    alt="Premium plan illustration"
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
