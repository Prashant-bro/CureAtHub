import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.MONGODB_URI) {
      // Return empty history if MongoDB is not configured yet
      return NextResponse.json([])
    }

    const { db } = await connectToDatabase()
    const messages = await db
      .collection("chat_messages")
      .find({ userId: user.id })
      .sort({ timestamp: 1 })
      .toArray()

    const formattedMessages = messages.map((msg) => ({
      id: msg.messageId || msg._id.toString(),
      role: msg.role,
      text: msg.text,
      timestamp: msg.timestamp,
    }))

    return NextResponse.json(formattedMessages)
  } catch (err: any) {
    console.error("Fetch chat history API error:", err)
    return NextResponse.json({ error: "Failed to fetch chat history." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "MongoDB is not configured." }, { status: 500 })
    }

    const { id, role, text, timestamp } = await req.json()

    if (!role || !text) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const messageDoc = {
      userId: user.id,
      messageId: id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      text,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    }

    await db.collection("chat_messages").insertOne(messageDoc)

    return NextResponse.json({ success: true, message: messageDoc })
  } catch (err: any) {
    console.error("Save chat message API error:", err)
    return NextResponse.json({ error: "Failed to save chat message." }, { status: 500 })
  }
}
