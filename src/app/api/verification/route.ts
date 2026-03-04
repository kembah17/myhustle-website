import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET: Fetch verification status and requests for a business
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('business_id')

  if (!businessId) {
    return NextResponse.json({ error: 'business_id is required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Fetch business verification status
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('id, verification_tier, verification_phone, verification_date, verified')
    .eq('id', businessId)
    .single()

  if (bizError || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  // Fetch all verification requests for this business
  const { data: requests, error: reqError } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('business_id', businessId)
    .order('submitted_at', { ascending: false })

  if (reqError) {
    return NextResponse.json({ error: 'Failed to fetch verification requests' }, { status: 500 })
  }

  return NextResponse.json({
    business: {
      id: business.id,
      verification_tier: business.verification_tier ?? 0,
      verification_phone: business.verification_phone,
      verification_date: business.verification_date,
      verified: business.verified,
    },
    requests: requests || [],
  })
}

// POST: Submit a verification request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_id, requested_tier, phone_number, document_type, business_name_on_doc, registration_number } = body

    if (!business_id || !requested_tier) {
      return NextResponse.json({ error: 'business_id and requested_tier are required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check business exists
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id, verification_tier')
      .eq('id', business_id)
      .single()

    if (bizError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check tier progression (must complete previous tiers first)
    const currentTier = business.verification_tier ?? 0
    if (requested_tier > currentTier + 1) {
      return NextResponse.json(
        { error: `Must complete tier ${currentTier + 1} before requesting tier ${requested_tier}` },
        { status: 400 }
      )
    }

    // Check for existing pending request at this tier
    const { data: existingPending } = await supabase
      .from('verification_requests')
      .select('id')
      .eq('business_id', business_id)
      .eq('requested_tier', requested_tier)
      .eq('status', 'pending')
      .maybeSingle()

    if (existingPending) {
      return NextResponse.json(
        { error: 'A pending request already exists for this tier' },
        { status: 409 }
      )
    }

    // Build request data based on tier
    const requestData: Record<string, unknown> = {
      business_id,
      requested_tier,
      status: 'pending',
    }

    if (requested_tier === 1 && phone_number) {
      requestData.phone_number = phone_number
      requestData.otp_verified = false
    }

    if (requested_tier === 2) {
      if (document_type) requestData.document_type = document_type
      if (business_name_on_doc) requestData.business_name_on_doc = business_name_on_doc
      if (registration_number) requestData.registration_number = registration_number
    }

    // Insert verification request
    const { data: newRequest, error: insertError } = await supabase
      .from('verification_requests')
      .insert(requestData)
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create verification request' }, { status: 500 })
    }

    // For tier 1, simulate sending OTP (in production, integrate SMS provider)
    if (requested_tier === 1) {
      return NextResponse.json({
        request: newRequest,
        message: 'OTP sent to your phone number. Use code 123456 for testing.',
      })
    }

    return NextResponse.json({
      request: newRequest,
      message: 'Verification request submitted successfully.',
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
