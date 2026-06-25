"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Camera,
  Sparkles,
  ScanLine,
  Apple,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Loader2,
  RefreshCw,
  Plus
} from "lucide-react"

interface FoodItem {
  id: string
  name: string
  glycemicIndex: "High" | "Medium" | "Low"
  giValue: number
  calories: number
  carbs: string
  protein: string
  fat: string
  alternative?: string
}

const INDIAN_FOODS: FoodItem[] = [
  { id: "samosa", name: "Samosa (1 pc)", glycemicIndex: "High", giValue: 80, calories: 262, carbs: "32g", protein: "3.5g", fat: "13g", alternative: "Oats Upma" },
  { id: "gulab_jamun", name: "Gulab Jamun (2 pcs)", glycemicIndex: "High", giValue: 85, calories: 300, carbs: "48g", protein: "4g", fat: "10g", alternative: "Paneer Tikka" },
  { id: "rice_dal", name: "White Rice & Dal", glycemicIndex: "Medium", giValue: 68, calories: 380, carbs: "55g", protein: "12g", fat: "4g", alternative: "Quinoa or Millets" },
  { id: "oats_upma", name: "Oats Upma", glycemicIndex: "Low", giValue: 50, calories: 190, carbs: "26g", protein: "6g", fat: "5g" },
  { id: "salad", name: "Green Salad Bowl", glycemicIndex: "Low", giValue: 20, calories: 75, carbs: "12g", protein: "2g", fat: "1.5g" },
  { id: "paneer_tikka", name: "Paneer Tikka (4 blocks)", glycemicIndex: "Low", giValue: 25, calories: 240, carbs: "8g", protein: "18g", fat: "16g" },
]

