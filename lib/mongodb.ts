import { MongoClient, Db } from "mongodb"

/**
 * Cached MongoDB client for serverless environments.
 * Reuses the connection across hot-reloaded invocations in dev,
 * and across concurrent requests in production.
 */

const MONGODB_URI = process.env.MONGODB_URI || ""
const MONGODB_DB = process.env.MONGODB_DB || "mitig8"

if (!MONGODB_URI) {
  console.warn("MONGODB_URI environment variable is not set.")
}

// Module-scoped cache so the connection survives hot reload in dev
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(MONGODB_DB)

  cachedClient = client
  cachedDb = db

  return { client, db }
}
