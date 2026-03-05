import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy-initialized client to ensure env vars are available at call time
let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error(`Missing Supabase env vars: URL=${!!url}, KEY=${!!key}`)
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}

// Keep backward compatibility - supabase as a getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as any)[prop]
  }
})

// Server-side client with service role key (for admin operations)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
