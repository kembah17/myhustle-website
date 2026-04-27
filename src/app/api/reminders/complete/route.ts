import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * POST /api/reminders/complete
 * 
 * Called when a user successfully creates a business listing.
 * Updates has_business = true and completed_at = now() to stop all future reminders.
 * 
 * Expected body:
 * {
 *   "user_id": "uuid"
 * }
 * 
 * Can be called from the client-side onboarding flow (no auth required for this
 * specific endpoint since it only marks reminders as complete, not destructive).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = body.user_id

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: user_id' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Update the reminder record to mark business as completed
    const { data, error } = await supabase
      .from('user_reminders')
      .update({
        has_business: true,
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('has_business', false) // Only update if not already completed
      .select('id')

    if (error) {
      console.error('[Reminders/Complete] Update error:', error)
      // Don't fail the business creation flow — log and return success
      return NextResponse.json({
        success: true,
        message: 'Reminder update failed but business creation should proceed',
        warning: error.message,
      })
    }

    const updated = data && data.length > 0
    console.log(`[Reminders/Complete] User ${userId}: ${updated ? 'reminders stopped' : 'no pending reminders found'}`)

    return NextResponse.json({
      success: true,
      updated,
      message: updated ? 'Reminders stopped — congratulations on listing!' : 'No pending reminders to stop',
    })
  } catch (err) {
    console.error('[Reminders/Complete] Error:', err)
    // Never block the business creation flow
    return NextResponse.json({
      success: true,
      message: 'Reminder completion noted',
      warning: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}
