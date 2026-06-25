import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { LenisProvider } from "@/components/lenis-provider"
import ClickSpark from "@/components/click-spark"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cureathub.com') // Replace with your actual domain when deploying
  ),
  title: "CureAtHub — AI-Powered Diabetes Prevention & Management",
  description:
    "Upload lab reports, scan meals, chat with AI — all in one platform. CureAtHub combines AI analytics, vernacular language support, and personalized lifestyle guidance to help you prevent and manage diabetes effectively.",
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
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "CureAtHub — AI-Powered Diabetes Prevention & Management",
    description:
      "Upload lab reports, scan meals, chat with AI — all in one platform. CureAtHub combines AI analytics, vernacular language support, and personalized lifestyle guidance to help you prevent and manage diabetes effectively.",
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: "CureAtHub Logo" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CureAtHub — AI-Powered Diabetes Prevention & Management",
    description:
      "Upload lab reports, scan meals, chat with AI — all in one platform.",
    images: ["/favicon.png"],
  },
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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ClickSpark sparkColor="#FF5722" sparkCount={10} sparkRadius={24} duration={500}>
          <LenisProvider>{children}</LenisProvider>
        </ClickSpark>
      </body>
    </html>
  )
}
