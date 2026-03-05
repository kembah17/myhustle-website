import { createClient } from '@supabase/supabase-js'

// Create a new Supabase client on each call
// This ensures environment variables are read at call time,
// not at module initialization time (critical for Vercel builds)
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('[Supabase] Missing env vars at call time:', { url: !!url, key: !!key })
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(url, key)
}

// Server-side client with service role key (for admin operations)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('[Supabase] Missing service role env vars:', { url: !!url, key: !!key })
    throw new Error('Missing Supabase service role environment variables')
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
