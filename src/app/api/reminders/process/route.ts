import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import {
  type UserReminder,
  getNextPendingReminder,
  sendReminder,
} from '@/lib/reminders'

// Vercel cron jobs send a GET request
// Also support POST for manual triggering
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60s for processing

function verifyAuth(request: NextRequest): boolean {
  const apiKey = process.env.REMINDER_API_KEY
  if (!apiKey) {
    console.warn('[Reminders/Process] REMINDER_API_KEY not set — allowing request in dev mode')
    return process.env.NODE_ENV === 'development'
  }

  // Check header
  const headerKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  if (headerKey === apiKey) return true

  // Check query param (for Vercel cron)
  const queryKey = request.nextUrl.searchParams.get('key')
  if (queryKey === apiKey) return true

  // Vercel cron sends this header
  const cronSecret = request.headers.get('x-vercel-cron')
  if (cronSecret) return true

  return false
}

async function processReminders(): Promise<{ processed: number; sent: number; errors: number; skipped: number }> {
  const supabase = createServiceClient()
  const stats = { processed: 0, sent: 0, errors: 0, skipped: 0 }

  // Fetch all users who:
  // - haven't listed a business
  // - haven't opted out
  // - signed up within the last 31 days (no point checking older)
  const thirtyOneDaysAgo = new Date()
  thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31)

  const { data: users, error } = await supabase
    .from('user_reminders')
    .select('*')
    .eq('has_business', false)
    .eq('opted_out', false)
    .gte('signup_date', thirtyOneDaysAgo.toISOString())
    .order('signup_date', { ascending: true })
    .limit(200) // Process in batches to stay within timeout

  if (error) {
    console.error('[Reminders/Process] Query error:', error)
    throw new Error(`Database query failed: ${error.message}`)
  }

  if (!users || users.length === 0) {
    console.log('[Reminders/Process] No pending users found')
    return stats
  }

  console.log(`[Reminders/Process] Found ${users.length} users to check`)

  for (const user of users as UserReminder[]) {
    stats.processed++

    const pending = getNextPendingReminder(user)
    if (!pending) {
      stats.skipped++
      continue
    }

    try {
      const sent = await sendReminder(pending)
      if (sent) {
        stats.sent++
        console.log(`[Reminders/Process] Sent day${pending.day} ${pending.channel} to ${user.user_email}`)
      } else {
        stats.skipped++
        console.log(`[Reminders/Process] Skipped day${pending.day} ${pending.channel} for ${user.user_email} (send returned false)`)
      }
    } catch (err) {
      stats.errors++
      console.error(`[Reminders/Process] Error sending to ${user.user_email}:`, err)
    }
  }

  return stats
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await processReminders()
    return NextResponse.json({
      success: true,
      ...stats,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Reminders/Process] Fatal error:', err)
    return NextResponse.json(
      { error: 'Processing failed', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
