/**
 * Meta WhatsApp Cloud API client for MyHustle.
 * Simplified from M4E's implementation — covers send text, template,
 * media messages; verify phone; manage templates.
 */

import type { MetaSendResult, MetaPhoneInfo, WhatsAppConfig } from './types'
import { createServiceClient } from '@/lib/supabase'

const META_API_VERSION = 'v21.0'
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`

interface MetaErrorResponse {
  error?: { message?: string; code?: number; type?: string }
}

async function throwMetaError(response: Response, fallback: string): Promise<never> {
  let message = fallback
  try {
    const data = (await response.json()) as MetaErrorResponse
    if (data.error?.message) message = data.error.message
  } catch {
    // response body wasn't JSON
  }
  throw new Error(message)
}

// ── Config loading ──────────────────────────────────────────

let cachedConfig: WhatsAppConfig | null = null
let configLoadedAt = 0
const CONFIG_TTL_MS = 60_000 // 1 minute cache

/**
 * Load WhatsApp config from DB, falling back to env vars.
 * Caches for 1 minute to avoid repeated DB calls.
 */
export async function getWhatsAppConfig(): Promise<WhatsAppConfig | null> {
  if (cachedConfig && Date.now() - configLoadedAt < CONFIG_TTL_MS) {
    return cachedConfig
  }

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (data) {
      cachedConfig = data as WhatsAppConfig
      configLoadedAt = Date.now()
      return cachedConfig
    }
  } catch {
    // DB not available, fall through to env vars
  }

  // Fallback to env vars
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  if (!phoneNumberId || !accessToken) return null

  cachedConfig = {
    id: 'env-fallback',
    phone_number_id: phoneNumberId,
    waba_id: process.env.WHATSAPP_WABA_ID || '',
    access_token: accessToken,
    verify_token: process.env.WHATSAPP_VERIFY_TOKEN || 'myhustle_webhook_verify',
    display_phone: '',
    business_name: 'MyHustle',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  configLoadedAt = Date.now()
  return cachedConfig
}

/** Clear config cache (call after config update). */
export function clearConfigCache(): void {
  cachedConfig = null
  configLoadedAt = 0
}

// ── Phone verification ──────────────────────────────────────

/**
 * Verify a Meta phone number ID by fetching its public metadata.
 */
export async function verifyPhoneNumber(args: {
  phoneNumberId: string
  accessToken: string
}): Promise<MetaPhoneInfo> {
  const { phoneNumberId, accessToken } = args
  const url = `${META_API_BASE}/${phoneNumberId}?fields=id,display_phone_number,verified_name,quality_rating`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`)
  }
  return response.json()
}

// ── Sending messages ────────────────────────────────────────

/**
 * Send a free-form WhatsApp text message.
 * Only works inside the 24-hour customer service window.
 */
export async function sendTextMessage(args: {
  phoneNumberId: string
  accessToken: string
  to: string
  text: string
  contextMessageId?: string
}): Promise<MetaSendResult> {
  const { phoneNumberId, accessToken, to, text, contextMessageId } = args
  const url = `${META_API_BASE}/${phoneNumberId}/messages`
  const body: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { body: text },
  }
  if (contextMessageId) {
    body.context = { message_id: contextMessageId }
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`)
  }
  const data = await response.json()
  return { messageId: data.messages[0].id }
}

/**
 * Send a template message. Required outside the 24-hour window.
 */
export async function sendTemplateMessage(args: {
  phoneNumberId: string
  accessToken: string
  to: string
  templateName: string
  language?: string
  params?: string[]
  components?: Record<string, unknown>[]
}): Promise<MetaSendResult> {
  const {
    phoneNumberId, accessToken, to, templateName,
    language = 'en_US', params, components,
  } = args
  const url = `${META_API_BASE}/${phoneNumberId}/messages`

  const templatePayload: Record<string, unknown> = {
    name: templateName,
    language: { code: language },
  }

  if (components && components.length > 0) {
    templatePayload.components = components
  } else if (params && params.length > 0) {
    templatePayload.components = [
      {
        type: 'body',
        parameters: params.map((p) => ({ type: 'text', text: String(p) })),
      },
    ]
  }

  const body: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: templatePayload,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`)
  }
  const data = await response.json()
  return { messageId: data.messages[0].id }
}

