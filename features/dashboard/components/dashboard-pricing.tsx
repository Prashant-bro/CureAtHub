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
    name: "Free Plan",
    price: 0,
    period: "always",
    monthlyEquivalent: 0,
    savingsText: "Basic Health Tracker",
    popular: false,
    color: "border-slate-200 bg-white/70 hover:border-slate-300",
    features: [
      "1 Report scan upload / month",
      "1 Meal scan in 3 days",
      "2 Chat questions / day",
      "Exercise recommendations only"
    ],
    ctaText: "Current Plan",
    disabled: true
  },
  {
    name: "Monthly Plan",
    price: 170,
    period: "month",
    monthlyEquivalent: 170,
    savingsText: "Premium Features",
    popular: false,
    color: "border-slate-200 bg-white/70 hover:border-slate-300",
    features: [
      "3 Report scan uploads / month",
      "2 Meal scans / day",
      "15 Chat questions / day",
      "Diet + exercise planning with timeline timers & alarms"
    ],
    ctaText: "Choose Monthly",
    disabled: false
  },
  {
    name: "6-Months Plan",
    price: 799,
    period: "6 months",
    monthlyEquivalent: 133.2,
    savingsText: "Save 22% (Best Value Choice)",
    popular: true,
    color: "border-orange-500 bg-orange-50/15 shadow-orange-500/5 hover:border-orange-600 shadow-md",
    features: [
      "3 Report scan uploads / month",
      "2 Meal scans / day",
      "15 Chat questions / day",
      "Diet + exercise planning with timeline timers & alarms"
    ],
    ctaText: "Choose 6-Months",
    disabled: false
  },
  {
    name: "Yearly Plan",
    price: 1699,
    period: "year",
    monthlyEquivalent: 141.6,
    savingsText: "Save 17% Overall",
    popular: false,
    color: "border-slate-200 bg-white/70 hover:border-slate-300",
    features: [
      "3 Report scan uploads / month",
      "2 Meal scans / day",
      "15 Chat questions / day",
      "Diet + exercise planning with timeline timers & alarms"
    ],
    ctaText: "Choose Yearly",
    disabled: false
  }
]

export function DashboardPricing() {
  const handleSubscribe = (planName: string, price: number) => {
    if (price === 0) return
    alert(`Subscribed successfully to the ${planName} for ₹${price}!`)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-1.5 bg-orange-100/65 text-orange-600 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Plan Packages
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          Choose Your Plan
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Unlock standard features for free, or upgrade to premium for deep metabolic insights and family scheduling.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
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
                {plan.price > 0 && (
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/35 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Paid
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-black text-[#0F172A]">
                  ₹{plan.price}
                  <span className="text-[11px] font-semibold text-slate-400 lowercase ml-1">
                    {plan.price === 0 ? "" : `/ ${plan.period}`}
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
                whileHover={{ scale: plan.disabled ? 1 : 1.02 }}
                whileTap={{ scale: plan.disabled ? 1 : 0.98 }}
                onClick={() => handleSubscribe(plan.name, plan.price)}
                className={`w-full py-2 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  plan.disabled
                    ? "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-default"
                    : plan.popular
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
                    : "bg-white border border-orange-200/50 hover:bg-orange-50/20 text-orange-600"
                }`}
                disabled={plan.disabled}
              >
                {plan.ctaText}
                {!plan.disabled && <ArrowRight className="w-3 h-3" />}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

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
            <span>Free Tier</span>
            <span>Paid Premium Plan</span>
          </div>

          {[
            {
              name: "Lab Report Uploads (PDF)",
              free: "1 scan upload per month",
              paid: "3 scan uploads per month"
            },
            {
              name: "Meal Scanner (App)",
              free: "1 scan in 3 days",
              paid: "2 scans per day"
            },
            {
              name: "AI Health Chat Questions",
              free: "2 questions per day",
              paid: "15 questions per day"
            },
            {
              name: "Fitness Recommendations",
              free: "Basic exercise recommendations only",
              paid: "Comprehensive Exercise & Diet planning"
            },
            {
              name: "Schedule Timeline Tools",
              free: "Simple static schedule lists",
              paid: "Schedule timeline with built-in exercise alarms, active timers, & interactive exercise helper GIFs"
            },
            {
              name: "Multi-Family Profiles",
              free: "1 primary profile",
              paid: "Add and manage up to 4 profiles"
            }
          ].map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-2.5 border-b border-slate-100/50 text-[11px] hover:bg-orange-50/10 transition-colors rounded-xl px-1.5"
            >
              <span className="font-bold text-[#0F172A]">{row.name}</span>
              
              <div className="flex md:block gap-1.5">
                <span className="md:hidden font-semibold text-slate-400 uppercase text-[8px] tracking-wide w-10 shrink-0">Free:</span>
                <span className="text-slate-500">{row.free}</span>
              </div>
              
              <div className="flex md:block gap-1.5">
                <span className="md:hidden font-semibold text-orange-500 uppercase text-[8px] tracking-wide w-10 shrink-0">Paid:</span>
                <span className="text-orange-600 font-bold">{row.paid}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
