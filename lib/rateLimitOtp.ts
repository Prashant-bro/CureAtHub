import { Redis } from "@upstash/redis"
import crypto from "crypto"

// Initialize Upstash Redis Client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

export enum RateLimitLayer {
  PHONE = "phone",
  IP = "ip",
  COMBINED = "combined",
  GLOBAL = "global",
}

export interface RateLimitResult {
  allowed: boolean
  reason?: string
  retryAfter?: number
  layer?: RateLimitLayer
}

// Configurable constants from environment with defaults
const PHONE_MAX = Number(process.env.RATE_LIMIT_PHONE_MAX) || 3
const PHONE_WINDOW = Number(process.env.RATE_LIMIT_PHONE_WINDOW) || 600

const IP_MAX = Number(process.env.RATE_LIMIT_IP_MAX) || 20
const IP_WINDOW = Number(process.env.RATE_LIMIT_IP_WINDOW) || 3600

const COMBINED_MAX = Number(process.env.RATE_LIMIT_COMBINED_MAX) || 5
const COMBINED_WINDOW = Number(process.env.RATE_LIMIT_COMBINED_WINDOW) || 3600

const GLOBAL_MAX = Number(process.env.RATE_LIMIT_GLOBAL_MAX) || 1000
const GLOBAL_WINDOW = Number(process.env.RATE_LIMIT_GLOBAL_WINDOW) || 3600

/**
 * Masks the phone number to show only the last 4 digits (e.g. ****6789).
 */
export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone
  return "****" + phone.slice(-4)
}

/**
 * Masks the IP address to show only the first two octets (e.g. 103.21.x.x).
 */
export function maskIP(ip: string): string {
  if (ip.includes(".")) {
    const parts = ip.split(".")
    return `${parts[0] || "0"}.${parts[1] || "0"}.x.x`
  } else if (ip.includes(":")) {
    const parts = ip.split(":")
    return `${parts[0] || "0"}:${parts[1] || "0"}:x:x:x:x:x:x`
  }
  return "x.x.x.x"
}

/**
 * Logs a rate limit block with masked data. (Disabled to prevent console leaks)
 */
export function logBlock(phone: string, ip: string, layer: RateLimitLayer): void {
  // Disabled console logging of rate limit blocks to prevent exposing details
}

/**
 * Extracts client real IP from standard proxy/CDN headers.
 */
export function getRealIP(request: Request): string {
  const headers = request.headers
  
  const xForwardedFor = headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const firstIP = xForwardedFor.split(",")[0]?.trim()
    if (firstIP) return firstIP
  }
  
  const xRealIP = headers.get("x-real-ip")
  if (xRealIP) return xRealIP.trim()
  
  const cfConnectingIP = headers.get("cf-connecting-ip")
  if (cfConnectingIP) return cfConnectingIP.trim()
  
  return "0.0.0.0"
}

/**
 * Helper to check rate limit on a specific layer.
 */
async function checkLayer(
  key: string,
  limit: number,
  window: number,
  layer: RateLimitLayer,
  phone: string,
  ip: string
): Promise<RateLimitResult> {
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, window)
  } else {
    const ttl = await redis.ttl(key)
    if (ttl === -1) {
      await redis.expire(key, window)
    }
  }

  if (count > limit) {
    const ttl = await redis.ttl(key)
    const retryAfter = ttl > 0 ? ttl : window
    logBlock(phone, ip, layer)
    return {
      allowed: false,
      reason: `Too many requests. Please try again later.`,
      retryAfter,
      layer,
    }
  }

  return { allowed: true }
}

/**
 * Checks all 4 rate limiting layers in order for OTP send.
 */
export async function checkRateLimits(phone: string, ip: string): Promise<RateLimitResult> {
  // Layer 1: Phone rate limit
  const phoneKey = `rate:otp:phone:${phone}`
  const phoneRes = await checkLayer(phoneKey, PHONE_MAX, PHONE_WINDOW, RateLimitLayer.PHONE, phone, ip)
  if (!phoneRes.allowed) return phoneRes

  // Layer 2: IP rate limit
  const ipKey = `rate:otp:ip:${ip}`
  const ipRes = await checkLayer(ipKey, IP_MAX, IP_WINDOW, RateLimitLayer.IP, phone, ip)
  if (!ipRes.allowed) return ipRes

  // Layer 3: Combined IP + Phone rate limit
  const combinedKey = `rate:otp:combined:${ip}:${phone}`
  const combinedRes = await checkLayer(combinedKey, COMBINED_MAX, COMBINED_WINDOW, RateLimitLayer.COMBINED, phone, ip)
  if (!combinedRes.allowed) return combinedRes

  // Layer 4: Global circuit breaker
  const globalKey = "rate:otp:global"
  const globalRes = await checkLayer(globalKey, GLOBAL_MAX, GLOBAL_WINDOW, RateLimitLayer.GLOBAL, phone, ip)
  if (!globalRes.allowed) {
    globalRes.reason = "OTP service is temporarily busy. Please try again shortly."
    return globalRes
  }

  return { allowed: true }
}

/**
 * Checks only the IP rate limit layer for OTP verify.
 */
export async function checkIPRateLimit(ip: string, phone: string): Promise<RateLimitResult> {
  const ipKey = `rate:otp:ip:${ip}`
  return await checkLayer(ipKey, IP_MAX, IP_WINDOW, RateLimitLayer.IP, phone, ip)
}

/**
 * Compares two strings in a timing-safe manner using SHA256 hashes.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  const aHash = crypto.createHash("sha256").update(a).digest()
  const bHash = crypto.createHash("sha256").update(b).digest()
  return crypto.timingSafeEqual(aHash, bHash)
}
