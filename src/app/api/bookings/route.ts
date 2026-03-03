import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(phone: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 5

  const entry = rateLimitMap.get(phone)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(phone, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

function validateNigerianPhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')
  // 0XX XXXX XXXX (11 digits starting with 0)
  if (/^0[7-9][01]\d{8}$/.test(cleaned)) return true
  // +234 XX XXXX XXXX (14 chars starting with +234)
  if (/^\+234[7-9][01]\d{8}$/.test(cleaned)) return true
  // 234 XX XXXX XXXX (13 digits starting with 234)
  if (/^234[7-9][01]\d{8}$/.test(cleaned)) return true
  return false
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { business_id, customer_name, customer_phone, service, date, time, notes } = body

    // Validate required fields
    if (!business_id || !customer_name || !customer_phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: business_id, customer_name, customer_phone, date, time' },
        { status: 400 }
      )
    }

    // Validate customer name
    if (typeof customer_name !== 'string' || customer_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid name (at least 2 characters)' },
        { status: 400 }
      )
    }

    // Validate phone format
    if (!validateNigerianPhone(customer_phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Nigerian phone number (e.g. 08012345678)' },
        { status: 400 }
      )
    }

    // Validate notes length
    if (notes && typeof notes === 'string' && notes.length > 200) {
      return NextResponse.json(
        { error: 'Notes must be 200 characters or less' },
        { status: 400 }
      )
    }

    // Rate limit check
    const cleanedPhone = customer_phone.replace(/[\s-]/g, '')
    if (!checkRateLimit(cleanedPhone)) {
      return NextResponse.json(
        { error: 'Too many booking requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Insert booking using service role client
    const supabase = createServiceClient()

    // Verify business exists
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('id', business_id)
      .single()

    if (bizError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Insert booking
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        business_id,
        customer_name: customer_name.trim(),
        customer_phone: cleanedPhone,
        service: service?.trim() || null,
        date,
        time,
        notes: notes?.trim() || null,
        status: 'pending',
        source: 'website',
      })
      .select('id, status, created_at')
      .single()

    if (insertError) {
      console.error('Booking insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create booking. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        status: booking.status,
        created_at: booking.created_at,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
