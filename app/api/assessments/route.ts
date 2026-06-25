import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Risk Assessment API
 * GET  — fetch latest risk assessment for the authenticated user
 * POST — save a new risk assessment result
 */

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to access assessments." },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("risk_assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Fetch assessment error:", error)
      return NextResponse.json(
        { error: "Failed to load assessment." },
        { status: 500 }
      )
    }

    return NextResponse.json({ assessment: data })
  } catch (err) {
    console.error("Assessment GET error:", err)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to save assessments." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { riskScore, riskClass, riskColor, summary, features, biomarkers } = body

    if (riskScore === undefined || !riskClass) {
      return NextResponse.json(
        { error: "Missing required fields: riskScore, riskClass." },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("risk_assessments")
      .insert({
        user_id: user.id,
        risk_score: riskScore,
        risk_class: riskClass,
        risk_color: riskColor || null,
        summary: summary || null,
        features: features || null,
        biomarkers: biomarkers || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Insert assessment error:", error)
      return NextResponse.json(
        { error: "Failed to save assessment." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, assessment: data })
  } catch (err) {
    console.error("Assessment POST error:", err)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
