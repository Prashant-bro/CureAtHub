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
    const {
      user_id,
      full_name,
      email,
      phone,
      age,
      date_of_birth,
      gender,
      blood_group,
      avatar_url,
      profile_image,
      latest_report,
      medical_report,
    } = body

    if (!user_id) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // Build conditional payload so we don't null out existing fields
    const payload: any = {
      updated_at: new Date().toISOString(),
    }

    if (full_name !== undefined) payload.full_name = full_name
    if (email !== undefined) payload.email = email
    if (phone !== undefined) payload.phone = phone
    if (age !== undefined) payload.age = age ? parseInt(age, 10) : null
    if (date_of_birth !== undefined) payload.date_of_birth = date_of_birth
    if (gender !== undefined) payload.gender = gender
    if (blood_group !== undefined) payload.blood_group = blood_group
    if (avatar_url !== undefined) payload.avatar_url = avatar_url
    if (profile_image !== undefined) payload.profile_image = profile_image
    if (latest_report !== undefined) payload.latest_report = latest_report
    if (medical_report !== undefined) payload.medical_report = medical_report

    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: user_id,
          ...payload,
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
