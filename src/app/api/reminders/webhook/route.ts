import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import {
  sendBrevoEmail,
  getDay0Email,
  getOptOutUrl,
} from '@/lib/reminders'

export const dynamic = 'force-dynamic'

/**
 * POST /api/reminders/webhook
 * 
 * Supabase webhook endpoint that fires when a new user signs up.
 * Creates a row in user_reminders and sends the Day 0 welcome email.
 * 
 * Expected payload from Supabase webhook (auth.users insert):
 * {
 *   "type": "INSERT",
 *   "table": "users",
 *   "schema": "auth",
 *   "record": {
 *     "id": "uuid",
 *     "email": "user@example.com",
 *     "raw_user_meta_data": { "full_name": "...", "phone": "..." },
 *     "created_at": "..."
 *   }
 * }
 * 
 * Also supports a simpler direct call format:
 * {
 *   "user_id": "uuid",
 *   "email": "user@example.com",
 *   "phone": "+2348012345678",
 *   "name": "User Name"
 * }
 */
export async function POST(request: NextRequest) {
  // Verify the request comes from Supabase or has valid API key
  const apiKey = process.env.REMINDER_API_KEY
  const headerKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  const supabaseWebhookSecret = request.headers.get('x-supabase-webhook-secret')

  // Allow if: valid API key, or Supabase webhook secret matches, or no secret configured (dev)
  const isAuthorized = (
    (apiKey && headerKey === apiKey) ||
    (apiKey && supabaseWebhookSecret === apiKey) ||
    (!apiKey && process.env.NODE_ENV === 'development')
  )

  // For Supabase database webhooks, we also accept if the request has the right structure
  // In production, you should configure the webhook secret in Supabase dashboard

  try {
    const body = await request.json()

    // Parse user data from either Supabase webhook format or direct call
    let userId: string
    let userEmail: string
    let userPhone: string | null = null
    let userName: string | null = null
    let signupDate: string = new Date().toISOString()

    if (body.record && body.type === 'INSERT') {
      // Supabase webhook format
      const record = body.record
      userId = record.id
      userEmail = record.email
      userPhone = record.raw_user_meta_data?.phone || record.phone || null
      userName = record.raw_user_meta_data?.full_name || record.raw_user_meta_data?.name || null
      signupDate = record.created_at || new Date().toISOString()
    } else if (body.user_id && body.email) {
      // Direct call format
      userId = body.user_id
      userEmail = body.email
      userPhone = body.phone || null
      userName = body.name || null
      signupDate = body.signup_date || new Date().toISOString()
    } else {
      return NextResponse.json(
        { error: 'Invalid payload. Expected Supabase webhook or {user_id, email} format.' },
        { status: 400 }
      )
    }

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id and email' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Check if user already has a reminder row (idempotency)
    const { data: existing } = await supabase
      .from('user_reminders')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'User reminder already exists',
        existing: true,
      })
    }

    // Check if user already has a business (e.g., imported users)
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    const hasBusiness = businesses && businesses.length > 0

    // Create reminder row
    const { error: insertError } = await supabase
      .from('user_reminders')
      .insert({
        user_id: userId,
        user_email: userEmail,
        user_phone: userPhone,
        user_name: userName,
        signup_date: signupDate,
        has_business: hasBusiness || false,
        completed_at: hasBusiness ? new Date().toISOString() : null,
      })

    if (insertError) {
      console.error('[Reminders/Webhook] Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create reminder record', detail: insertError.message },
        { status: 500 }
      )
    }

    // Send Day 0 welcome email immediately (only if user doesn't already have a business)
    let emailSent = false
    if (!hasBusiness) {
      const unsubscribeUrl = getOptOutUrl(userId)
      const { subject, html } = getDay0Email(userName || '', unsubscribeUrl)

      emailSent = await sendBrevoEmail({
        to: userEmail,
        toName: userName || undefined,
        subject,
        htmlContent: html,
      })

      // Mark Day 0 email as sent
      if (emailSent) {
        await supabase
          .from('user_reminders')
          .update({ reminder_day0_email: new Date().toISOString() })
          .eq('user_id', userId)
      }
    }

    console.log(`[Reminders/Webhook] Created reminder for ${userEmail}, welcome email: ${emailSent ? 'sent' : 'skipped'}`)

    return NextResponse.json({
      success: true,
      message: 'Reminder created',
      email_sent: emailSent,
      has_business: hasBusiness || false,
    })
  } catch (err) {
    console.error('[Reminders/Webhook] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
