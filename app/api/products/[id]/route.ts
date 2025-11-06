import { NextResponse } from 'next/server'
import { withAuthorization } from '@/lib/auth'
import { getSession } from '@/lib/session'
import { supabase } from '@/lib/supabase-client'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ====================================================================
// GET: Fetch a single product (Public or Admin based on auth)
// ====================================================================
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params
    const session = await getSession()
    const isAdmin = session?.user?.role?.includes('ADMIN') || 
                    session?.user?.role?.includes('EDITOR')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    let query = supabase
      .from('Product')
      .select(`
        id,
        name,
        image,
        brand,
        category,
        subcategory,
        sizes,
        concerns,
        description,
        featured,
        published,
        createdAt,
        updatedAt,
        authorId,
        author:User(name)
      `)
      .eq('id', id)

    if (!isAdmin) {
      query = query.eq('published', true)
    }

    const { data: product, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      console.error('❌ Supabase Error fetching product:', error)
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error('❌ Server Error fetching product:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch product due to a server error' 
    }, { status: 500 })
  }
}

// ====================================================================
// PATCH: Update a product - Admin/Editor only
// ====================================================================
const updateProductHandler = async (request: Request,{ params }: { params: { id: string } }) => {
  try {
    const { id } = params


    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const body = await request.json()

    // Check if product exists first
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from('Product')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update product
    const { data: updatedProduct, error } = await supabaseAdmin
      .from('Product')
      .update({
        name: body.name,
        brand: body.brand,
        category: body.category,
        subcategory: body.subcategory,
        image: body.image,
        sizes: body.sizes,
        concerns: body.concerns,
        description: body.description,
        featured: body.featured,
        published: body.published, // Admin can control publishing
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        author:User(name)
      `)
      .single()

    if (error) {
      console.error(`❌ Supabase Error updating product ${id}:`, error)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(`❌ Server Error updating product:`, error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// ====================================================================
// DELETE: Delete a product - Admin only
// ====================================================================
const deleteProductHandler = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists first
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from('Product')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete product
    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`❌ Supabase Error deleting product ${id}:`, error)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 }) // Success, No Content
  } catch (error) {
    console.error(`❌ Server Error deleting product:`, error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

// ====================================================================
// Export Route Handlers with Authorization
// ====================================================================

// GET is exported directly (public access with admin features)
// PATCH and DELETE require authorization
export const PATCH = withAuthorization(updateProductHandler, ['ADMIN', 'EDITOR'])
export const DELETE = withAuthorization(deleteProductHandler, ['ADMIN'])
