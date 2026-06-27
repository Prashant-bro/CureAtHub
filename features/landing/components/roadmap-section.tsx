"use client"

import React, { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import Image from "next/image"

export function RoadmapSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  const scaleY = useSpring(scrollYProgress, { stiffness: 180, damping: 12, restDelta: 0.001 })

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
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left group hover:shadow-2xl transition-all duration-300">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase">
                      IoT Sync Preview
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2">Continuous Glucose Monitors</h4>
                    <p className="text-[11px] text-slate-400">Sync with devices to pull real-time glucose and activity streams.</p>
                  </div>

                  <div className="relative mt-4 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                    <Image
                      src="/images/wearable_integration.png"
                      alt="Wearable integration graphic"
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
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
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left group hover:shadow-2xl transition-all duration-300">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md uppercase">
                      ML Sugar Alerts
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2">Active Crash Predictions</h4>
                    <p className="text-[11px] text-slate-400">Models physical exercises and insulin targets to prevent spikes.</p>
                  </div>

                  <div className="relative mt-4 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                    <Image
                      src="/images/predictive_alerts.png"
                      alt="Predictive alert graphic"
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
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
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left group hover:shadow-2xl transition-all duration-300">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                      Lab Bookings
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2">Home Collection Booking</h4>
                    <p className="text-[11px] text-slate-400">Direct bookings for diagnostic HbA1c collections.</p>
                  </div>

                  <div className="relative mt-4 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                    <Image
                      src="/images/diagnostic_labs.png"
                      alt="Diagnostic labs graphic"
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
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
                <div className="bg-white border border-[#F0E6D9] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between text-left group hover:shadow-2xl transition-all duration-300">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase">
                      Diet Food Delivery
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-2">Low-Glycemic Meal Boxes</h4>
                    <p className="text-[11px] text-slate-400">Fresh dietitian-approved meals delivered daily to your home.</p>
                  </div>

                  <div className="relative mt-4 aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-white">
                    <Image
                      src="/images/diabetic_delivery.png"
                      alt="Food delivery graphic"
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
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
