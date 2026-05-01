import { createClient } from '@supabase/supabase-js'

// Create a new Supabase client on each call
// This ensures environment variables are read at call time,
// not at module initialization time (critical for Vercel builds)
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Guard for build-time prerendering when env vars may not be available
  if (!url || !key) {
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createClient(url, key)
}

// Server-side client with service role key (for admin operations)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Guard for build-time prerendering
  if (!url || !key) {
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
