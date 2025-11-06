import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const BUCKET = "uploads"

export async function GET() {
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).list()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 }) 
  }

  if (!data) return NextResponse.json([])

  const files = data
    .map((file) => {
      const fileName = file.name
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`

      return {
        // file.id is often null from list(), so file.name is the correct unique identifier
        id: fileName, 
        name: fileName,
        url: fileUrl,
        size: file.metadata?.size || 0,
        createdAt: file.created_at || new Date().toISOString(),
        author: { name: "Admin" },
      }
    })
  
  return NextResponse.json(files)
}

// --- POST: Upload new media ---
export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  
  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(file.name, file, { upsert: true })

  if (error) {
    console.error("Supabase Upload Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Supabase returns { path: 'file.name', id: 'uuid' } on success
  return NextResponse.json({ success: true, file: data })
}

// --- DELETE: Remove file from storage ---
export async function DELETE(req: Request) {
  const { name } = await req.json()

  if (!name)
    return NextResponse.json({ error: "Missing file name" }, { status: 400 })

  // .remove() expects the path relative to the bucket.
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([name])

  if (error) {
    console.error("Supabase Delete Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}