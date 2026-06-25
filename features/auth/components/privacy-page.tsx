"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Mitig8Logo } from "@/components/mitig8-logo"

const sections = [
  {
    title: "1. Introduction",
    content: `At CureAtHub, we believe that your personal and health information belongs to you. This Privacy Policy explains how we collect, use, store, and protect the information you provide when using our platform. We are committed to handling your data with care, transparency, and respect. By using CureAtHub, you agree to the practices described in this policy.`,
  },
  {
    title: "2. Information We Collect",
    content: `We collect information that you provide directly to us, such as your name, email address, mobile number, and any health-related data you choose to enter into the platform. We also collect information automatically when you use the service, including your device type, browser type, IP address, pages visited, and the time and date of your activity. When you use third-party sign-in options such as Google, we may receive basic profile information from that provider in accordance with the permissions you grant.`,
  },
  {
    title: "3. Health Data We Handle",
    content: `CureAtHub processes sensitive health information including but not limited to glucose readings, activity levels, dietary data, and other metrics you enter into the platform. This data is treated with the highest level of care. We process your health information only for the purpose of providing you with insights and features within the platform. We do not sell, rent, or trade your health data to any third party. Health data is encrypted both in transit and at rest using industry-standard protocols.`,
  },
  {
    title: "4. How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve the CureAtHub service. This includes personalizing your experience, generating health insights, sending you relevant notifications, responding to your support requests, and conducting internal analysis to improve the platform. We may also use your contact information to send you important service-related communications, such as updates to these policies or changes to your account.`,
  },
  {
    title: "5. Sharing of Information",
    content: `We do not sell your personal or health information to third parties. We may share your information with trusted service providers who assist us in operating the platform, such as cloud hosting providers and analytics services, under strict confidentiality agreements. We may also disclose your information when required by law, court order, or government authority, or when we believe disclosure is necessary to protect the safety of our users or the public. In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction, and you will be notified in advance.`,
  },
  {
    title: "6. Cookies and Tracking Technologies",
    content: `CureAtHub uses cookies and similar technologies to enhance your experience on the platform. Cookies help us remember your preferences, keep you signed in, and understand how you interact with the service. You can control cookie settings through your browser, though disabling certain cookies may affect the functionality of the platform. We do not use cookies to serve third-party advertisements.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your personal information for as long as your account is active or as long as necessary to provide you with the service. If you choose to delete your account, we will remove your personal and health data from our active systems within 30 days. However, some information may be retained in our backup systems for a limited period in accordance with legal and regulatory requirements. Anonymized and aggregated data, which cannot identify you personally, may be retained indefinitely for research and service improvement purposes.`,
  },
  {
    title: "8. Your Rights and Choices",
    content: `You have the right to access the personal information we hold about you and to request corrections if it is inaccurate. You may request the deletion of your account and associated data at any time by contacting our support team. You have the right to withdraw consent for processing your health data, though this may limit your ability to use certain features of the platform. If you are located in a jurisdiction with data protection regulations such as GDPR or applicable Indian data protection law, you may have additional rights. We will respond to all verified requests within a reasonable time.`,
  },
  {
    title: "9. Security of Your Data",
    content: `We take the security of your information seriously. CureAtHub uses encryption, access controls, regular security audits, and secure data storage practices to protect your personal and health information from unauthorized access, disclosure, alteration, or destruction. While we implement strong security measures, no system can guarantee absolute security. You are responsible for keeping your account credentials confidential and for notifying us immediately if you suspect unauthorized access.`,
  },
  {
    title: "10. Children's Privacy",
    content: `CureAtHub is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us immediately. We will take steps to remove such information from our systems promptly.`,
  },
  {
    title: "11. Third-Party Links and Integrations",
    content: `The CureAtHub platform may contain links to third-party websites or integrations with third-party services. This Privacy Policy applies only to CureAtHub and does not govern the privacy practices of any third-party services you may access through our platform. We encourage you to review the privacy policies of any third-party services before providing them with your personal information.`,
  },
  {
    title: "12. Changes to This Privacy Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or platform features. When we make material changes, we will notify you through the platform or via the email address associated with your account. We encourage you to review this policy periodically. Your continued use of the service after changes have been made indicates your acceptance of the updated policy.`,
  },
  {
    title: "13. Contact and Grievances",
    content: `If you have any questions about this Privacy Policy, wish to exercise your data rights, or have a concern about how your information is handled, please contact our data protection team at privacy@cureathub.com. We are committed to resolving your concerns and will respond to all inquiries within 5 business days. If you are not satisfied with our response, you may have the right to lodge a complaint with the relevant data protection authority in your jurisdiction.`,
  },
]

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDF6EE] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #C4A882 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <Mitig8Logo size="lg" theme="dark" animated={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 18 }}
          className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-orange-500/[0.06] p-8 md:p-12"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#0F172A] mb-3">Privacy Policy</h1>
            <p className="text-sm text-slate-500">
              Last updated: June 12, 2025
            </p>
            <div className="mt-5 p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-sm text-slate-600 leading-relaxed">
                Your privacy is important to us. This Privacy Policy describes how CureAtHub collects, uses, and
                safeguards your personal and health information. We encourage you to read it carefully so you understand
                how we handle your data and what choices you have.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.04 }}
              >
                <h2 className="text-base font-bold text-[#0F172A] mb-2">{section.title}</h2>
                <p className="text-sm text-slate-600 leading-7">{section.content}</p>
                {index < sections.length - 1 && (
                  <div className="mt-8 h-px bg-slate-100" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              This policy was last reviewed and updated on June 12, 2025.
            </p>
            <Link
              href="/terms"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors hover:underline"
            >
              Read Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
