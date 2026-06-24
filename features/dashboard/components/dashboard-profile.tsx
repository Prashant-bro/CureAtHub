"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  X,
  Camera,
  Crown,
  Sparkles,
  Upload,
  AlertTriangle,
  Loader2
} from "lucide-react"

interface DashboardProfileProps {
  onNavigateToChat: () => void
  profileImage: string | null
  setProfileImage: (img: string | null) => void
  subscriptionState: "trial" | "expired" | "premium"
  trialDaysLeft: number
  userName?: string
  userEmail?: string
  userInitials?: string
  userPhone?: string
  userAge?: string
  userGender?: string
  userBloodGroup?: string
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

export function DashboardProfile({ 
  onNavigateToChat, 
  profileImage, 
  setProfileImage,
  subscriptionState,
  trialDaysLeft,
  userName = "",
  userEmail = "",
  userInitials = "?",
  userPhone = "",
  userAge = "",
  userGender = "",
  userBloodGroup = "",
}: DashboardProfileProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [langModalOpen, setLangModalOpen] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(e => console.error("Error playing video:", e))
    }
  }, [cameraStream, cameraLoading])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    setShowOptions(false)
    setIsCameraActive(true)
    setCameraLoading(true)
    setCameraError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      })
      streamRef.current = stream
      setCameraStream(stream)
    } catch (err: any) {
      console.error("Camera access error:", err)
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow access in browser settings."
          : "Could not access camera. Make sure no other app is using it."
      )
    } finally {
      setCameraLoading(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraStream(null)
    setIsCameraActive(false)
  }

  const captureSelfie = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current || document.createElement("canvas")
      
      // Determine viewport size & crop square
      const width = video.videoWidth || 640
      const height = video.videoHeight || 480
      const size = Math.min(width, height)
      canvas.width = size
      canvas.height = size
      
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const sx = (width - size) / 2
        const sy = (height - size) / 2
        
        // Mirror draw for selfie natural preview
        ctx.translate(size, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)
        
        const dataUrl = canvas.toDataURL("image/jpeg")
        setProfileImage(dataUrl)
        stopCamera()
      }
    }
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

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowOptions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-5 shadow-2xl w-full max-w-xs text-center space-y-4 border border-orange-100"
            >
              <h4 className="text-sm font-bold text-[#0F172A]">Update Profile Photo</h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={startCamera}
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-orange-50 hover:bg-orange-100/75 text-orange-600 rounded-2xl text-xs font-bold transition-all border border-orange-100/50 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-orange-500" />
                  Take Selfie with Camera
                </button>
                <button
                  onClick={() => {
                    setShowOptions(false)
                    fileInputRef.current?.click()
                  }}
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold transition-all border border-slate-100 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  Choose from Gallery
                </button>
              </div>
              <button
                onClick={() => setShowOptions(false)}
                className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 pt-1"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCameraActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[110] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-5 shadow-2xl w-full max-w-sm flex flex-col items-center space-y-4 border border-orange-100"
            >
              <div className="w-full flex items-center justify-between">
                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase border border-orange-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  Live Camera
                </span>
                <button 
                  onClick={stopCamera}
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Viewport Frame */}
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-orange-100 bg-slate-900 flex items-center justify-center shadow-inner">
                {cameraLoading ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-2.5">
                    <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
                    <p className="text-[10px]">Initializing stream...</p>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center justify-center text-rose-500 p-4 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8" />
                    <p className="text-[11px] font-bold leading-normal">{cameraError}</p>
                    <button 
                      onClick={startCamera}
                      className="bg-orange-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl mt-1.5"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-full pointer-events-none" />
                  </>
                )}
              </div>

              {/* Controls */}
              {!cameraLoading && !cameraError && (
                <div className="flex gap-3 w-full justify-center pt-2">
                  <button
                    onClick={captureSelfie}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Capture Selfie
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        <div className="flex flex-col items-center text-center pb-4 border-b border-orange-100/50">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-orange-500/25 overflow-hidden">
              {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                userInitials
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
              onClick={() => setShowOptions(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center shadow-sm hover:border-orange-500 transition-colors"
              title="Upload photo"
            >
              <Camera className="w-3.5 h-3.5 text-orange-500" />
            </motion.button>
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">{userName || "User"}</h3>
          <p className="text-sm text-slate-400">{userEmail ? `@${userEmail.split("@")[0]}` : ""}</p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOptions(true)}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-all border border-orange-100/50 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            Upload Profile Photo
          </motion.button>

          <div className="flex items-center gap-1.5 mt-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-600">Verified Account</span>
          </div>

          <div className="mt-3 w-full flex justify-center">
            {subscriptionState === "premium" ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl py-1.5 px-4 flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/5">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Premium Member</span>
              </div>
            ) : subscriptionState === "expired" ? (
              <div className="bg-red-50 border border-red-200 rounded-xl py-1.5 px-4 flex items-center justify-center gap-1.5 shadow-sm shadow-red-500/5">
                <X className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="text-[10px] font-black text-red-700 uppercase tracking-wider">Trial Expired</span>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-xl py-1.5 px-4 flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span className="text-[10px] font-black text-orange-700 uppercase tracking-wider">Trial: {trialDaysLeft} Days Left</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white/80 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
              <p className="text-sm font-semibold text-[#0F172A] truncate">{userEmail || "—"}</p>
            </div>
          </div>

          <div className="bg-white/80 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
              <p className="text-sm font-semibold text-[#0F172A]">{userPhone || "Not Provided"}</p>
            </div>
          </div>

          {(userAge || userGender || userBloodGroup) && (
            <div className="bg-white/80 border border-slate-100 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Age</span>
                <span className="font-bold text-[#0F172A]">{userAge ? `${userAge} years` : "—"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Gender</span>
                <span className="font-bold text-[#0F172A] capitalize">{userGender || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Blood Group</span>
                <span className="font-bold text-[#0F172A]">{userBloodGroup || "—"}</span>
              </div>
            </div>
          )}

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

        </div>

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
      <canvas ref={canvasRef} className="hidden" />
    </>
  )
}
