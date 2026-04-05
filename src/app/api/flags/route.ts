import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const VALID_FLAG_TYPES = [
  'spam',
  'incorrect_info',
  'closed',
  'inappropriate',
  'duplicate',
  'inactive',
  'phone_invalid',
  'quality_concern',
] as const

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()
    const { business_id, flag_type, details } = body

    if (!business_id || !flag_type) {
      return NextResponse.json(
        { error: 'Business ID and flag type are required.' },
        { status: 400 }
      )
    }

    if (!VALID_FLAG_TYPES.includes(flag_type)) {
      return NextResponse.json(
        { error: 'Invalid flag type.' },
        { status: 400 }
      )
    }

    // Get authenticated user (optional - allow anonymous reports)
    let userId: string | null = null
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) userId = user.id
    }

    // Check for duplicate report from same user
    if (userId) {
      const { data: existing } = await supabase
        .from('listing_flags')
        .select('id')
        .eq('business_id', business_id)
        .eq('reporter_id', userId)
        .eq('flag_type', flag_type)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'You have already reported this issue for this listing.' },
          { status: 400 }
        )
      }
    }

    // Verify business exists
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id, active')
      .eq('id', business_id)
      .single()

    if (bizError || !business) {
      return NextResponse.json(
        { error: 'Business not found.' },
        { status: 404 }
      )
    }

    // Insert flag
    const flagId = crypto.randomUUID()
    const { error: insertError } = await supabase
      .from('listing_flags')
      .insert({
        id: flagId,
        business_id,
        flag_type,
        source: 'user_report',
        reporter_id: userId,
        details: details || null,
        status: 'open',
      })

    if (insertError) {
      console.error('Flag insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit report. Please try again.' },
        { status: 500 }
      )
    }

    // Check auto-flag rules
    let autoAction: string | null = null

    // Count total unique reporters for this business (any flag type)
    const { count: totalFlagCount } = await supabase
      .from('listing_flags')
      .select('reporter_id', { count: 'exact', head: true })
      .eq('business_id', business_id)
      .eq('status', 'open')
      .not('reporter_id', 'is', null)

    // Count distinct reporters using a different approach
    const { data: allFlags } = await supabase
      .from('listing_flags')
      .select('reporter_id, flag_type')
      .eq('business_id', business_id)
      .eq('status', 'open')

    const uniqueReporters = new Set(
      (allFlags || []).filter(f => f.reporter_id).map(f => f.reporter_id)
    )

    // Rule a: 3+ different reporters total -> auto-hide
    if (uniqueReporters.size >= 3 && business.active) {
      autoAction = 'hidden'
      await supabase
        .from('businesses')
        .update({ active: false })
        .eq('id', business_id)

      // Update all open flags for this business
      await supabase
        .from('listing_flags')
        .update({ auto_action_taken: 'hidden' })
        .eq('business_id', business_id)
        .eq('status', 'open')
    } else {
      // Rule c: 2+ 'closed' flags -> mark as closed
      const closedFlags = (allFlags || []).filter(f => f.flag_type === 'closed')
      const uniqueClosedReporters = new Set(
        closedFlags.filter(f => f.reporter_id).map(f => f.reporter_id)
      )

      if (uniqueClosedReporters.size >= 2) {
        autoAction = 'marked_closed'
        await supabase
          .from('listing_flags')
          .update({ auto_action_taken: 'marked_closed' })
          .eq('business_id', business_id)
          .eq('flag_type', 'closed')
          .eq('status', 'open')
      }

      // Rule b: 1+ 'incorrect_info' -> add banner
      const infoFlags = (allFlags || []).filter(f => f.flag_type === 'incorrect_info')
      if (infoFlags.length >= 1 && !autoAction) {
        autoAction = 'banner_added'
        await supabase
          .from('listing_flags')
          .update({ auto_action_taken: 'banner_added' })
          .eq('business_id', business_id)
          .eq('flag_type', 'incorrect_info')
          .eq('status', 'open')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your report. We will review this listing.',
      auto_action: autoAction,
    })
  } catch (err) {
    console.error('Flag API error:', err)
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

    // Get authenticated user's flags
    let userFlags: any[] = []
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)

      if (user) {
        const { data: flags } = await supabase
          .from('listing_flags')
          .select('id, flag_type, status, created_at')
          .eq('business_id', businessId)
          .eq('reporter_id', user.id)

        userFlags = flags || []
      }
    }

    // Get total flag count
    const { count } = await supabase
      .from('listing_flags')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('status', 'open')

    return NextResponse.json({
      user_flags: userFlags,
      total_flags: count || 0,
    })
  } catch (err) {
    console.error('Flag GET error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
