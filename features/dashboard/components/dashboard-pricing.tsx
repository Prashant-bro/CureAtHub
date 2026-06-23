"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  CheckCircle,
  Sparkles,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
}

const PRICING_PLANS = [
  {
    name: "Monthly Plan",
    price: 170,
    period: "month",
    monthlyEquivalent: 170,
    savingsText: "Premium Features (3 Days Free)",
    popular: false,
    color: "border-slate-200 bg-white/70 hover:border-slate-300",
    features: [
      "Unlimited Report scan uploads",
      "Unlimited Meal scans",
      "Unlimited AI Chat questions",
      "Diet + exercise planning with timeline timers & alarms"
    ],
    ctaText: "Start 3-Day Free Trial",
    disabled: false
  },
  {
    name: "6-Months Plan",
    price: 799,
    period: "6 months",
    monthlyEquivalent: 133.2,
    savingsText: "Save 22% (3 Days Free)",
    popular: true,
    color: "border-orange-500 bg-orange-50/15 shadow-orange-500/5 hover:border-orange-600 shadow-md",
    features: [
      "Unlimited Report scan uploads",
      "Unlimited Meal scans",
      "Unlimited AI Chat questions",
      "Diet + exercise planning with timeline timers & alarms"
    ],
    ctaText: "Start 3-Day Free Trial",
    disabled: false
  },
  {
    name: "Yearly Plan",
    price: 1699,
    period: "year",
    monthlyEquivalent: 141.6,
    savingsText: "Save 17% (3 Days Free)",
    popular: false,
    color: "border-slate-200 bg-white/70 hover:border-slate-300",
    features: [
      "Unlimited Report scan uploads",
      "Unlimited Meal scans",
      "Unlimited AI Chat questions",
      "Diet + exercise planning with timeline timers & alarms"
    ],
    ctaText: "Start 3-Day Free Trial",
    disabled: false
  }
]

interface DashboardPricingProps {
  subscriptionState: "trial" | "expired" | "premium"
  onSubscribe: (planName: string, price: number) => void
}

export function DashboardPricing({ subscriptionState, onSubscribe }: DashboardPricingProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-1.5 bg-orange-100/65 text-orange-600 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          3-Day Free Trial
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          Try Premium Free for 3 Days
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Enjoy unlimited access to all features free for 3 days. Choose a plan to start your trial; billing begins only after 3 days if you choose to continue.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
        {PRICING_PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
            className={`border rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 relative ${plan.color}`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest text-white bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 rounded-full uppercase shadow-md shadow-orange-500/20">
                Best Value
              </span>
            )}

            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{plan.name}</span>
                <span className="text-[8px] font-bold text-orange-600 bg-orange-100 border border-orange-200/35 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  3-Day Trial
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-black text-[#0F172A]">
                  ₹{plan.price}
                  <span className="text-[11px] font-semibold text-slate-400 lowercase ml-1">
                    / {plan.period}
                  </span>
                </h3>
                {plan.savingsText && (
                  <p className="text-[9px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {plan.savingsText}
                  </p>
                )}
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-2.5 mt-3 text-center">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">Monthly Breakdown</span>
                <p className="text-sm font-extrabold text-[#0F172A] mt-0.5">₹{plan.monthlyEquivalent} <span className="text-[9px] font-normal text-slate-400">/ mo</span></p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="border-t border-slate-100 pt-3 text-left">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Key Features</p>
                <div className="space-y-2">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start text-[11px] text-slate-600 leading-normal">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSubscribe(plan.name, plan.price)}
                className={`w-full py-2 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  plan.popular
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
                    : "bg-white border border-orange-200/50 hover:bg-orange-50/20 text-orange-600"
                }`}
              >
                {subscriptionState === "expired" ? "Subscribe Now" : plan.ctaText}
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={4}
        className="bg-white/70 border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-5 h-5 text-orange-500" />
          <h4 className="text-sm font-bold text-[#0F172A]">How your Free Trial works</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="flex gap-4 items-start relative z-10">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-orange-500/20">
              1
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Day 1: Start Trial</h5>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Choose a plan and start your 3-day trial. Instant access to all Premium health insights, AI chat, and diet planning tools.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start relative z-10">
            <div className="w-10 h-10 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-orange-400/20">
              2
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Day 2: Trial Reminder</h5>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                We'll notify you that your free trial is ending in 1 day. Cancel anytime via settings if you don't wish to continue.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start relative z-10">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-orange-600/20">
              3
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Day 4: Paid Term Starts</h5>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                If you choose to continue, your subscription begins. If not, your access is suspended with no charge.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="bg-white/70 border border-white/60 rounded-3xl p-5 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-5 h-5 text-orange-500" />
          <h4 className="text-sm font-bold text-[#0F172A]">Detailed Feature Comparison</h4>
        </div>

        <div className="space-y-2">
          <div className="hidden md:grid grid-cols-3 gap-4 pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/50">
            <span>Feature Name</span>
            <span>During 3-Day Trial</span>
            <span>After Trial (No Subscription)</span>
          </div>

          {[
            {
              name: "Lab Report Uploads (PDF)",
              trial: "Unlimited uploads",
              after: "No Access"
            },
            {
              name: "Meal Scanner (App)",
              trial: "Unlimited scans",
              after: "No Access"
            },
            {
              name: "AI Health Chat Questions",
              trial: "Unlimited questions",
              after: "No Access"
            },
            {
              name: "Fitness & Diet Recommendations",
              trial: "Full customized exercise & diet plans",
              after: "No Access"
            },
            {
              name: "Schedule Timeline Tools",
              trial: "Alarms, timers & helper GIFs",
              after: "No Access"
            }
          ].map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-2.5 border-b border-slate-100/50 text-[11px] hover:bg-orange-50/10 transition-colors rounded-xl px-1.5"
            >
              <span className="font-bold text-[#0F172A]">{row.name}</span>
              
              <div className="flex md:block gap-1.5">
                <span className="md:hidden font-semibold text-orange-500 uppercase text-[8px] tracking-wide w-32 shrink-0">3-Day Trial:</span>
                <span className="text-[#0f172a] font-semibold">{row.trial}</span>
              </div>
              
              <div className="flex md:block gap-1.5">
                <span className="md:hidden font-semibold text-slate-400 uppercase text-[8px] tracking-wide w-32 shrink-0">After Trial:</span>
                <span className="text-red-500 font-bold">{row.after}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
