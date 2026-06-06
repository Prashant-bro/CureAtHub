"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { UserPlus, Upload, Brain } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign Up",
    description:
      "Quick OTP-based sign up to instantly unlock your personal health portal.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    dotColor: "bg-orange-500",
    shadow: "shadow-orange-500/10",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload & Scan",
    description:
      "Upload your lab report PDFs or snap meal photos to extract details and estimate carbs.",
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    dotColor: "bg-teal-500",
    shadow: "shadow-teal-500/10",
  },
  {
    number: "03",
    icon: Brain,
    title: "Access AI Health Tools",
    description:
      "Get access to your customized diet & yoga schedules, exercise timers, and AI health chat.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    dotColor: "bg-violet-500",
    shadow: "shadow-violet-500/10",
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-24 relative overflow-hidden bg-[#FFFBF7]"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.span
            className="inline-block text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Get started in{" "}
            <span className="text-gradient">three simple steps</span>
          </h2>
          <p className="text-slate-500 text-lg mt-4 leading-relaxed">
            From sign-up to personalized AI insights — your journey to better health takes minutes, not hours.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[17%] right-[17%] h-[3px]">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 via-teal-400 to-violet-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </div>
 
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.3 + index * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="relative text-center group"
            >
              {/* Step number circle */}
              <motion.div
                className="relative mx-auto mb-8"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-xl ${step.shadow} relative z-10`}
                >
                  <step.icon className="w-9 h-9 text-white" strokeWidth={1.8} />
                </div>
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} mx-auto opacity-30 blur-xl`}
                  animate={isInView ? { scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                />
                {/* Step number badge */}
                <div
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${step.dotColor} text-white text-xs font-extrabold flex items-center justify-center shadow-md z-20`}
                >
                  {step.number}
                </div>
              </motion.div>
 
              {/* Content */}
              <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
