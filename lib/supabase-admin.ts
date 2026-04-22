import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseServiceKey = process.env.SERVICE_KEY || 'placeholder-service-key'

// During build time, we allow missing environment variables to prevent build failure
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'
const isDev = process.env.NODE_ENV === 'development'

if (!isBuild && !isDev && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SERVICE_KEY)) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)