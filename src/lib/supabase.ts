import { createClient } from '@supabase/supabase-js'

// Placeholder values that pass Supabase validation
const PLACEHOLDER_URL = 'https://placeholder-project.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk5NTI4MDAsImV4cCI6MTk2NTUyODgwMH0.placeholder'

// Create a new Supabase client on each call
// This ensures environment variables are read at call time,
// not at module initialization time (critical for Vercel builds)
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || !url.startsWith('http')) {
    return createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY)
  }

  return createClient(url, key)
}

// Server-side client with service role key (for admin operations)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key || !url.startsWith('http')) {
    return createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
