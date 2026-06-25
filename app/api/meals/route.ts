import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Meal Logs API
 * GET  — fetch meal logs for the authenticated user
 * POST — save a new meal log
 */

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to view meal logs." },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("scanned_at", { ascending: false })

    if (error) {
      console.error("Fetch meal logs error:", error)
      return NextResponse.json(
        { error: "Failed to load meal logs." },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Meal logs GET error:", err)
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
        { error: "Please sign in to save meal logs." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { food_name, calories, protein, carbs, fat, fiber, diabetes_friendly } = body

    if (!food_name) {
      return NextResponse.json(
        { error: "Food name is required." },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("meal_logs")
      .insert({
        user_id: user.id,
        food_name,
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        fiber: Number(fiber) || 0,
        diabetes_friendly: diabetes_friendly !== false,
      })
      .select()
      .single()

    if (error) {
      console.error("Insert meal log error:", error)
      return NextResponse.json(
        { error: "Failed to save meal log." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, meal: data })
  } catch (err) {
    console.error("Meal log POST error:", err)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
