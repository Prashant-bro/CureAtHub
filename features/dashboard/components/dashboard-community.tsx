"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Award,
  Users,
  TrendingDown,
  Sparkles,
  Share2,
  Plus,
  ThumbsUp,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Calendar,
  ChevronRight,
  Star,
  Info
} from "lucide-react"

interface CommunityStory {
  id: string
  name: string
  avatar: string
  initialRisk: number
  currentRisk: number
  title: string
  content: string
  claps: number
  userClapped: boolean
  tags: string[]
  days: number
  date: string
}

interface Badge {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockCriteria: string
  points: number
  dateUnlocked?: string
}

interface DashboardCommunityProps {
  userName?: string
  userInitials?: string
}

const initialStories: CommunityStory[] = []

const initialBadges: Badge[] = [
  {
    id: "badge-first-scan",
    title: "First Scan",
    description: "Successfully scanned your first meal using the AI Meal Scanner.",
    icon: "📸",
    unlocked: false,
    unlockCriteria: "Scan 1 meal",
    points: 100
  },
  {
    id: "badge-risk-buster",
    title: "Risk Buster",
    description: "Lowered your diabetes risk score by more than 10 points.",
    icon: "📉",
    unlocked: false,
    unlockCriteria: "Drop risk score by 10+",
    points: 250
  },
  {
    id: "badge-streak-7",
    title: "Weekly Warrior",
    description: "Logged your meals and met daily active exercises for 7 consecutive days.",
    icon: "🔥",
    unlocked: false,
    unlockCriteria: "7-day habit streak",
    points: 150
  },
  {
    id: "badge-storyteller",
    title: "Storyteller",
    description: "Shared your success story with the Mitig8 community.",
    icon: "✍️",
    unlocked: false,
    unlockCriteria: "Publish a success story",
    points: 150
  },
  {
    id: "badge-sugar-free",
    title: "Sugar Free",
    description: "Maintained a perfect low-glycemic meal log for 15 days in a row.",
    icon: "🚫",
    unlocked: false,
    unlockCriteria: "15-day low-glycemic streak",
    points: 300
  },
  {
    id: "badge-peak-health",
    title: "Peak Health",
    description: "Successfully dropped your diabetes risk score to low risk (< 20).",
    icon: "👑",
    unlocked: false,
    unlockCriteria: "Achieve Risk Score < 20",
    points: 500
  }
]

const leaderboardUsers: { rank: number; name: string; avatar: string; drop: number; points: number; isCurrentUser: boolean }[] = []