export type MediaKind = 'image' | 'video' | 'document' | 'audio'

/**
 * Send a media message (image, video, document, audio) via public URL.
 */
export async function sendMediaMessage(args: {
  phoneNumberId: string
  accessToken: string
  to: string
  kind: MediaKind
  link: string
  caption?: string
  filename?: string
}): Promise<MetaSendResult> {
  const { phoneNumberId, accessToken, to, kind, link, caption, filename } = args
  if (!link) throw new Error('sendMediaMessage requires a link.')
  const url = `${META_API_BASE}/${phoneNumberId}/messages`

  const media: Record<string, unknown> = { link }
  if (caption && kind !== 'audio') media.caption = caption
  if (kind === 'document' && filename) media.filename = filename

  const body: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: kind,
    [kind]: media,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`)
  }
  const data = await response.json()
  return { messageId: data.messages[0].id }
}

/**
 * Send an interactive button message (up to 3 buttons).
 */
export async function sendInteractiveButtons(args: {
  phoneNumberId: string
  accessToken: string
  to: string
  bodyText: string
  buttons: Array<{ id: string; title: string }>
  headerText?: string
  footerText?: string
}): Promise<MetaSendResult> {
  const { phoneNumberId, accessToken, to, bodyText, buttons, headerText, footerText } = args
  if (buttons.length < 1 || buttons.length > 3) {
    throw new Error(`Interactive buttons require 1-3 buttons (got ${buttons.length}).`)
  }

  const interactive: Record<string, unknown> = {
    type: 'button',
    body: { text: bodyText },
    action: {
      buttons: buttons.map((b) => ({
        type: 'reply',
        reply: { id: b.id, title: b.title },
      })),
    },
  }
  if (headerText) interactive.header = { type: 'text', text: headerText }
  if (footerText) interactive.footer = { text: footerText }

  const body: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive,
  }

  const url = `${META_API_BASE}/${phoneNumberId}/messages`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`)
  }
  const data = await response.json()
  return { messageId: data.messages[0].id }
}

// ── Template management ─────────────────────────────────────

/**
 * Fetch all message templates from Meta for this WABA.
 */
export async function fetchTemplatesFromMeta(args: {
  wabaId: string
  accessToken: string
}): Promise<Array<Record<string, unknown>>> {
  const { wabaId, accessToken } = args
  const url = `${META_API_BASE}/${wabaId}/message_templates?limit=100`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`)
  }
  const data = await response.json()
  return data.data ?? []
}

// ── Message logging ─────────────────────────────────────────

/**
 * Log a message to the whatsapp_messages table.
 */
export async function logMessage(msg: {
  direction: 'inbound' | 'outbound'
  wa_message_id?: string
  phone: string
  message_type: string
  template_name?: string
  content?: string
  status?: string
  conversation_category?: string
  cost_ngn?: number
  business_id?: string
  flow_type?: string
  metadata?: Record<string, unknown>
}): Promise<string | null> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .insert({
        direction: msg.direction,
        wa_message_id: msg.wa_message_id || null,
        phone: msg.phone,
        message_type: msg.message_type,
        template_name: msg.template_name || null,
        content: msg.content || null,
        status: msg.status || 'sent',
        conversation_category: msg.conversation_category || null,
        cost_ngn: msg.cost_ngn || null,
        business_id: msg.business_id || null,
        flow_type: msg.flow_type || null,
        metadata: msg.metadata || {},
      })
      .select('id')
      .single()

    if (error) {
      console.error('[whatsapp] Failed to log message:', error.message)
      return null
    }
    return data?.id || null
  } catch (err) {
    console.error('[whatsapp] Failed to log message:', err)
    return null
  }
}

/**
 * Update message status (from webhook status updates).
 */
export async function updateMessageStatus(args: {
  waMessageId: string
  status: string
  timestamp?: string
  errorMessage?: string
}): Promise<void> {
  try {
    const supabase = createServiceClient()
    await supabase
      .from('whatsapp_messages')
      .update({
        status: args.status,
        status_timestamp: args.timestamp ? new Date(parseInt(args.timestamp) * 1000).toISOString() : new Date().toISOString(),
        error_message: args.errorMessage || null,
      })
      .eq('wa_message_id', args.waMessageId)
  } catch (err) {
    console.error('[whatsapp] Failed to update message status:', err)
  }
}
