"use client"

import { motion } from "framer-motion"

interface Mitig8LogoProps {
  /** Size variant: 'sm' = 28px, 'md' = 36px (default), 'lg' = 44px */
  size?: "sm" | "md" | "lg"
  /** Color theme for the text */
  theme?: "light" | "dark" | "footer"
  /** Whether to animate on hover */
  animated?: boolean
  /** Additional class names on the wrapper */
  className?: string
  /** Whether to hide brand text */
  hideText?: boolean
}

const sizeMap = {
  sm: { img: 28, textClass: "text-lg" },
  md: { img: 36, textClass: "text-xl" },
  lg: { img: 44, textClass: "text-2xl" },
}

export function Mitig8Logo({
  size = "md",
  theme = "dark",
  animated = true,
  className = "",
  hideText = false,
}: Mitig8LogoProps) {
  const { img, textClass } = sizeMap[size]

  const textColors = {
    dark: { main: "text-[#0F172A]", accent: "text-orange-500" },
    light: { main: "text-white", accent: "text-orange-300" },
    footer: { main: "text-white", accent: "text-teal-400" },
  }

  const colors = textColors[theme]

  const Wrapper = animated ? motion.div : "div"
  const wrapperProps = animated
    ? {
        whileHover: { scale: 1.03 },
        transition: { type: "spring" as const, stiffness: 400, damping: 17 },
      }
    : {}

  return (
    <Wrapper
      className={`flex items-center gap-2 ${className}`}
      {...wrapperProps}
    >
      {/* Logo image — plain img to avoid Next.js restrictions */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cureathub-logo.jpg"
        alt="CureAtHub"
        style={{
          width: img,
          height: img,
          objectFit: "cover",
          borderRadius: 8,
          flexShrink: 0,
          display: "block",
        }}
      />

      {/* Brand text */}
      {!hideText && (
        <span className={`${textClass} font-bold tracking-tight`}>
          <span className={colors.main}>CureAt</span>
          <span className={colors.accent}>Hub</span>
        </span>
      )}
    </Wrapper>
  )
}
