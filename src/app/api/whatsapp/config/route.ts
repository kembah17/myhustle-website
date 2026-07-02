/**
 * WhatsApp configuration management (admin-only).
 * GET  — Retrieve current config.
 * POST — Create or update config.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { clearConfigCache, verifyPhoneNumber } from '@/lib/whatsapp/meta-api'

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
  const { data, error } = await supabase
    .from('whatsapp_config')
    .select('id, phone_number_id, waba_id, display_phone, business_name, is_active, verify_token, created_at, updated_at')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    config: data || null,
    hasEnvFallback: !!(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN),
  })
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { phone_number_id, waba_id, access_token, verify_token, business_name } = body as {
    phone_number_id: string
    waba_id: string
    access_token: string
    verify_token?: string
    business_name?: string
  }

  if (!phone_number_id || !waba_id || !access_token) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify the phone number with Meta
  try {
    const phoneInfo = await verifyPhoneNumber({ phoneNumberId: phone_number_id, accessToken: access_token })

    const supabase = createServiceClient()

    // Upsert — deactivate existing, insert new
    await supabase.from('whatsapp_config').update({ is_active: false }).eq('is_active', true)

    const { data, error } = await supabase
      .from('whatsapp_config')
      .insert({
        phone_number_id,
        waba_id,
        access_token,
        verify_token: verify_token || 'myhustle_webhook_verify',
        display_phone: phoneInfo.display_phone_number || '',
        business_name: business_name || 'MyHustle',
        is_active: true,
      })
      .select('id, phone_number_id, waba_id, display_phone, business_name, is_active')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    clearConfigCache()
    return NextResponse.json({ config: data, verified: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
