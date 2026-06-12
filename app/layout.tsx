import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { LenisProvider } from "@/components/lenis-provider"
import ClickSpark from "@/components/click-spark"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Diapredix — AI-Powered Diabetes Prevention & Management",
  description:
    "Upload lab reports, scan meals, chat with AI — all in one platform. Diapredix combines AI analytics, vernacular language support, and personalized lifestyle guidance to help you prevent and manage diabetes effectively.",
  keywords: [
    "diabetes prevention",
    "AI health",
    "blood sugar management",
    "lab report analysis",
    "meal scanner",
    "diabetes app India",
    "diabetes lifestyle plan",
    "health AI chatbot",
  ],
}

export const viewport: Viewport = {
  themeColor: "#0D9488",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClickSpark sparkColor="#FF5722" sparkCount={10} sparkRadius={24} duration={500}>
          <LenisProvider>{children}</LenisProvider>
        </ClickSpark>
      </body>
    </html>
  )
}
