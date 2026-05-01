import { createBrowserClient } from '@supabase/ssr'

// Placeholder URL that passes Supabase URL validation
const PLACEHOLDER_URL = 'https://placeholder-project.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk5NTI4MDAsImV4cCI6MTk2NTUyODgwMH0.placeholder'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Guard for build-time prerendering when env vars may not be available
  if (!url || !key || !url.startsWith('http')) {
    return createBrowserClient(PLACEHOLDER_URL, PLACEHOLDER_KEY)
  }

  return createBrowserClient(url, key)
}
