import { NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")
  const brand = searchParams.get("brand")
  const search = searchParams.get("search")

  try {
    let query = supabaseAdmin
      .from('Product')
      .select(`
        *,
        User:authorId(name)
      `)
      .eq('published', true)

    if (category && category.trim()) {
      query = query.ilike('category', `%${category}%`)
    }

    if (brand && brand.trim()) {
      query = query.ilike('brand', `%${brand}%`)
    }

    if (featured === "true") {
      query = query.eq('featured', true)
    }

    if (search && search.trim()) {
      query = query.or(
        `name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%,subcategory.ilike.%${search}%`
      )
    }

    query = query.order('createdAt', { ascending: false })

    const { data: products, error } = await query

    if (error) {
      console.error("❌ Supabase Fetch Products Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("❌ Fetch Products Error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
