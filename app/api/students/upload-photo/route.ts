import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const regNumber = formData.get("regNumber") as string
    if (!file || !regNumber) {
      return NextResponse.json({ error: "Missing file or regNumber" }, { status: 400 })
    }
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${regNumber}_${uuidv4()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filename)
    const publicUrl = publicUrlData?.publicUrl
    if (!publicUrl) {
      console.error("Supabase publicUrl error: No public URL returned")
      return NextResponse.json({ error: "Failed to get public URL from Supabase" }, { status: 500 })
    }
    return NextResponse.json({ filename, url: publicUrl })
  } catch (err: any) {
    console.error("API error:", err)
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
