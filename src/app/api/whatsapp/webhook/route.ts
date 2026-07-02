/**
 * WhatsApp webhook endpoint.
 * GET  — Meta verification challenge.
 * POST — Incoming messages and status updates.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyMetaWebhookSignature } from '@/lib/whatsapp/webhook-signature'
import { getWhatsAppConfig, logMessage, updateMessageStatus } from '@/lib/whatsapp/meta-api'
import { handleIncomingForFlows } from '@/lib/whatsapp/flows'
import type { MetaWebhookPayload, MetaWebhookMessage, MetaWebhookStatus } from '@/lib/whatsapp/types'

/**
 * GET — Meta webhook verification.
 * Meta sends hub.mode, hub.verify_token, hub.challenge.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (!mode || !token || !challenge) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const config = await getWhatsAppConfig()
  const verifyToken = config?.verify_token || process.env.WHATSAPP_VERIFY_TOKEN || 'myhustle_webhook_verify'

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[webhook] Verification successful')
    return new NextResponse(challenge, { status: 200 })
  }

  console.warn('[webhook] Verification failed — token mismatch')
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

/**
 * POST — Incoming messages and status updates from Meta.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // Verify signature
  const signature = request.headers.get('x-hub-signature-256')
  if (process.env.META_APP_SECRET) {
    if (!verifyMetaWebhookSignature(rawBody, signature)) {
      console.warn('[webhook] Invalid signature — rejecting')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let payload: MetaWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.object !== 'whatsapp_business_account') {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  // Process entries
  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      if (change.field !== 'messages') continue
      const value = change.value

      // Handle incoming messages
      if (value.messages) {
        for (const msg of value.messages) {
          await handleIncomingMessage(msg, value.contacts?.[0]?.profile?.name)
        }
      }

      // Handle status updates
      if (value.statuses) {
        for (const status of value.statuses) {
          await handleStatusUpdate(status)
        }
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

async function handleIncomingMessage(
  msg: MetaWebhookMessage,
  senderName?: string,
) {
  // Extract message text
  let messageText = ''
  let buttonReplyId: string | undefined

  switch (msg.type) {
    case 'text':
      messageText = msg.text?.body || ''
      break
    case 'interactive':
      if (msg.interactive?.button_reply) {
        buttonReplyId = msg.interactive.button_reply.id
        messageText = msg.interactive.button_reply.title
      } else if (msg.interactive?.list_reply) {
        buttonReplyId = msg.interactive.list_reply.id
        messageText = msg.interactive.list_reply.title
      }
      break
    case 'button':
      messageText = msg.button?.text || ''
      buttonReplyId = msg.button?.payload
      break
    default:
      messageText = `[${msg.type} message]`
  }

  // Log the incoming message
  await logMessage({
    direction: 'inbound',
    wa_message_id: msg.id,
    phone: msg.from,
    message_type: msg.type as string,
    content: messageText,
    status: 'delivered',
    metadata: {
      sender_name: senderName,
      context_message_id: msg.context?.message_id,
    },
  })

  // Route to active flows
  await handleIncomingForFlows({
    phone: msg.from,
    messageText,
    buttonReplyId,
  })
}

async function handleStatusUpdate(status: MetaWebhookStatus) {
  await updateMessageStatus({
    waMessageId: status.id,
    status: status.status,
    timestamp: status.timestamp,
    errorMessage: status.errors?.[0]?.title,
  })
}
