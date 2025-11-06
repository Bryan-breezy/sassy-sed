import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withAuthorization } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const getStatsHandler = async (request: Request) => {
  try {
    // Execute all count queries in parallel
    const [
      productCount,
      mediaCount,
      userCount
    ] = await Promise.all([
      // Product count from database
      supabaseAdmin
        .from('Product')
        .select('id', { count: 'exact', head: true }),
      
      // Media count from Storage bucket
      supabaseAdmin.storage
        .from('uploads')
        .list(), // Lists all files in the bucket
      
      // User count from database
      supabaseAdmin
        .from('User')
        .select('id', { count: 'exact', head: true })
    ])

    // Calculate media count from bucket
    const mediaFiles = mediaCount.data || []
    const mediaFileCount = mediaFiles.length

    const stats = {
      products: { value: productCount.count || 0 },
      media: { value: mediaFileCount },
      users: { value: userCount.count || 0 },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("API Error [GET /api/admin/stats]:", error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}

export const GET = withAuthorization(getStatsHandler, ['EDITOR', 'ADMIN'])
