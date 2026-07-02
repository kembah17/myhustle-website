/**
 * WhatsApp flow management.
 * GET  — List flows (admin-only).
 * POST — Trigger a new flow (admin-only or internal).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { createFlow } from '@/lib/whatsapp/flows'

async function checkAdmin(request: NextRequest) {
  const supabase = createServiceClient()
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' ? user : null
}

export async function GET(request: NextRequest) {
  const user = await checkAdmin(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const flowType = searchParams.get('flow_type')
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  let query = supabase
    .from('whatsapp_flows')
    .select('*, businesses(name, slug)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  if (flowType) query = query.eq('flow_type', flowType)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ flows: data || [] })
}

export async function POST(request: NextRequest) {
  // Check for admin auth or internal API key
  const apiKey = request.headers.get('x-api-key')
  const isInternal = apiKey === process.env.WHATSAPP_VERIFY_TOKEN

  if (!isInternal) {
    const user = await checkAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const body = await request.json()
  const { businessId, flowType, phone, data, delayHours } = body as {
    businessId?: string
    flowType: string
    phone: string
    data?: Record<string, unknown>
    delayHours?: number
  }

  if (!flowType || !phone) {
    return NextResponse.json({ error: 'Missing flowType or phone' }, { status: 400 })
  }

  const flowId = await createFlow({
    businessId,
    flowType,
    phone,
    data,
    delayHours,
  })

  if (!flowId) {
    return NextResponse.json({ error: 'Failed to create flow' }, { status: 500 })
  }

  return NextResponse.json({ success: true, flowId })
}
