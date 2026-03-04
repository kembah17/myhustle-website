import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// POST: Verify OTP for tier 1 phone verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_id, otp_code } = body

    if (!business_id || !otp_code) {
      return NextResponse.json(
        { error: 'business_id and otp_code are required' },
        { status: 400 }
      )
    }

    // Simulated OTP verification - accept '123456' as valid
    if (otp_code !== '123456') {
      return NextResponse.json(
        { error: 'Invalid OTP code. Please try again.' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Find the pending tier 1 verification request
    const { data: verRequest, error: reqError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('business_id', business_id)
      .eq('requested_tier', 1)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (reqError || !verRequest) {
      return NextResponse.json(
        { error: 'No pending phone verification request found' },
        { status: 404 }
      )
    }

    // Update the verification request to approved
    const { error: updateReqError } = await supabase
      .from('verification_requests')
      .update({
        status: 'approved',
        otp_verified: true,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', verRequest.id)

    if (updateReqError) {
      console.error('Update request error:', updateReqError)
      return NextResponse.json(
        { error: 'Failed to update verification request' },
        { status: 500 }
      )
    }

    // Update the business: set verification_tier to 1, verified to true, verification_date
    const { error: updateBizError } = await supabase
      .from('businesses')
      .update({
        verification_tier: 1,
        verified: true,
        verification_phone: verRequest.phone_number,
        verification_date: new Date().toISOString(),
      })
      .eq('id', business_id)

    if (updateBizError) {
      console.error('Update business error:', updateBizError)
      return NextResponse.json(
        { error: 'Failed to update business verification status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Phone verified successfully! Your business is now Tier 1 verified.',
      verification_tier: 1,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
