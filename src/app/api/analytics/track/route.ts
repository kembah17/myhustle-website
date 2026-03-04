import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const ALLOWED_EVENT_TYPES = [
  'page_view',
  'whatsapp_click',
  'call_click',
  'booking_started',
  'booking_completed',
  'search_impression',
  'review_read',
]

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(visitorId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(visitorId)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(visitorId, { count: 1, resetAt: now + 60_000 })
    return false
  }
  entry.count++
  if (entry.count > 100) return true
  return false
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 60_000)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_id, event_type, metadata, visitor_id } = body

    // Validate required fields
    if (!business_id || !event_type) {
      return NextResponse.json(
        { error: 'business_id and event_type are required' },
        { status: 400 }
      )
    }

    // Validate event type
    if (!ALLOWED_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type. Allowed: ${ALLOWED_EVENT_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Rate limit check
    const vid = visitor_id || 'anonymous'
    if (isRateLimited(vid)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Insert event
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { error } = await supabase.from('analytics_events').insert({
      business_id,
      event_type,
      metadata: metadata || {},
      visitor_id: vid,
    })

    if (error) {
      console.error('Track event error:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Track API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
