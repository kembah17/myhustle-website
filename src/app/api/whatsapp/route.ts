import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, createServiceClient } from '@/lib/supabase'

// In-memory rate limiting (resets on server restart — fine for future-ready endpoint)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return true
  }

  return false
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * GET /api/whatsapp
 * Webhook verification endpoint (required by Meta WhatsApp Business API).
 * Meta sends a GET request with hub.mode, hub.verify_token, and hub.challenge.
 * We verify the token and respond with the challenge to confirm the webhook.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'myhustle_webhook_verify_token'

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json(
    { error: 'Verification failed' },
    { status: 403 }
  )
}

/**
 * POST /api/whatsapp
 * Receives WhatsApp Business API webhook events or manual business data submissions.
 *
 * Expected body for manual submission:
 * {
 *   "business_name": string (required),
 *   "description": string,
 *   "category": string,
 *   "location": string,
 *   "phone": string (required),
 *   "whatsapp": string,
 *   "email": string,
 *   "source": "whatsapp" | "manual"
 * }
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.business_name || typeof body.business_name !== 'string' || body.business_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'business_name is required' },
        { status: 400 }
      )
    }

    if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length === 0) {
      return NextResponse.json(
        { error: 'phone is required' },
        { status: 400 }
      )
    }

    // Sanitize and prepare data
    const submissionData = {
      business_name: body.business_name.trim().slice(0, 200),
      description: (body.description || '').trim().slice(0, 1000),
      category: (body.category || '').trim().slice(0, 100),
      location: (body.location || '').trim().slice(0, 200),
      phone: body.phone.trim().slice(0, 20),
      whatsapp: (body.whatsapp || body.phone || '').trim().slice(0, 20),
      email: (body.email || '').trim().slice(0, 200),
      source: body.source === 'whatsapp' ? 'whatsapp' : 'manual',
      ip_address: ip,
      submitted_at: new Date().toISOString(),
      status: 'pending',
      raw_payload: JSON.stringify(body).slice(0, 5000),
    }

    // Store in Supabase
    const { error: dbError } = await getSupabase()
      .from('whatsapp_submissions')
      .insert(submissionData)

    if (dbError) {
      // If table doesn't exist yet, log and return success anyway
      // This is a future-ready endpoint
      console.error('WhatsApp submission storage error:', dbError.message)

      // Still return success — we don't want to block the webhook
      return NextResponse.json({
        success: true,
        message: 'Submission received. We will set up your listing shortly.',
        note: 'Storage pending — table setup required.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Submission received! We will set up your business listing and notify you when it is live.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body. Please send valid JSON.' },
      { status: 400 }
    )
  }
}
