import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs" // ensure file upload compatibility

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const fileName = `${Date.now()}-${file.name}`

    // Upload file to the "media" bucket
    const { data, error } = await supabaseAdmin.storage
      .from("uploads")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) throw error

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("uploads")
      .getPublicUrl(fileName)

    const mediaFile = {
      name: fileName,
      url: publicUrlData.publicUrl,
      size: file.size,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(mediaFile)
  } catch (error: any) {
    console.error("Upload Error:", error.message)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