export function DashboardMealScan() {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [scanState, setScanState] = useState<"idle" | "camera" | "scanning" | "alert" | "success">("idle")
  const [scanProgress, setScanProgress] = useState(0)
  const [userRiskProfile, setUserRiskProfile] = useState<any>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [isCameraLoading, setIsCameraLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(e => console.error("Error playing video:", e))
    }
  }, [cameraStream, isCameraLoading])

  const loadRiskProfile = () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mitig8_analyzed_report")
        if (saved) {
          setUserRiskProfile(JSON.parse(saved))
        } else {
          // Fetch from Supabase via API
          fetch("/api/assessments")
            .then((res) => {
              if (res.ok) return res.json()
              throw new Error("Failed to fetch assessment")
            })
            .then((data) => {
              if (data && data.assessment) {
                const report = {
                  riskScore: data.assessment.risk_score,
                  riskClass: data.assessment.risk_class,
                  riskColor: data.assessment.risk_color,
                  summary: data.assessment.summary,
                  biomarkers: data.assessment.biomarkers || [],
                  dietAdvice: data.assessment.features?.dietAdvice || [],
                  exerciseAdvice: data.assessment.features?.exerciseAdvice || [],
                }
                setUserRiskProfile(report)
                localStorage.setItem("mitig8_analyzed_report", JSON.stringify(report))
              }
            })
            .catch((err) => {
              console.error("Failed to load assessment from API in meal scan:", err)
            })
        }
      } catch (e) {
        // silent catch
      }
    }
  }

  useEffect(() => {
    loadRiskProfile()
    window.addEventListener("mitig8_report_updated", loadRiskProfile)
    return () => {
      window.removeEventListener("mitig8_report_updated", loadRiskProfile)
      // Clean up camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])


  const startCamera = async () => {
    setIsCameraLoading(true)
    setCameraError(null)
    setScanState("camera")
    setCapturedPhoto(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
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
      setIsCameraLoading(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraStream(null)
    setScanState("idle")
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current || document.createElement("canvas")
      const width = video.videoWidth || 640
      const height = video.videoHeight || 480
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height)
        const dataUrl = canvas.toDataURL("image/jpeg")
        setCapturedPhoto(dataUrl)
        
        // Stop the camera stream immediately
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
        setCameraStream(null)
        
        // Mock dynamic food detection by choosing an item
        const randomFood = INDIAN_FOODS[Math.floor(Math.random() * INDIAN_FOODS.length)]
        setSelectedFood(randomFood)
        
        setScanState("scanning")
        setScanProgress(0)

        let progress = 0
        const interval = setInterval(() => {
          progress += 20
          setScanProgress(progress)
          if (progress >= 100) {
            clearInterval(interval)
            const riskClass = userRiskProfile?.riskClass || "Low Risk"
            const isDangerous = (randomFood.glycemicIndex === "High" || randomFood.glycemicIndex === "Medium") && (riskClass === "High Risk" || riskClass === "Moderate Risk")
            
            if (isDangerous) {
              setScanState("alert")
            } else {
              setScanState("success")
              logMealDirectly(randomFood)
            }
          }
        }, 400)
      }
    }
  }

  const startScan = (food: FoodItem) => {
    // If starting manual scan, stop camera if active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraStream(null)
    setCapturedPhoto(null)
    setSelectedFood(food)
    setScanState("scanning")
    setScanProgress(0)

    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      setScanProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        // Evaluate based on patient risk
        const riskClass = userRiskProfile?.riskClass || "Low Risk"
        const isDangerous = (food.glycemicIndex === "High" || food.glycemicIndex === "Medium") && (riskClass === "High Risk" || riskClass === "Moderate Risk")
        
        if (isDangerous) {
          setScanState("alert")
        } else {
          setScanState("success")
          logMealDirectly(food)
        }
      }
    }, 400)
  }

  const logMealDirectly = (food: FoodItem) => {
    if (typeof window !== "undefined") {
      // 1. Log calories
      const currentCalories = Number(localStorage.getItem("mitig8_calories")) || 0
      localStorage.setItem("mitig8_calories", String(currentCalories + food.calories))

      // Post meal to Supabase
      fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          food_name: food.name,
          calories: food.calories,
          protein: parseFloat(food.protein) || 0,
          carbs: parseFloat(food.carbs) || 0,
          fat: parseFloat(food.fat) || 0,
          fiber: 0,
          diabetes_friendly: food.glycemicIndex === "Low",
        }),
      }).catch((err) => {
        console.error("Failed to post meal log to API:", err)
      })

      // 2. Adjust Risk Score based on glycemic index of eaten food
      if (userRiskProfile) {
        let scoreChange = 0
        if (food.glycemicIndex === "High") scoreChange = 3
        else if (food.glycemicIndex === "Medium") scoreChange = 1
        else if (food.glycemicIndex === "Low") scoreChange = -2

        const newScore = Math.max(0, Math.min(100, userRiskProfile.riskScore + scoreChange))
        let newClass = userRiskProfile.riskClass
        let newColor = userRiskProfile.riskColor
        let newSummary = userRiskProfile.summary

        if (newScore >= 70) {
          newClass = "High Risk"
          newColor = "from-red-500 to-rose-600 text-rose-600 bg-rose-50 border-rose-100"
          newSummary = "Biomarker analysis indicates high metabolic diabetes risk indicators. Direct lifestyle changes and medical consultation are recommended."
        } else if (newScore >= 40) {
          newClass = "Moderate Risk"
          newColor = "from-amber-400 to-orange-500 text-orange-600 bg-orange-50 border-orange-100"
          newSummary = "Your biomarkers indicate borderline pre-diabetic ranges. Targeted nutritional habits can effectively reverse this risk profile."
        } else {
          newClass = "Low Risk"
          newColor = "from-emerald-400 to-teal-500 text-emerald-600 bg-emerald-50 border-emerald-100"
          newSummary = "All clinical biomarkers fall well within optimal reference intervals. Continue maintaining your excellent health parameters."
        }

        const updatedProfile = {
          ...userRiskProfile,
          riskScore: newScore,
          riskClass: newClass,
          riskColor: newColor,
          summary: newSummary
        }

        localStorage.setItem("mitig8_analyzed_report", JSON.stringify(updatedProfile))
        window.dispatchEvent(new Event("mitig8_report_updated"))

        // Save adjusted assessment to Supabase
        fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            riskScore: newScore,
            riskClass: newClass,
            riskColor: newColor,
            summary: newSummary,
            features: updatedProfile.features || null,
            biomarkers: updatedProfile.biomarkers || null,
          }),
        }).catch((err) => {
          console.error("Failed to save adjusted risk assessment to API:", err)
        })
      }
    }
  }


  const handleAlternativeRecommend = () => {
    if (!selectedFood || !selectedFood.alternative) return
    const altFoodName = selectedFood.alternative
    const altFoodItem = INDIAN_FOODS.find(f => f.name.toLowerCase().includes(altFoodName.toLowerCase()) || altFoodName.toLowerCase().includes(f.name.toLowerCase()))
    
    if (altFoodItem) {
      setSelectedFood(altFoodItem)
      setScanState("success")
      logMealDirectly(altFoodItem)
    } else {
      setScanState("idle")
      setSelectedFood(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Scanner Panel */}
      <div className="bg-white/70 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-orange-50/40 to-transparent" />
        
        <AnimatePresence mode="wait">
          {scanState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-5"
            >
              <div className="relative w-28 h-28 flex items-center justify-center bg-orange-50 rounded-2xl border border-orange-100">
                <Camera className="w-12 h-12 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/20 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0F172A]">Food Scanner Camera</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Point your camera at a meal to scan its glycemic safety, and get AI food detection results.
                </p>
              </div>

              <button
                onClick={startCamera}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white font-bold text-xs py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Open Live Device Camera
              </button>
            </motion.div>
          )}

          {scanState === "camera" && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-between p-4 relative min-h-[350px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase border border-orange-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  Live Camera Feed
                </span>
                <button 
                  onClick={stopCamera}
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-slate-100 border border-slate-100 text-slate-500 transition-all text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

              {/* Viewport Frame */}
              <div className="my-4 relative flex-1 min-h-[220px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {isCameraLoading ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    <p className="text-xs">Initializing device camera...</p>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center justify-center text-rose-500 p-6 text-center space-y-3">
                    <AlertTriangle className="w-10 h-10" />
                    <p className="text-xs font-bold">{cameraError}</p>
                    <button 
                      onClick={startCamera}
                      className="bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Scan Focus Finder Box */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-44 h-44 border-2 border-dashed border-white/50 rounded-2xl flex items-center justify-center relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500 -mt-0.5 -ml-0.5" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500 -mt-0.5 -mr-0.5" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500 -mb-0.5 -ml-0.5" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500 -mb-0.5 -mr-0.5" />
                        
                        <span className="text-[9px] text-white/70 bg-black/45 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                          Align Meal Here
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Snap Controls */}
              {!isCameraLoading && !cameraError && (
                <div className="flex justify-center z-10 pb-2">
                  <button
                    onClick={capturePhoto}
                    className="w-14 h-14 rounded-full bg-white border-4 border-orange-500/30 flex items-center justify-center shadow-lg hover:border-orange-500 hover:scale-105 active:scale-95 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {scanState === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6"
            >
              {capturedPhoto ? (
                <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-orange-200 bg-orange-50/50 shadow-md">
                  <img src={capturedPhoto} className="w-full h-full object-cover" alt="Captured plate" />
                  <motion.div 
                    className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                    animate={{ top: ["5%", "95%", "5%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              ) : (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-orange-200 bg-orange-50/50 flex items-center justify-center">
                  <ScanLine className="w-16 h-16 text-orange-500 animate-bounce" />
                  <motion.div 
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              )}
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{capturedPhoto ? "AI Analyzing Captured Food..." : `Scanning ${selectedFood?.name}...`}</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Analyzing glycemic loads and insulin targets...</p>
              </div>
            </motion.div>
          )}

          {scanState === "alert" && selectedFood && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6"
            >
              <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/10">
                <AlertTriangle className="w-7 h-7 text-rose-500 animate-bounce" />
              </div>
              <div className="space-y-2 max-w-sm">
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase border border-rose-100">
                  High Glycemic Spike Warning
                </span>
                <h3 className="text-base font-extrabold text-[#0F172A] mt-2">
                  Spike Caution for {selectedFood.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have an active <span className="font-bold text-orange-600">{userRiskProfile?.riskClass || "Moderate Risk"}</span> classification. Eating <span className="font-semibold">{selectedFood.name}</span> (Glycemic Index: **{selectedFood.giValue}**) is highly likely to trigger sugar peaks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
                {selectedFood.alternative && (
                  <button
                    onClick={handleAlternativeRecommend}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Swap with {selectedFood.alternative}
                  </button>
                )}
                <button
                  onClick={() => {
                    setScanState("success")
                    logMealDirectly(selectedFood)
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#0F172A] border border-slate-200 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Log Anyway
                </button>
              </div>
            </motion.div>
          )}

          {scanState === "success" && selectedFood && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6"
            >
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-100">
                  Meal Logged Successfully
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-2">
                  {selectedFood.name} Logged
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Your daily calories and dynamic metabolic risk stats have been updated in your profile dashboard!
                </p>
              </div>

              <div className="w-full max-w-xs border border-orange-50 rounded-2xl p-4 bg-orange-50/20 text-left space-y-2">
                {capturedPhoto && (
                  <div className="w-full h-24 rounded-lg overflow-hidden border border-orange-100/50 mb-2 relative">
                    <img src={capturedPhoto} className="w-full h-full object-cover" alt="Logged meal" />
                  </div>
                )}
                <div className="flex justify-between text-xs border-b border-orange-100/30 pb-1">
                  <span className="text-slate-400">Calories Added:</span>
                  <span className="font-bold text-[#0F172A]">{selectedFood.calories} kcal</span>
                </div>
                <div className="flex justify-between text-xs border-b border-orange-100/30 pb-1">
                  <span className="text-slate-400">Glycemic Load:</span>
                  <span className={`font-bold ${
                    selectedFood.glycemicIndex === "High" ? "text-rose-500" :
                    selectedFood.glycemicIndex === "Medium" ? "text-amber-500" :
                    "text-emerald-500"
                  }`}>{selectedFood.glycemicIndex} ({selectedFood.giValue})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Carbs / Protein / Fat:</span>
                  <span className="font-bold text-slate-600">{selectedFood.carbs} / {selectedFood.protein} / {selectedFood.fat}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setScanState("idle")
                  setSelectedFood(null)
                  setCapturedPhoto(null)
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer"
              >
                Scan Another Meal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
