"use client"

import React from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { WifiOff, Loader2, RefreshCw } from "lucide-react"

interface DashboardSkeletonProps {
  type?: "loading" | "offline"
  onRetry?: () => void
}

export function DashboardSkeleton({ type = "loading", onRetry }: DashboardSkeletonProps) {
  const isOffline = type === "offline"

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md backdrop-blur-md"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <WifiOff className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Internet Issue Detected</h4>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Unable to load live screen data. Attempting to reconnect...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onRetry && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {!isOffline && (
        <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 flex items-center gap-3">
          <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
          <span className="text-xs font-semibold text-slate-600 animate-pulse">
            Fetching diagnostic databases and syncing profile configurations...
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg bg-orange-100/30" />
          <Skeleton className="h-4 w-64 rounded-md bg-orange-100/20" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl hidden sm:block bg-orange-100/30" />
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 shadow-xl min-h-[220px] flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl bg-slate-800" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 bg-slate-800" />
                <Skeleton className="h-3 w-20 bg-slate-800/80" />
              </div>
            </div>
            <Skeleton className="w-16 h-6 rounded-full bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-40 bg-slate-800" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-800/60" />
            </div>
            <div className="hidden sm:flex justify-end items-center">
              <Skeleton className="w-24 h-24 rounded-full bg-slate-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-orange-100/50 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4 items-start sm:items-center">
          <Skeleton className="w-12 h-12 rounded-2xl bg-orange-100/30" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-44 bg-orange-100/30" />
            <Skeleton className="h-3 w-80 max-w-full bg-orange-100/20" />
          </div>
        </div>
        <Skeleton className="h-9 w-32 rounded-xl bg-orange-100/30" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
            <Skeleton className="w-8 h-8 rounded-lg bg-orange-100/20" />
            <Skeleton className="h-3 w-16 bg-orange-100/20" />
            <Skeleton className="h-4 w-24 bg-orange-100/30" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, colIdx) => (
          <div key={colIdx} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl bg-orange-100/30" />
                <Skeleton className="h-4 w-32 bg-orange-100/30" />
              </div>
              <Skeleton className="h-4 w-12 bg-orange-100/20" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Skeleton className="w-8 h-8 rounded-lg bg-orange-100/20" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-24 bg-orange-100/30" />
                      <Skeleton className="h-2.5 w-full bg-orange-100/20" />
                    </div>
                  </div>
                  <Skeleton className="h-3.5 w-12 bg-orange-100/20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
