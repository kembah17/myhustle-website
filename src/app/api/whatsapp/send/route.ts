/**
 * Send a WhatsApp message (admin-only).
 * POST body: { to, type: 'text'|'template', text?, templateName?, params? }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import {
  getWhatsAppConfig,
  sendTextMessage,
  sendTemplateMessage,
  logMessage,
} from '@/lib/whatsapp/meta-api'
import { sanitizePhoneForMeta, toNigerianInternational } from '@/lib/whatsapp/phone-utils'
import { calculateMessageCost } from '@/lib/whatsapp/cost-calculator'

export async function POST(request: NextRequest) {
  // Check admin auth
  const supabase = createServiceClient()
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const config = await getWhatsAppConfig()
  if (!config) {
    return NextResponse.json({ error: 'WhatsApp not configured' }, { status: 503 })
  }

  const body = await request.json()
  const { to, type, text, templateName, params, businessId, flowType } = body as {
    to: string
    type: 'text' | 'template'
    text?: string
    templateName?: string
    params?: string[]
    businessId?: string
    flowType?: string
  }

  if (!to) {
    return NextResponse.json({ error: 'Missing "to" phone number' }, { status: 400 })
  }

  const phone = sanitizePhoneForMeta(toNigerianInternational(to))

  try {
    if (type === 'template') {
      if (!templateName) {
        return NextResponse.json({ error: 'Missing templateName' }, { status: 400 })
      }
      const result = await sendTemplateMessage({
        phoneNumberId: config.phone_number_id,
        accessToken: config.access_token,
        to: phone,
        templateName,
        params,
      })
      const cost = calculateMessageCost('utility')
      await logMessage({
        direction: 'outbound',
        wa_message_id: result.messageId,
        phone,
        message_type: 'template',
        template_name: templateName,
        content: JSON.stringify(params),
        status: 'sent',
        conversation_category: 'utility',
        cost_ngn: cost.ngn,
        business_id: businessId,
        flow_type: flowType,
      })
      return NextResponse.json({ success: true, messageId: result.messageId })
    }

    // Default: text message
    if (!text) {
      return NextResponse.json({ error: 'Missing "text"' }, { status: 400 })
    }
    const result = await sendTextMessage({
      phoneNumberId: config.phone_number_id,
      accessToken: config.access_token,
      to: phone,
      text,
    })
    const cost = calculateMessageCost('service')
    await logMessage({
      direction: 'outbound',
      wa_message_id: result.messageId,
      phone,
      message_type: 'text',
      content: text,
      status: 'sent',
      conversation_category: 'service',
      cost_ngn: cost.ngn,
      business_id: businessId,
      flow_type: flowType,
    })
    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
