import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    // Authenticate user via Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    // Verify user with Supabase
    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey)
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('business_id')
    const period = parseInt(searchParams.get('period') || '30', 10)

    if (!businessId) {
      return NextResponse.json({ error: 'business_id is required' }, { status: 400 })
    }

    // Verify business ownership
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: business } = await supabase
      .from('businesses')
      .select('id, user_id')
      .eq('id', businessId)
      .single()

    if (!business || business.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Calculate date ranges
    const now = new Date()
    const currentStart = new Date(now)
    currentStart.setDate(currentStart.getDate() - period)
    const previousStart = new Date(currentStart)
    previousStart.setDate(previousStart.getDate() - period)

    const currentStartStr = currentStart.toISOString().split('T')[0]
    const previousStartStr = previousStart.toISOString().split('T')[0]
    const nowStr = now.toISOString().split('T')[0]

    // Fetch daily stats for current period
    const { data: currentDaily } = await supabase
      .from('analytics_daily')
      .select('*')
      .eq('business_id', businessId)
      .gte('date', currentStartStr)
      .lte('date', nowStr)
      .order('date', { ascending: true })

    // Fetch daily stats for previous period (for comparison)
    const { data: previousDaily } = await supabase
      .from('analytics_daily')
      .select('*')
      .eq('business_id', businessId)
      .gte('date', previousStartStr)
      .lt('date', currentStartStr)
      .order('date', { ascending: true })

    // Aggregate KPIs
    const current = (currentDaily || []).reduce(
      (acc, d) => ({
        page_views: acc.page_views + (d.page_views || 0),
        whatsapp_clicks: acc.whatsapp_clicks + (d.whatsapp_clicks || 0),
        call_clicks: acc.call_clicks + (d.call_clicks || 0),
        bookings_started: acc.bookings_started + (d.bookings_started || 0),
        bookings_completed: acc.bookings_completed + (d.bookings_completed || 0),
        search_impressions: acc.search_impressions + (d.search_impressions || 0),
        unique_visitors: acc.unique_visitors + (d.unique_visitors || 0),
      }),
      { page_views: 0, whatsapp_clicks: 0, call_clicks: 0, bookings_started: 0, bookings_completed: 0, search_impressions: 0, unique_visitors: 0 }
    )

    const previous = (previousDaily || []).reduce(
      (acc, d) => ({
        page_views: acc.page_views + (d.page_views || 0),
        whatsapp_clicks: acc.whatsapp_clicks + (d.whatsapp_clicks || 0),
        call_clicks: acc.call_clicks + (d.call_clicks || 0),
        bookings_started: acc.bookings_started + (d.bookings_started || 0),
        bookings_completed: acc.bookings_completed + (d.bookings_completed || 0),
        search_impressions: acc.search_impressions + (d.search_impressions || 0),
        unique_visitors: acc.unique_visitors + (d.unique_visitors || 0),
      }),
      { page_views: 0, whatsapp_clicks: 0, call_clicks: 0, bookings_started: 0, bookings_completed: 0, search_impressions: 0, unique_visitors: 0 }
    )

    // Fetch top search queries from raw events
    const { data: searchEvents } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('business_id', businessId)
      .eq('event_type', 'search_impression')
      .gte('created_at', currentStart.toISOString())
      .limit(500)

    // Aggregate search queries
    const queryMap = new Map<string, number>()
    ;(searchEvents || []).forEach((e) => {
      const q = (e.metadata as Record<string, string>)?.search_query
      if (q) queryMap.set(q, (queryMap.get(q) || 0) + 1)
    })
    const topQueries = Array.from(queryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, impressions: count }))

    // Fetch device split from raw events
    const { data: deviceEvents } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('business_id', businessId)
      .eq('event_type', 'page_view')
      .gte('created_at', currentStart.toISOString())
      .limit(1000)

    const deviceMap = new Map<string, number>()
    ;(deviceEvents || []).forEach((e) => {
      const device = (e.metadata as Record<string, string>)?.device || 'unknown'
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1)
    })
    const deviceSplit = Object.fromEntries(deviceMap)

    // Fetch top referrers
    const referrerMap = new Map<string, number>()
    ;(deviceEvents || []).forEach((e) => {
      const ref = (e.metadata as Record<string, string>)?.referrer || 'direct'
      const shortRef = ref === 'direct' ? 'Direct' : (() => {
        try { return new URL(ref).hostname } catch { return ref }
      })()
      referrerMap.set(shortRef, (referrerMap.get(shortRef) || 0) + 1)
    })
    const topReferrers = Array.from(referrerMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))

    return NextResponse.json({
      period,
      current,
      previous,
      daily: currentDaily || [],
      topQueries,
      deviceSplit,
      topReferrers,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
