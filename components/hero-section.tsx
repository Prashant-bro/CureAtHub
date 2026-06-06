"use client"

import { motion, useScroll, useTransform, useSpring, Variants, useMotionValue } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import {
  FileText,
  Languages,
  MessageCircle,
  Shield,
} from "lucide-react"

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
}

export function HeroSection() {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateXSpring = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 150, damping: 20 })
  const rotateYSpring = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXVal = e.clientX - rect.left - width / 2
    const mouseYVal = e.clientY - rect.top - height / 2
    mouseX.set(mouseXVal)
    mouseY.set(mouseYVal)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y = useSpring(rawY, springConfig)

  const rawScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const scale = useSpring(rawScale, springConfig)

  const rawOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const opacity = useSpring(rawOpacity, springConfig)

  const trustBadges = [
    { icon: Shield, label: "AI Powered", color: "text-orange-600 bg-orange-50 border-orange-100" },
    { icon: Languages, label: "8+ Languages", color: "text-blue-600 bg-blue-50 border-blue-100" },
  ]

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FDF6EE]"
    >
      {/* Decorative blobs */}
      <motion.div
        className="absolute top-20 -left-20 w-72 h-72 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(255,87,34,0.08) 0%, transparent 70%)" }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 -right-20 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(255,87,34,0.06) 0%, transparent 70%)" }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, rgba(100,116,139,0.1) 0%, transparent 70%)" }}
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -15, 10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div style={{ opacity }} className="space-y-6">
            {/* Badge */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium text-slate-600"
            >
              <motion.span
                className="w-2 h-2 bg-orange-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              AI-Powered Diabetes Prevention
            </motion.div>

            {/* Heading */}
            <div className="space-y-2">
              <motion.h1
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={1}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] leading-[1.1]"
              >
                Your AI Health Companion for{" "}
                <span className="text-gradient">Diabetes Prevention</span>
              </motion.h1>
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-lg text-slate-500 max-w-lg leading-relaxed pt-2"
              >
                Upload lab reports, scan meals, chat with AI — all in one app.
                Available in 8+ Indian languages.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-4 pt-2"
            >
              <motion.button
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide flex items-center gap-2 relative overflow-hidden shadow-xl shadow-orange-500/25"
                whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(255,87,34,0.35)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Start Free Assessment</span>
                <motion.svg
                  className="w-4 h-4 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap gap-4 pt-4"
            >
              {trustBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  className={`flex items-center gap-2.5 text-xs font-semibold px-4 py-2 rounded-full border ${badge.color} shadow-sm`}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <badge.icon className="w-4 h-4" strokeWidth={2.5} />
                  <span>{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div style={{ y, scale }} className="relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
              className="relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
            >
              {/* Glow behind image */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-40"
                style={{ background: "radial-gradient(circle at center, rgba(255,87,34,0.15) 0%, transparent 70%)" }}
                animate={{
                  scale: [0.9, 1.05, 0.9],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/hero-dashboard.png"
                  alt="Diapredix AI Health Dashboard"
                  width={520}
                  height={520}
                  className="relative z-10 drop-shadow-xl rounded-2xl"
                  priority
                />
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-9 border-2 border-orange-300/50 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-2.5 bg-orange-400/60 rounded-full"
              animate={{ y: [0, 6, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
