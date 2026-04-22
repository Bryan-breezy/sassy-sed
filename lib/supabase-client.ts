import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// During build time, we allow missing environment variables to prevent build failure
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'
const isDev = process.env.NODE_ENV === 'development'

if (!isBuild && !isDev && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey,
    {
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, signal: AbortSignal.timeout(30000) }) // 30 seconds
      },
    },
  }
)

export function getSupabaseImageUrl(bucket: string, path: string): string | null {
  if (!bucket || !path) return null

  let cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  if (cleanPath.startsWith(`${bucket}/`)) {
    cleanPath = cleanPath.replace(`${bucket}/`, '')
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(cleanPath)

  return data?.publicUrl || null
}