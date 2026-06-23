"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Dumbbell,
  Salad,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronRight,
  TrendingDown
} from "lucide-react"

interface CustomLog {
  id: string
  name: string
  value: number // minutes for workout, calories for meal
  completed: boolean
  glycemicIndex?: "High" | "Medium" | "Low"
}

export function DashboardDiet() {
  const [workouts, setWorkouts] = useState<CustomLog[]>([])
  const [meals, setMeals] = useState<CustomLog[]>([])
  
  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [workoutName, setWorkoutName] = useState("")
  const [workoutMin, setWorkoutMin] = useState(30)

  const [showAddMeal, setShowAddMeal] = useState(false)
  const [mealName, setMealName] = useState("")
  const [mealCal, setMealCal] = useState(250)
  const [mealGI, setMealGI] = useState<"High" | "Medium" | "Low">("Low")

  const [userRiskProfile, setUserRiskProfile] = useState<any>(null)

  const loadProfile = () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("mitig8_analyzed_report")
        if (saved) setUserRiskProfile(JSON.parse(saved))
      } catch (e) {
        // silent
      }
    }
  }

  useEffect(() => {
    loadProfile()
    window.addEventListener("mitig8_report_updated", loadProfile)
    return () => {
      window.removeEventListener("mitig8_report_updated", loadProfile)
    }
  }, [])

  const updateRiskScore = (scoreChange: number) => {
    if (!userRiskProfile || typeof window === "undefined") return

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
  }

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workoutName.trim()) return

    const newW: CustomLog = {
      id: `w-${Date.now()}`,
      name: workoutName,
      value: Number(workoutMin),
      completed: false
    }
    setWorkouts([...workouts, newW])
    setWorkoutName("")
    setShowAddWorkout(false)
  }

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mealName.trim()) return

    const newM: CustomLog = {
      id: `m-${Date.now()}`,
      name: mealName,
      value: Number(mealCal),
      completed: false,
      glycemicIndex: mealGI
    }
    setMeals([...meals, newM])
    setMealName("")
    setShowAddMeal(false)
  }

  const toggleWorkout = (id: string) => {
    setWorkouts(workouts.map(w => {
      if (w.id === id) {
        const nextCompleted = !w.completed
        if (typeof window !== "undefined") {
          const currentAct = Number(localStorage.getItem("mitig8_activity")) || 0
          localStorage.setItem("mitig8_activity", String(currentAct + (nextCompleted ? w.value : -w.value)))
        }
        // Deduct 2 risk points for completing exercise, add back if unchecked
        updateRiskScore(nextCompleted ? -2 : 2)
        return { ...w, completed: nextCompleted }
      }
      return w
    }))
  }

  const toggleMeal = (id: string) => {
    setMeals(meals.map(m => {
      if (m.id === id) {
        const nextCompleted = !m.completed
        if (typeof window !== "undefined") {
          const currentCals = Number(localStorage.getItem("mitig8_calories")) || 0
          localStorage.setItem("mitig8_calories", String(currentCals + (nextCompleted ? m.value : -m.value)))
        }
        
        // Glycemic adjustment
        let change = 0
        if (m.glycemicIndex === "High") change = nextCompleted ? 3 : -3
        else if (m.glycemicIndex === "Medium") change = nextCompleted ? 1 : -1
        else change = nextCompleted ? -1 : 1
        
        updateRiskScore(change)
        return { ...m, completed: nextCompleted }
      }
      return m
    }))
  }

  const deleteWorkout = (id: string) => {
    const item = workouts.find(w => w.id === id)
    if (item?.completed) {
      updateRiskScore(2) // revert risk points
      if (typeof window !== "undefined") {
        const currentAct = Number(localStorage.getItem("mitig8_activity")) || 0
        localStorage.setItem("mitig8_activity", String(Math.max(0, currentAct - item.value)))
      }
    }
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  const deleteMeal = (id: string) => {
    const item = meals.find(m => m.id === id)
    if (item?.completed) {
      let change = 0
      if (item.glycemicIndex === "High") change = -3
      else if (item.glycemicIndex === "Medium") change = -1
      else change = 1
      updateRiskScore(change)

      if (typeof window !== "undefined") {
        const currentCals = Number(localStorage.getItem("mitig8_calories")) || 0
        localStorage.setItem("mitig8_calories", String(Math.max(0, currentCals - item.value)))
      }
    }
    setMeals(meals.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#0F172A]">Diet & Exercise</h3>
          <p className="text-sm text-slate-400 mt-0.5">Log custom meals and activities to dynamically adjust your metabolic score.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workouts Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Dumbbell className="w-4.5 h-4.5 text-blue-500" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Exercise Actions</h4>
              </div>
              <button
                onClick={() => setShowAddWorkout(true)}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Exercise
              </button>
            </div>

            {workouts.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center px-4 bg-slate-50/40">
                <Dumbbell className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-500">No exercises logged</p>
                <p className="text-[10px] text-slate-400 max-w-[200px] mt-0.5 leading-normal">
                  Click 'Add Exercise' to log your custom daily workouts.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {workouts.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleWorkout(w.id)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          w.completed ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300 hover:border-blue-500"
                        }`}
                      >
                        {w.completed && <CheckCircle2 className="w-4.5 h-4.5" />}
                      </button>
                      <span className={`text-xs font-semibold ${w.completed ? "line-through text-slate-400" : "text-[#0F172A]"}`}>
                        {w.name} ({w.value} mins)
                      </span>
                    </div>
                    <button
                      onClick={() => deleteWorkout(w.id)}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {showAddWorkout && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 border-t border-slate-100 pt-4"
              >
                <form onSubmit={handleAddWorkout} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Workout description"
                      value={workoutName}
                      onChange={e => setWorkoutName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-300 focus:ring-1 focus:ring-orange-100 rounded-xl px-3 py-1.5 text-xs text-[#0F172A] outline-none transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Mins"
                      value={workoutMin}
                      onChange={e => setWorkoutMin(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-300 focus:ring-1 focus:ring-orange-100 rounded-xl px-3 py-1.5 text-xs text-[#0F172A] outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddWorkout(false)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Meals Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-orange-100/50 rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Salad className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Diet Actions</h4>
              </div>
              <button
                onClick={() => setShowAddMeal(true)}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Meal
              </button>
            </div>

            {meals.length === 0 ? (
              <div className="py-14 text-center border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center px-4 bg-slate-50/40">
                <Salad className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-500">No custom meals logged</p>
                <p className="text-[10px] text-slate-400 max-w-[200px] mt-0.5 leading-normal">
                  Click 'Add Meal' to track custom meals and their glycemic ratings.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {meals.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleMeal(m.id)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          m.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-emerald-500"
                        }`}
                      >
                        {m.completed && <CheckCircle2 className="w-4.5 h-4.5" />}
                      </button>
                      <span className={`text-xs font-semibold ${m.completed ? "line-through text-slate-400" : "text-[#0F172A]"}`}>
                        {m.name} ({m.value} kcal)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        m.glycemicIndex === "High" ? "bg-rose-50 text-rose-500" :
                        m.glycemicIndex === "Medium" ? "bg-amber-50 text-amber-500" :
                        "bg-emerald-50 text-emerald-500"
                      }`}>
                        {m.glycemicIndex} GI
                      </span>
                      <button
                        onClick={() => deleteMeal(m.id)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {showAddMeal && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 border-t border-slate-100 pt-4"
              >
                <form onSubmit={handleAddMeal} className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Meal description"
                      value={mealName}
                      onChange={e => setMealName(e.target.value)}
                      className="w-full col-span-1.5 bg-slate-50 border border-slate-200 focus:border-orange-300 focus:ring-1 focus:ring-orange-100 rounded-xl px-3 py-1.5 text-xs text-[#0F172A] outline-none transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      value={mealCal}
                      onChange={e => setMealCal(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-300 focus:ring-1 focus:ring-orange-100 rounded-xl px-3 py-1.5 text-xs text-[#0F172A] outline-none transition-all"
                    />
                    <select
                      value={mealGI}
                      onChange={e => setMealGI(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-[#0F172A] outline-none focus:border-orange-300"
                    >
                      <option value="Low">Low GI</option>
                      <option value="Medium">Med GI</option>
                      <option value="High">High GI</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddMeal(false)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
