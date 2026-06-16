"use client"

import { motion, useInView, Variants } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { Mitig8Logo } from "@/components/mitig8-logo"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, margin: "-100px" })

  const handleSubmit = () => {
    if (!email) return
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  const footerLinks = [
    {
      title: "Platform",
      links: ["AI Report Analysis", "Meal Scanner", "Health Chat", "Diet Coach"],
    },
    {
      title: "Resources",
      links: ["How It Works", "Wellness Modules", "Premium Plans", "API Docs"],
    },
    {
      title: "Company",
      links: ["About Us", "Blog", "Careers", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Data Protection"],
    },
  ]

  return (
    <footer ref={footerRef} className="relative bg-[#0F172A] pt-20 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative mb-16"
        >
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                Stay updated on diabetes health tips
              </h2>
              <p className="text-teal-100/80 text-base mb-8 max-w-lg mx-auto">
                Get expert AI-curated insights on diabetes prevention, nutrition, and wellness delivered to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300"
                  />
                </div>
                <motion.button
                  className="bg-white text-teal-700 px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide whitespace-nowrap relative overflow-hidden shadow-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={handleSubmit}
                >
                  <motion.span
                    animate={isSubmitting ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0 }}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </motion.span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-white/10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-semibold text-white text-sm mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((item) => {
                  let href = "#"
                  if (item === "Privacy Policy") href = "/privacy"
                  else if (item === "Terms of Service") href = "/terms"
                  else if (item === "How It Works") href = "/#how-it-works"
                  else if (item === "Wellness Modules") href = "/#wellness"
                  else if (item === "Premium Plans") href = "/#wellness"
                  return (
                    <li key={item}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Link
                          href={href}
                          className="text-white/50 hover:text-teal-400 text-sm transition-colors inline-block"
                        >
                          {item}
                        </Link>
                      </motion.div>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/">
            <Mitig8Logo size="sm" theme="footer" animated={false} />
          </Link>

          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Mitig8. All rights reserved.
          </p>

          <p className="text-white/25 text-xs">
            Built with care for healthier lives
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[12rem] md:text-[22rem] font-black text-white/[0.015] pointer-events-none select-none leading-none whitespace-nowrap"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        MITIG8
      </motion.div>
    </footer>
  )
}
