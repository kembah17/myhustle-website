import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, '')
  if (cleaned.startsWith('+234')) cleaned = '0' + cleaned.slice(4)
  if (cleaned.startsWith('234')) cleaned = '0' + cleaned.slice(3)
  return cleaned
}

function maskPhone(phone: string): string {
  const normalized = normalizePhone(phone)
  if (normalized.length < 6) return '****'
  return normalized.slice(0, 3) + '****' + normalized.slice(-4)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { business_id, phone_entered } = body

    if (!business_id || !phone_entered) {
      return NextResponse.json(
        { error: 'Business ID and phone number are required.' },
        { status: 400 }
      )
    }

    // Get authenticated user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'You must be logged in to claim a business.' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication. Please log in again.' },
        { status: 401 }
      )
    }

    // Fetch business phone
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id, phone, user_id')
      .eq('id', business_id)
      .single()

    if (bizError || !business) {
      return NextResponse.json(
        { error: 'Business not found.' },
        { status: 404 }
      )
    }

    if (business.user_id) {
      return NextResponse.json(
        { error: 'This business has already been claimed.' },
        { status: 400 }
      )
    }

    // Check if this phone has already been used to claim a business (approved)
    const normalizedEntered = normalizePhone(phone_entered)
    const { data: existingApproved } = await supabase
      .from('claim_attempts')
      .select('id')
      .eq('phone_entered', normalizedEntered)
      .eq('status', 'approved')
      .limit(1)

    if (existingApproved && existingApproved.length > 0) {
      return NextResponse.json(
        { error: 'This phone number has already been used to claim another business.' },
        { status: 400 }
      )
    }

    // Check if user already has a pending claim for this business
    const { data: existingPending } = await supabase
      .from('claim_attempts')
      .select('id, status')
      .eq('business_id', business_id)
      .eq('user_id', user.id)
      .in('status', ['pending', 'approved'])
      .limit(1)

    if (existingPending && existingPending.length > 0) {
      const status = existingPending[0].status
      return NextResponse.json(
        { error: status === 'approved'
          ? 'You have already claimed this business.'
          : 'You already have a pending claim for this business.'
        },
        { status: 400 }
      )
    }

    // Compare entered phone with business phone
    const businessPhone = normalizePhone(business.phone || '')
    const phoneMatched = normalizedEntered === businessPhone && businessPhone.length > 0

    const claimId = crypto.randomUUID()
    const { error: insertError } = await supabase
      .from('claim_attempts')
      .insert({
        id: claimId,
        business_id,
        user_id: user.id,
        phone_entered: normalizedEntered,
        phone_matched: phoneMatched,
        claim_method: phoneMatched ? 'phone_match' : 'dispute',
        status: 'pending',
      })

    if (insertError) {
      console.error('Claim insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit claim. Please try again.' },
        { status: 500 }
      )
    }

    if (phoneMatched) {
      return NextResponse.json({
        matched: true,
        claim_id: claimId,
        message: 'Phone matched! OTP will be sent for verification. Your claim has been submitted for review.',
      })
    } else {
      return NextResponse.json({
        matched: false,
        claim_id: claimId,
        message: 'Phone does not match. You can submit documents to prove ownership.',
      })
    }
  } catch (err) {
    console.error('Claim API error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('business_id')

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required.' },
        { status: 400 }
      )
    }

    // Fetch business phone for masking
    const { data: business } = await supabase
      .from('businesses')
      .select('phone, user_id')
      .eq('id', businessId)
      .single()

    const maskedPhone = business?.phone ? maskPhone(business.phone) : null

    // Get authenticated user claims
    const authHeader = request.headers.get('authorization')
    let claims: any[] = []

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)

      if (user) {
        const { data: userClaims } = await supabase
          .from('claim_attempts')
          .select('id, status, phone_matched, claim_method, document_url, document_type, created_at')
          .eq('business_id', businessId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        claims = userClaims || []
      }
    }

    return NextResponse.json({
      masked_phone: maskedPhone,
      is_claimed: !!business?.user_id,
      claims,
    })
  } catch (err) {
    console.error('Claim GET error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
