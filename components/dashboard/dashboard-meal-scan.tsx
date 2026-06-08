"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Camera,
  Smartphone,
  Sparkles,
  ScanLine,
  Apple,
} from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
}

export function DashboardMealScan() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-sm"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-orange-50/80 to-transparent" />
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-orange-500/5 blur-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 p-8 sm:p-10 text-center">
          {/* Scan Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-dashed border-orange-200"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner container */}
            <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-orange-400" />
            </div>
            {/* Scan line */}
            <motion.div
              className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"
              animate={{ top: ["15%", "85%", "15%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-orange-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-orange-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-orange-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-orange-400 rounded-br-lg" />

            {/* Sparkle badges */}
            <motion.div
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
              AI Meal Scanner
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-1">
              Snap a photo of your meal and our AI will instantly analyze calories, macros, and diabetes impact.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="flex flex-wrap justify-center gap-2 my-6"
          >
            {[
              { icon: ScanLine, label: "Instant Analysis" },
              { icon: Sparkles, label: "AI Powered" },
              { icon: Apple, label: "Nutrition Data" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-600 text-[11px] font-semibold px-3 py-1.5 rounded-full"
              >
                <feature.icon className="w-3 h-3" />
                {feature.label}
              </div>
            ))}
          </motion.div>

          {/* Download CTA Section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="bg-gradient-to-br from-[#0F172A] to-[#1a2744] rounded-2xl p-6 mt-4"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-orange-400" />
              <span className="text-white font-bold text-sm">Download Our App</span>
            </div>
            <p className="text-white/50 text-xs mb-5 max-w-xs mx-auto">
              The AI Meal Scanner feature is available exclusively on our mobile app. Download now to get started!
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 transition-all"
              >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <p className="text-white/50 text-[9px] leading-none">Download on the</p>
                  <p className="text-white font-bold text-sm leading-tight">App Store</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 transition-all"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302-2.725-2.302 2.725-2.302zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                <div className="text-left">
                  <p className="text-white/50 text-[9px] leading-none">Get it on</p>
                  <p className="text-white font-bold text-sm leading-tight">Google Play</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
