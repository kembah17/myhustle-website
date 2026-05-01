import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Placeholder values that pass Supabase validation
const PLACEHOLDER_URL = 'https://placeholder-project.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk5NTI4MDAsImV4cCI6MTk2NTUyODgwMH0.placeholder'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Guard for build-time prerendering when env vars may not be available
  if (!url || !key || !url.startsWith('http')) {
    return createServerClient(PLACEHOLDER_URL, PLACEHOLDER_KEY, {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    })
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  })
}
