"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Dumbbell,
  Salad,
  Clock,
  TrendingUp,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
}

export function DashboardDiet() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-xl font-bold text-[#0F172A]">Diet & Exercise</h3>
          <p className="text-sm text-slate-400 mt-0.5">Track your meals and workouts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(255,87,34,0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Salad className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Diet Plans</h4>
              <p className="text-[11px] text-slate-400">Meal tracking & nutrition</p>
            </div>
          </div>
          <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <Salad className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-400">Coming Soon</p>
            <p className="text-[10px] text-slate-300 mt-1">Features will be added here</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dumbbell className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Exercise Plans</h4>
              <p className="text-[11px] text-slate-400">Workout routines & tracking</p>
            </div>
          </div>
          <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <Dumbbell className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-400">Coming Soon</p>
            <p className="text-[10px] text-slate-300 mt-1">Features will be added here</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Schedule</h4>
              <p className="text-[11px] text-slate-400">Daily meal & workout timing</p>
            </div>
          </div>
          <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <Clock className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-400">Coming Soon</p>
            <p className="text-[10px] text-slate-300 mt-1">Features will be added here</p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Progress</h4>
              <p className="text-[11px] text-slate-400">Track your journey</p>
            </div>
          </div>
          <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-400">Coming Soon</p>
            <p className="text-[10px] text-slate-300 mt-1">Features will be added here</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
