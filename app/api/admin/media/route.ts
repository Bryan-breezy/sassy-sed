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
  try {
    console.log("📨 POST request received");
    
    const formData = await req.formData();
    console.log("📋 FormData parsed");
    
    const file = formData.get("file") as File;
    console.log("📄 File retrieved:", file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : "No file found");

    if (!file) {
      console.log("❌ No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("🚀 Starting Supabase upload...");
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(file.name, file, { upsert: true });

    if (error) {
      console.error("❌ Supabase Upload Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Upload successful:", data);
    return NextResponse.json({ success: true, file: data });

  } catch (error) {
    console.error("💥 Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
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
