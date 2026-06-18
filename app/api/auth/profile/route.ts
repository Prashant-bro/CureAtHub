import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, full_name, email, phone, age, date_of_birth, gender, blood_group } = body

    if (!user_id) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: user_id,
          full_name: full_name || null,
          email: email || null,
          phone: phone || null,
          age: age ? parseInt(age, 10) : null,
          date_of_birth: date_of_birth || null,
          gender: gender || null,
          blood_group: blood_group || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )

    if (error) {
      console.error("Profile upsert error:", error)
      return NextResponse.json(
        { error: "Unable to save profile. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Profile Endpoint Error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