export function DashboardCommunity({ userName = "", userInitials = "U" }: DashboardCommunityProps) {
  const [activeTab, setActiveTab] = useState<"stories" | "leaderboard" | "badges">("stories")
  const [stories, setStories] = useState<CommunityStory[]>(initialStories)
  const [badges, setBadges] = useState<Badge[]>(initialBadges)
  const [leaderboard, setLeaderboard] = useState(leaderboardUsers)
  
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const maxXp = 2000

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [startRisk, setStartRisk] = useState(60)
  const [currRisk, setCurrRisk] = useState(32)
  const [newTags, setNewTags] = useState("")
  const [formError, setFormError] = useState("")
  const [showXpToast, setShowXpToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const handleClap = (id: string) => {
    setStories(prev =>
      prev.map(story => {
        if (story.id === id) {
          const userClapped = !story.userClapped
          return {
            ...story,
            claps: userClapped ? story.claps + 1 : story.claps - 1,
            userClapped
          }
        }
        return story
      })
    )
  }

  // ── Input Sanitization (shared with Chat) ──────────────────────
  const BLOCKED_PATTERNS_COMM = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<[^>]+>/g,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE|TRUNCATE|REPLACE)\b/gi,
    /[;&|`${}[\]\\]/g,
    /\b(hack|exploit|inject|bypass|attack|malware|phishing|ddos|ransomware|sql\s*injection|xss|csrf|overflow|brute\s*force)\b/gi,
  ]
  const ABUSE_WORDS_COMM = [
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
    "motherfucker", "whore", "slut", "nigger", "faggot", "retard",
    "madarchod", "behenchod", "chutiya", "randi", "gaand", "harami", "kamina",
  ]
  const isInputSafe = (raw: string): boolean => {
    const lower = raw.toLowerCase()
    for (const word of ABUSE_WORDS_COMM) {
      if (lower.includes(word)) return false
    }
    for (const pattern of BLOCKED_PATTERNS_COMM) {
      pattern.lastIndex = 0
      if (pattern.test(raw)) return false
    }
    return true
  }

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) {
      setFormError("Please fill out both the title and story contents.")
      return
    }
    if (startRisk <= currRisk) {
      setFormError("Your starting risk score must be higher than your current score to show a reduction!")
      return
    }

    // Sanitize all text fields
    if (!isInputSafe(newTitle) || !isInputSafe(newContent) || !isInputSafe(newTags)) {
      setFormError("⚠️ Your story contains inappropriate or unsafe content. Please revise and try again.")
      return
    }

    const tagsArray = newTags
      ? newTags.split(",").map(t => t.trim()).filter(Boolean)
      : ["Diet Tips", "Tracking"]

    const newStory: CommunityStory = {
      id: `story-${Date.now()}`,
      name: userName || "User",
      avatar: userInitials || "U",
      initialRisk: startRisk,
      currentRisk: currRisk,
      title: newTitle,
      content: newContent,
      claps: 1,
      userClapped: true,
      tags: tagsArray,
      days: 30,
      date: "Just now"
    }

    setStories(prev => [newStory, ...prev])

    const xpReward = 150
    const newXp = xp + xpReward
    
    if (newXp >= maxXp) {
      setLevel(prev => prev + 1)
      setXp(newXp - maxXp)
      setToastMessage(`Story published! +${xpReward} XP. LEVEL UP to Level ${level + 1}! 🎉`)
    } else {
      setXp(newXp)
      setToastMessage(`Story published! Earned +${xpReward} XP for helping the community! 🌟`)
    }

    setBadges(prev =>
      prev.map(badge => {
        if (badge.id === "badge-storyteller") {
          return { ...badge, unlocked: true, dateUnlocked: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
        }
        return badge
      })
    )

    // Add current user to leaderboard dynamically upon posting their story
    setLeaderboard(prev => {
      const exists = prev.some(u => u.isCurrentUser)
      if (exists) {
        return prev.map(user => {
          if (user.isCurrentUser) {
            return {
              ...user,
              points: user.points + xpReward,
              drop: Math.max(user.drop, startRisk - currRisk)
            }
          }
          return user
        })
      } else {
        return [
          { rank: 1, name: userName || "User", avatar: userInitials || "U", drop: startRisk - currRisk, points: xpReward, isCurrentUser: true }
        ]
      }
    })

    setNewTitle("")
    setNewContent("")
    setNewTags("")
    setFormError("")
    setIsFormOpen(false)
    setShowXpToast(true)

    setTimeout(() => {
      setShowXpToast(false)
    }, 4500)
  }

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <AnimatePresence>
        {showXpToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] bg-[#0F172A] border border-orange-50/30 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-orange-400 uppercase tracking-widest">Achievement Unlocked!</p>
              <p className="text-sm font-semibold text-white/90 leading-tight mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#16213a] to-[#0F172A] p-6 shadow-xl border border-slate-800">
        <motion.div
          className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-orange-500/20 overflow-hidden">
                {userInitials || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 border-2 border-[#0F172A] flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="Your Current Level">
                {level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-lg">{userName || "User"}</h3>
                <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Level {level} Glycemic Guru
                </span>
              </div>
              <p className="text-white/40 text-xs mt-0.5">Let's keep your risk score down and support the community!</p>

              <div className="mt-3 flex items-center gap-3 w-64 md:w-80">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(xp / maxXp) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-[11px] font-bold text-white/70 tracking-wide">
                  {xp} / {maxXp} XP
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            <div className="text-center px-2">
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">XP Earned</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-white font-black text-lg">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{xp + (level - 1) * 2000}</span>
              </div>
            </div>
            
            <div className="text-center px-2 border-x border-white/5">
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Badges</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-white font-black text-lg">
                <Award className="w-4 h-4 text-purple-400" />
                <span>{unlockedBadgesCount} <span className="text-xs text-white/40">/ {badges.length}</span></span>
              </div>
            </div>

            <div className="text-center px-2">
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Rank</p>
              <div className="flex items-center justify-center gap-1 mt-1 text-white font-black text-lg">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>{leaderboard.length > 0 ? `#${leaderboard.findIndex(u => u.isCurrentUser) + 1 || "—"}` : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-orange-100/50 pb-2">
        <div className="flex gap-1 bg-white/60 p-1 border border-orange-100/40 rounded-xl">
          {[
            { id: "stories", label: "Success Stories", icon: BookOpen },
            { id: "leaderboard", label: "Leaderboard", icon: Trophy },
            { id: "badges", label: "Achievements", icon: Award }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === "stories" && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFormOpen(prev => !prev)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/10 hover:shadow-lg transition-all cursor-pointer"
          >
            {isFormOpen ? "Cancel Story" : "Share Your Success Story"}
            {isFormOpen ? <ChevronRight className="w-3.5 h-3.5 rotate-90" /> : <Plus className="w-3.5 h-3.5" />}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && activeTab === "stories" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white/90 border border-orange-100 rounded-2xl shadow-sm"
          >
            <form onSubmit={handleCreateStory} className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-orange-50">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm font-bold text-[#0F172A]">Write Your Risk Score Reduction Story</h4>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. How minor daily swaps dropped my sugars"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Key Strategies (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="e.g. Diet Swap, 30m Walk, Fasting"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Starting Risk Score (0-100)
                  </label>
                  <input
                    type="number"
                    value={startRisk}
                    onChange={e => setStartRisk(Number(e.target.value))}
                    max={100}
                    min={0}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Current Risk Score (0-100)
                  </label>
                  <input
                    type="number"
                    value={currRisk}
                    onChange={e => setCurrRisk(Number(e.target.value))}
                    max={100}
                    min={0}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Your Story (Detail your daily habits, foods, scanner uses, exercise routines)
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Share details on how you did it, what features of Mitig8 helped you (e.g. AI Chat recommendations, Meal Scan diagnostics) so other community members can learn from you!"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-orange-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/10"
                >
                  Publish Story (+150 XP)
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        
        {activeTab === "stories" && (
          <div className="space-y-4">
            {stories.length === 0 ? (
              <div className="bg-white/80 border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                <Users className="w-8 h-8 text-slate-300 mb-2.5 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-600">No Success Stories Yet</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
                  Be the first to share your diabetes risk score reduction journey and help inspire others!
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-3.5 inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/10 hover:shadow-lg transition-all"
                >
                  Post Your Story Now <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              stories.map(story => {
                const reduction = story.initialRisk - story.currentRisk
                return (
                  <motion.div
                    key={story.id}
                    layout
                    className="bg-white/80 border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-4"
                  >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                          {story.avatar}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                            {story.name}
                            {story.name === (userName || "User") && (
                              <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-md">You</span>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{story.date}</span>
                            <span>•</span>
                            <span>{story.days} Days Tracker</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100/50 p-2 rounded-xl">
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Risk Reduction</p>
                          <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-sm">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>-{reduction} Points</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-bold">
                          <span className="text-slate-400 line-through bg-slate-100/60 px-1.5 py-0.5 rounded-md">{story.initialRisk}</span>
                          <ArrowRight className="w-3 h-3 text-emerald-500" />
                          <span className="text-white bg-emerald-500 px-1.5 py-0.5 rounded-md shadow-sm">{story.currentRisk}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-sm font-bold text-[#0F172A]">{story.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{story.content}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {story.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleClap(story.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            story.userClapped
                              ? "bg-orange-50 border-orange-200 text-orange-600"
                              : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${story.userClapped ? "fill-orange-600" : ""}`} />
                          <span>Clap {story.claps}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="bg-white/80 border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-orange-50 bg-[#FFF6EE]/50 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Monthly Risk Buster Leaderboard</h4>
                <p className="text-[11px] text-slate-400">Ranked by score drops and active logging points</p>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                Weekly Pool
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Rank</th>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Max Score Drop</th>
                    <th className="px-5 py-3.5 text-right">Points (XP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-400 font-medium">
                        No entries yet. Share your success story to join the leaderboard!
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map(user => (
                      <tr
                        key={user.name}
                        className={`text-xs transition-colors ${
                          user.isCurrentUser ? "bg-orange-50/40" : "hover:bg-slate-50/30"
                        }`}
                      >
                        <td className="px-5 py-4 font-bold text-[#0F172A]">
                          <div className="flex items-center gap-2">
                            {user.rank === 1 && <span className="text-base">🥇</span>}
                            {user.rank === 2 && <span className="text-base">🥈</span>}
                            {user.rank === 3 && <span className="text-base">🥉</span>}
                            {user.rank > 3 && <span className="pl-1 text-slate-400">#{user.rank}</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                              {user.avatar}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                {user.name}
                                {user.isCurrentUser && (
                                  <span className="text-[8px] font-extrabold text-orange-600 bg-orange-100 px-1 py-0.5 rounded uppercase tracking-wider">You</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>-{user.drop} pts risk</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-black text-[#0F172A]">{user.points} XP</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="space-y-5">
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0F172A]">Your Health Badges</h4>
                <p className="text-xs text-slate-400">Earn badges by meeting targets, sharing stories, and dropping risk scores</p>
              </div>
              <span className="text-xs font-black text-orange-600 bg-orange-100/50 border border-orange-200 px-3 py-1 rounded-full">
                {unlockedBadgesCount} / {badges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map(badge => (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -2 }}
                  className={`border rounded-2xl p-4 flex gap-4 transition-all relative overflow-hidden ${
                    badge.unlocked
                      ? "bg-white border-orange-100 shadow-sm"
                      : "bg-slate-100/40 border-slate-200/60 opacity-60"
                  }`}
                >
                  {badge.unlocked && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/5 rounded-bl-full flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-orange-500 fill-orange-500 translate-x-1 -translate-y-1" />
                    </div>
                  )}

                  <div className="text-3xl shrink-0 flex items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100/50 w-12 h-12">
                    {badge.icon}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate">{badge.title}</h4>
                      <span className="text-[9px] font-black text-orange-600 bg-orange-50/50 px-1.5 py-0.5 rounded">
                        +{badge.points} XP
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{badge.description}</p>
                    
                    <div className="pt-2 flex items-center justify-between text-[9px] font-semibold">
                      <span className="text-slate-400">Target: {badge.unlockCriteria}</span>
                      {badge.unlocked ? (
                        <span className="text-emerald-500 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-slate-400">Locked</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
