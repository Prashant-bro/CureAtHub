"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Info,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Heart,
  Activity,
  ArrowRight,
  TrendingUp,
  X,
  FileCheck
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"

// Define clinical profile schemas
interface Biomarker {
  name: string
  value: number
  unit: string
  status: "normal" | "borderline" | "high"
  normalRange: string
  description: string
}

interface ReportProfile {
  name: string
  riskScore: number
  riskClass: "Low Risk" | "Moderate Risk" | "High Risk"
  riskColor: string
  summary: string
  biomarkers: Biomarker[]
  dietAdvice: string[]
  exerciseAdvice: string[]
  historicalData: { month: string; hba1c: number; glucose: number }[]
}

const CLINICAL_PROFILES: Record<string, ReportProfile> = {
  diabetic: {
    name: "Diabetes Risk Diagnostic Report",
    riskScore: 82,
    riskClass: "High Risk",
    riskColor: "from-red-500 to-rose-600 text-rose-600 bg-rose-50 border-rose-100",
    summary: "Biomarker analysis indicates elevated HbA1c and fasting plasma glucose levels, which are consistent with clinical Type-2 Diabetes. Urgent lifestyle modification and clinical correlation are highly recommended.",
    biomarkers: [
      { name: "HbA1c (Glycated Hb)", value: 8.4, unit: "%", status: "high", normalRange: "< 5.7%", description: "Reflects average blood sugar levels over the past 3 months. Values above 6.5% indicate diabetes." },
      { name: "Fasting Blood Sugar", value: 165, unit: "mg/dL", status: "high", normalRange: "70 - 100 mg/dL", description: "Blood sugar measured after fasting overnight. Values over 126 mg/dL indicate diabetes." },
      { name: "Post-Prandial Glucose", value: 242, unit: "mg/dL", status: "high", normalRange: "< 140 mg/dL", description: "Blood sugar measured 2 hours after a meal. Values over 200 mg/dL indicate diabetes." },
      { name: "Total Cholesterol", value: 228, unit: "mg/dL", status: "high", normalRange: "< 200 mg/dL", description: "Total amount of cholesterol in blood. Higher levels increase cardiovascular risks." }
    ],
    dietAdvice: [
      "Strictly limit simple sugars, sweets, fruit juices, and white refined flour.",
      "Incorporate high-fiber complex carbohydrates (whole oats, quinoa, brown rice) in moderation.",
      "Increase intake of leafy green vegetables, cucumbers, bitter gourd (karela), and fenugreek seeds (methi)."
    ],
    exerciseAdvice: [
      "Engage in 30-45 minutes of daily brisk walking or light aerobics.",
      "Include strength/resistance training 2 days a week to improve insulin sensitivity.",
      "Monitor blood glucose pre- and post-workout to analyze response trends."
    ],
    historicalData: [
      { month: "Jan", hba1c: 7.2, glucose: 140 },
      { month: "Mar", hba1c: 7.8, glucose: 155 },
      { month: "Jun", hba1c: 8.4, glucose: 165 }
    ]
  },
  prediabetic: {
    name: "Borderline Biomarker Summary",
    riskScore: 54,
    riskClass: "Moderate Risk",
    riskColor: "from-amber-400 to-orange-500 text-orange-600 bg-orange-50 border-orange-100",
    summary: "Your biomarkers indicate borderline pre-diabetic ranges. Glycation levels (HbA1c) are elevated slightly. Reversing this state is highly achievable through targeted nutritional interventions.",
    biomarkers: [
      { name: "HbA1c (Glycated Hb)", value: 6.1, unit: "%", status: "borderline", normalRange: "< 5.7%", description: "Levels between 5.7% and 6.4% signify pre-diabetes." },
      { name: "Fasting Blood Sugar", value: 114, unit: "mg/dL", status: "borderline", normalRange: "70 - 100 mg/dL", description: "Levels between 100 and 125 mg/dL suggest impaired fasting glucose." },
      { name: "Post-Prandial Glucose", value: 168, unit: "mg/dL", status: "borderline", normalRange: "< 140 mg/dL", description: "Levels between 140 and 199 mg/dL signal impaired glucose tolerance." },
      { name: "Total Cholesterol", value: 206, unit: "mg/dL", status: "borderline", normalRange: "< 200 mg/dL", description: "Borderline high. Reduce trans fats and hydrogenated oils." }
    ],
    dietAdvice: [
      "Practice portion control and reduce carbohydrate volume by 25%.",
      "Switch from white rice to brown rice or millets (Ragi, Jowar).",
      "Include protein (paneer, tofu, lentils, egg whites) in every major meal to reduce glucose spikes."
    ],
    exerciseAdvice: [
      "Perform moderate aerobic exercises for 150 minutes per week.",
      "Practice regular yoga (specifically Surya Namaskar and Mandukasana) to stimulate pancreatic health.",
      "Avoid prolonged sitting - take short 5-minute walks every 1 hour."
    ],
    historicalData: [
      { month: "Jan", hba1c: 5.6, glucose: 95 },
      { month: "Mar", hba1c: 5.9, glucose: 108 },
      { month: "Jun", hba1c: 6.1, glucose: 114 }
    ]
  },
  healthy: {
    name: "Preventative Metabolic Screening",
    riskScore: 16,
    riskClass: "Low Risk",
    riskColor: "from-emerald-400 to-teal-500 text-emerald-600 bg-emerald-50 border-emerald-100",
    summary: "All clinical biomarkers related to insulin regulation, glycation, and lipid levels fall well within optimal reference intervals. Continue maintaining your excellent health parameters.",
    biomarkers: [
      { name: "HbA1c (Glycated Hb)", value: 5.1, unit: "%", status: "normal", normalRange: "< 5.7%", description: "Indicates normal long-term glycation baseline." },
      { name: "Fasting Blood Sugar", value: 86, unit: "mg/dL", status: "normal", normalRange: "70 - 100 mg/dL", description: "Optimal glucose level in fasted state." },
      { name: "Post-Prandial Glucose", value: 118, unit: "mg/dL", status: "normal", normalRange: "< 140 mg/dL", description: "Perfect insulin response post meals." },
      { name: "Total Cholesterol", value: 178, unit: "mg/dL", status: "normal", normalRange: "< 200 mg/dL", description: "Healthy lipid distribution." }
    ],
    dietAdvice: [
      "Continue focusing on a wholesome, plant-forward diet rich in whole foods.",
      "Ensure adequate hydration (2.5 - 3 liters of water daily).",
      "Limit empty calories and heavily processed snacks to sustain metabolic stability."
    ],
    exerciseAdvice: [
      "Keep up the current physical routine (aim for combination of cardio & bodyweight strength).",
      "Focus on dynamic flexibility and aerobic endurance.",
      "Aim for 8,000 to 10,000 steps daily."
    ],
    historicalData: [
      { month: "Jan", hba1c: 5.3, glucose: 90 },
      { month: "Mar", hba1c: 5.2, glucose: 88 },
      { month: "Jun", hba1c: 5.1, glucose: 86 }
    ]
  }
}

