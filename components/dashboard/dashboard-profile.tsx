"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  X,
  Camera,
  Lock
} from "lucide-react"

interface DashboardProfileProps {
  onNavigateToChat: () => void
  profileImage: string | null
  setProfileImage: (img: string | null) => void
}

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
]

export function DashboardProfile({ onNavigateToChat, profileImage, setProfileImage }: DashboardProfileProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [langModalOpen, setLangModalOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      {/* Language Selection Modal */}
      <AnimatePresence>
        {langModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setLangModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-purple-500" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Select Language</h4>
                </div>
                <button
                  onClick={() => setLangModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code)
                      setLangModalOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                      selectedLanguage === lang.code
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-lg">{lang.native}</span>
                    <span className="text-xs text-slate-400">{lang.name}</span>
                    {selectedLanguage === lang.code && (
                      <CheckCircle className="w-4 h-4 text-orange-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-orange-100/50">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-orange-500/25 overflow-hidden">
              {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                "RS"
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={triggerFileInput}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center shadow-sm hover:border-orange-500 transition-colors"
              title="Upload photo"
            >
              <Camera className="w-3.5 h-3.5 text-orange-500" />
            </motion.button>
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">Rahul Sharma</h3>
          <p className="text-sm text-slate-400">@rahul_sharma</p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerFileInput}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-all border border-orange-100/50 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            Upload Profile Photo
          </motion.button>

          <div className="flex items-center gap-1.5 mt-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-600">Verified Account</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          {/* Email */}
          <div className="bg-white/80 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
              <p className="text-sm font-semibold text-[#0F172A] truncate">rahul.sharma@gmail.com</p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white/80 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
              <p className="text-sm font-semibold text-[#0F172A]">+91 98765 43210</p>
            </div>
          </div>

          {/* Language — opens modal */}
          <button
            onClick={() => setLangModalOpen(true)}
            className="w-full bg-white/80 border border-slate-100 rounded-xl p-4 flex items-center gap-3 hover:border-orange-200 hover:bg-orange-50/30 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-semibold text-[#0F172A]">
                  {languages.find(l => l.code === selectedLanguage)?.native}
                </span>
                <span className="text-xs text-slate-400">
                  ({languages.find(l => l.code === selectedLanguage)?.name})
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Change
            </span>
          </button>

          {/* Family Profiles Locked Slots */}
          <div className="bg-white/80 border border-slate-100 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Profiles</span>
              <span className="text-[8px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Premium Option</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold px-1 py-1 bg-orange-50/20 border border-orange-100/30 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">Profile 1: Rahul Sharma (Primary)</span>
              </div>
              
              <div className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                <div className="flex items-center gap-2 text-slate-400/80">
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Profile 2: Locked (Premium Only)</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                <div className="flex items-center gap-2 text-slate-400/80">
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Profile 3: Locked (Premium Only)</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                <div className="flex items-center gap-2 text-slate-400/80">
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Profile 4: Locked (Premium Only)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 space-y-2">
          <motion.button
            onClick={onNavigateToChat}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all"
          >
            Chat with AI Assistant →
          </motion.button>
        </div>
      </div>
    </>
  )
}
