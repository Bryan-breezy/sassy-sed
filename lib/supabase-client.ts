import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
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