const SCAN_PHASES = [
  { message: "Extracting raw text layout from medical PDF...", duration: 900 },
  { message: "Parsing key clinical metrics (HbA1c, FBS, PPBS)...", duration: 1000 },
  { message: "Cross-referencing biomarkers with diabetes index thresholds...", duration: 800 },
  { message: "Synthesizing customized lifestyle & dietary response map...", duration: 800 }
]

const REFERENCE_CHART_DATA = [
  { name: "Optimal (<100)", value: 85, fill: "#10b981" },
  { name: "Borderline (100-125)", value: 112, fill: "#f59e0b" },
  { name: "High Risk (>=126)", value: 165, fill: "#ef4444" }
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }
  })
}

export function DashboardReportAnalyzer() {
  const [analyzingState, setAnalyzingState] = useState<"idle" | "scanning" | "result">("idle")
  const [currentPhase, setCurrentPhase] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<ReportProfile | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handlers for mock drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const startScanningSequence = (profile: ReportProfile, fileName: string) => {
    setSelectedProfile(profile)
    setUploadedFileName(fileName)
    setAnalyzingState("scanning")
    setCurrentPhase(0)

    let phase = 0
    const runNextPhase = () => {
      if (phase < SCAN_PHASES.length - 1) {
        setTimeout(() => {
          phase += 1
          setCurrentPhase(phase)
          runNextPhase()
        }, SCAN_PHASES[phase].duration)
      } else {
        setTimeout(() => {
          setAnalyzingState("result")
        }, SCAN_PHASES[phase].duration)
      }
    }
    runNextPhase()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const name = file.name
      // Generate a profile for realistic display (Pre-diabetic if normal name, otherwise diabetic if matches keywords)
      const keyword = name.toLowerCase()
      let matchedProfile = CLINICAL_PROFILES.prediabetic
      if (keyword.includes("diab") || keyword.includes("high") || keyword.includes("report_high")) {
        matchedProfile = CLINICAL_PROFILES.diabetic
      } else if (keyword.includes("normal") || keyword.includes("health") || keyword.includes("fit")) {
        matchedProfile = CLINICAL_PROFILES.healthy
      }
      startScanningSequence(matchedProfile, name)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const name = file.name
      const keyword = name.toLowerCase()
      let matchedProfile = CLINICAL_PROFILES.prediabetic
      if (keyword.includes("diab") || keyword.includes("high") || keyword.includes("report_high")) {
        matchedProfile = CLINICAL_PROFILES.diabetic
      } else if (keyword.includes("normal") || keyword.includes("health") || keyword.includes("fit")) {
        matchedProfile = CLINICAL_PROFILES.healthy
      }
      startScanningSequence(matchedProfile, name)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleReset = () => {
    setAnalyzingState("idle")
    setSelectedProfile(null)
    setUploadedFileName("")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {/* State 1: IDLE / UPLOAD */}
        {analyzingState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Col: Upload Zone */}
            <div className="lg:col-span-2 space-y-5">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`relative overflow-hidden bg-white/70 backdrop-blur-xl border-2 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? "border-orange-500 bg-orange-50/20 scale-[1.01]"
                    : "border-orange-200 hover:border-orange-400 hover:bg-white"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Visual scan frame */}
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center bg-orange-50 rounded-2xl">
                  <Upload className="w-8 h-8 text-orange-500" />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-orange-500/20"
                    animate={{ scale: [1, 1.15, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <h3 className="text-xl font-bold text-[#0F172A] mb-1">
                  Upload Lab Report PDF
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
                  Drag & drop your health report, blood test, or clinical summary (PDF or image).
                </p>

                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-orange-500/25">
                  Browse Files
                </div>

                <p className="text-[10px] text-slate-400 mt-4">
                  Supported files: PDF, PNG, JPG (Max 10MB)
                </p>
              </div>

              {/* Informative reference range chart */}
              <div className="bg-white/70 border border-orange-100/40 rounded-3xl p-5 shadow-sm space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Clinical Reference Thresholds</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Fasting Blood Sugar ranges (mg/dL) showing risk classification.</p>
                </div>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REFERENCE_CHART_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={[0, 200]} />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #f1f5f9", fontSize: "10px" }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={35}>
                        {REFERENCE_CHART_DATA.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Col: Sample profiles for instant testing */}
            <div className="space-y-4">
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Demo Sample Profiles</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Test the report analyzer immediately with a preloaded clinic report.</p>
                </div>

                <div className="space-y-2.5">
                  {/* Option 1: Healthy */}
                  <button
                    onClick={() => startScanningSequence(CLINICAL_PROFILES.healthy, "Report_Healthy_Rahul.pdf")}
                    className="w-full flex items-center justify-between text-left p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                        OH
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">Optimal Health Profile</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">HbA1c: 5.1% • FBS: 86 mg/dL</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full group-hover:scale-105 transition-transform">
                      Low Risk
                    </span>
                  </button>

                  {/* Option 2: Pre-diabetic */}
                  <button
                    onClick={() => startScanningSequence(CLINICAL_PROFILES.prediabetic, "Lab_Summary_Borderline.pdf")}
                    className="w-full flex items-center justify-between text-left p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                        BD
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">Borderline Pre-Diabetic</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">HbA1c: 6.1% • FBS: 114 mg/dL</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full group-hover:scale-105 transition-transform">
                      Moderate
                    </span>
                  </button>

                  {/* Option 3: Diabetic */}
                  <button
                    onClick={() => startScanningSequence(CLINICAL_PROFILES.diabetic, "Diagnostic_Diabetic_Severe.pdf")}
                    className="w-full flex items-center justify-between text-left p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-red-300 hover:bg-red-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-100/80 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                        HD
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">High-Risk Diabetic Profile</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">HbA1c: 8.4% • FBS: 165 mg/dL</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full group-hover:scale-105 transition-transform">
                      High Risk
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 2: SCANNING / LOADING */}
        {analyzingState === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 text-center shadow-sm"
          >
            <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
              {/* Spinning background */}
              <div className="absolute inset-0 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                <FileText className="w-9 h-9 text-orange-500 animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#0F172A] mb-1">Analyzing Health Record</h3>
            <p className="text-xs text-slate-400 mb-6 truncate max-w-xs mx-auto">
              Document: {uploadedFileName}
            </p>

            {/* Checklist */}
            <div className="text-left bg-slate-50/60 rounded-2xl p-5 border border-slate-100/80 space-y-3.5">
              {SCAN_PHASES.map((phase, idx) => {
                const isCompleted = idx < currentPhase
                const isCurrent = idx === currentPhase
                return (
                  <div key={idx} className="flex items-center gap-3.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-orange-500 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        isCompleted
                          ? "text-slate-500 line-through"
                          : isCurrent
                          ? "text-orange-600 font-bold"
                          : "text-slate-300"
                      }`}
                    >
                      {phase.message}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* State 3: REPORT OVERVIEW RESULTS */}
        {analyzingState === "result" && selectedProfile && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Analyze Another Report
              </button>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>Uploaded: <span className="font-bold text-[#0F172A]">{uploadedFileName}</span></span>
              </div>
            </div>

            {/* Risk Assessment Card & Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Gauge */}
              <div className="bg-[#0F172A] rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-slate-900/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-orange-400" />
                    <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">Metabolic Score</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedProfile.riskClass === "Low Risk" ? "bg-emerald-500/20 text-emerald-400" :
                    selectedProfile.riskClass === "Moderate Risk" ? "bg-amber-500/20 text-amber-400" :
                    "bg-rose-500/20 text-rose-400"
                  }`}>
                    {selectedProfile.riskClass}
                  </span>
                </div>

                <div className="text-center my-6">
                  <h3 className="text-5xl font-black">{selectedProfile.riskScore}<span className="text-lg text-white/30 font-medium">/100</span></h3>
                  <p className="text-[11px] text-white/40 font-semibold tracking-wide uppercase mt-1">Diabetes Risk Rating</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-2.5 items-start">
                  <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-white/70 leading-relaxed">
                    Score reflects correlation of HbA1c, glucose tolerance, and lipid baseline values.
                  </p>
                </div>
              </div>

              {/* Brief Analysis Summary */}
              <div className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2.5 text-orange-500 mb-2.5">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-xs font-bold tracking-wider uppercase">AI Report Overview</h4>
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] leading-snug">{selectedProfile.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">{selectedProfile.summary}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Classified using Diapredix Risk Model v2.4</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Analysis Active
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Biomarker Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Biomarkers List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Detected Biomarkers</span>
                  <span className="text-[10px] font-normal text-slate-400">({selectedProfile.biomarkers.length} indicators found)</span>
                </h4>

                <div className="space-y-3">
                  {selectedProfile.biomarkers.map((bm, index) => {
                    const isHigh = bm.status === "high"
                    const isBorderline = bm.status === "borderline"

                    // Calculate horizontal segmented ranges
                    let greenWidth = 50
                    let yellowWidth = 0
                    let redWidth = 50
                    let pointerPos = 50

                    if (bm.name.includes("HbA1c")) {
                      greenWidth = 57 // normal: <5.7
                      yellowWidth = 7 // borderline: 5.7 - 6.4 (64% - 57%)
                      redWidth = 36 // high: >=6.5 (100% - 64%)
                      pointerPos = Math.min((bm.value / 10) * 100, 100)
                    } else if (bm.name.includes("Fasting Blood Sugar")) {
                      greenWidth = 50 // normal: <100
                      yellowWidth = 12.5 // borderline: 100 - 125
                      redWidth = 37.5 // high: >=126
                      pointerPos = Math.min((bm.value / 200) * 100, 100)
                    } else if (bm.name.includes("Post-Prandial Glucose")) {
                      greenWidth = 46.6 // normal: <140
                      yellowWidth = 19.7 // borderline: 140 - 199
                      redWidth = 33.7 // high: >=200
                      pointerPos = Math.min((bm.value / 300) * 100, 100)
                    } else { // Total Cholesterol
                      greenWidth = 66.6 // normal: <200
                      yellowWidth = 0
                      redWidth = 33.4 // high: >=200
                      pointerPos = Math.min((bm.value / 300) * 100, 100)
                    }

                    return (
                      <div
                        key={index}
                        className="bg-white/80 border border-slate-100 hover:border-orange-100 rounded-2xl p-4 transition-all shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-[#0F172A]">{bm.name}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Reference: {bm.normalRange}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-[#0F172A]">{bm.value} <span className="text-[10px] font-bold text-slate-400">{bm.unit}</span></span>
                            <div className="mt-1">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                isHigh ? "bg-rose-50 text-rose-500" :
                                isBorderline ? "bg-amber-50 text-amber-500" :
                                "bg-emerald-50 text-emerald-500"
                              }`}>
                                {bm.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Visual Segmented Range Chart with Pointer */}
                        <div className="relative mt-7 mb-5">
                          {/* Segmented Track */}
                          <div className="h-1.5 w-full rounded-full bg-slate-100 flex overflow-hidden">
                            <div style={{ width: `${greenWidth}%` }} className="h-full bg-emerald-400/80" />
                            {yellowWidth > 0 && <div style={{ width: `${yellowWidth}%` }} className="h-full bg-amber-400/85" />}
                            <div style={{ width: `${redWidth}%` }} className="h-full bg-rose-400/80" />
                          </div>

                          {/* Pointer Pin representing "Yours" */}
                          <div
                            className="absolute top-0 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                            style={{ left: `${pointerPos}%` }}
                          >
                            <div className="w-2.5 h-2.5 bg-[#0F172A] rotate-45 transform border border-white" />
                            <div className="absolute bottom-3 bg-[#0F172A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                              Yours: {bm.value}
                            </div>
                          </div>

                          {/* Range Labels Row */}
                          <div className="flex justify-between text-[8px] font-bold text-slate-400 mt-1.5 px-0.5">
                            <span>Normal</span>
                            {yellowWidth > 0 ? (
                              <>
                                <span style={{ marginLeft: `${greenWidth - 5}%` }}>Borderline</span>
                                <span>High Risk</span>
                              </>
                            ) : (
                              <span>High Risk</span>
                            )}
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-normal mt-2.5 pt-2 border-t border-slate-50">
                          {bm.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Chart & Trend Visualization */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#0F172A]">Historical Trend Analysis</h4>
                
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HbA1c Path Tracker</p>
                      <p className="text-xs font-bold text-[#0F172A] mt-0.5">3-Month Glycemic Trend</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Updated from records</span>
                    </div>
                  </div>

                  {/* Recharts Area Chart */}
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={selectedProfile.historicalData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorHba1c" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[4, 10]} />
                        <Tooltip
                          contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9" }}
                          labelStyle={{ fontWeight: "bold", color: "#0F172A", fontSize: "11px" }}
                          itemStyle={{ color: "#f97316", fontSize: "11px" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="hba1c"
                          stroke="#f97316"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorHba1c)"
                          name="HbA1c (%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal text-center">
                    Graph maps historical average glycation percentage. Goal range is below 5.7%.
                  </p>
                </div>

                {/* Direct Action Plan suggestions */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-[#0F172A] tracking-wider uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-orange-500" /> AI Lifestyle Recommendations
                  </h4>

                  <div className="space-y-4">
                    {/* Nutrition suggestions */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dietary Target</span>
                      <ul className="list-disc pl-4 space-y-1.5 mt-1.5 text-xs text-slate-600">
                        {selectedProfile.dietAdvice.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Exercise suggestions */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physical Target</span>
                      <ul className="list-disc pl-4 space-y-1.5 mt-1.5 text-xs text-slate-600">
                        {selectedProfile.exerciseAdvice.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
