/**
 * WhatsApp flow engine for MyHustle.
 * Processes active flows, advances steps, sends scheduled messages.
 */

import { createServiceClient } from '@/lib/supabase'
import {
  getWhatsAppConfig,
  sendTextMessage,
  sendTemplateMessage,
  logMessage,
} from '../meta-api'
import { sanitizePhoneForMeta } from '../phone-utils'
import { calculateMessageCost } from '../cost-calculator'
import type { WhatsAppFlow, FlowDefinition, FlowStep } from '../types'

// Flow registry — import and register all flow definitions
import { claimNotificationFlow } from './claim-notification'
import { contentAcquisitionFlow } from './content-acquisition'
import { reviewRequestFlow } from './review-request'
import { badgeOutreachFlow } from './badge-outreach'
import { bulkCampaignFlow } from './bulk-campaign'

const FLOW_REGISTRY: Record<string, FlowDefinition> = {
  claim_notification: claimNotificationFlow,
  content_acquisition: contentAcquisitionFlow,
  review_request: reviewRequestFlow,
  badge_outreach: badgeOutreachFlow,
  bulk_campaign: bulkCampaignFlow,
}

export function getFlowDefinition(flowType: string): FlowDefinition | null {
  return FLOW_REGISTRY[flowType] || null
}

/**
 * Create a new flow for a business.
 */
export async function createFlow(args: {
  businessId?: string
  flowType: string
  phone: string
  data?: Record<string, unknown>
  delayHours?: number
}): Promise<string | null> {
  const { businessId, flowType, phone, data = {}, delayHours } = args
  const definition = getFlowDefinition(flowType)
  if (!definition) {
    console.error(`[flow] Unknown flow type: ${flowType}`)
    return null
  }

  const supabase = createServiceClient()
  const nextActionAt = delayHours
    ? new Date(Date.now() + delayHours * 3600_000).toISOString()
    : new Date().toISOString()

  const { data: flow, error } = await supabase
    .from('whatsapp_flows')
    .insert({
      business_id: businessId || null,
      flow_type: flowType,
      status: 'active',
      step: 0,
      data: { ...data, phone },
      next_action_at: nextActionAt,
    })
    .select('id')
    .single()

  if (error) {
    console.error(`[flow] Failed to create flow:`, error.message)
    return null
  }

  return flow?.id || null
}

/**
 * Process all active flows that are due for their next action.
 * Called by the cron endpoint.
 */
export async function processActiveFlows(): Promise<{
  processed: number
  errors: number
}> {
  const supabase = createServiceClient()
  const now = new Date().toISOString()

  const { data: flows, error } = await supabase
    .from('whatsapp_flows')
    .select('*')
    .eq('status', 'active')
    .lte('next_action_at', now)
    .order('next_action_at', { ascending: true })
    .limit(50)

  if (error || !flows) {
    console.error('[flow] Failed to fetch active flows:', error?.message)
    return { processed: 0, errors: 1 }
  }

  let processed = 0
  let errors = 0

  for (const flow of flows as WhatsAppFlow[]) {
    try {
      await executeFlowStep(flow)
      processed++
    } catch (err) {
      errors++
      console.error(`[flow] Error processing flow ${flow.id}:`, err)
      await supabase
        .from('whatsapp_flows')
        .update({ status: 'failed', data: { ...flow.data, error: String(err) } })
        .eq('id', flow.id)
    }
  }

  return { processed, errors }
}

/**
 * Execute the current step of a flow.
 */
async function executeFlowStep(flow: WhatsAppFlow): Promise<void> {
  const definition = getFlowDefinition(flow.flow_type)
  if (!definition) {
    throw new Error(`Unknown flow type: ${flow.flow_type}`)
  }

  const steps = definition.steps
  if (flow.step >= steps.length) {
    await completeFlow(flow.id)
    return
  }

  const step = steps[flow.step]
  const phone = (flow.data as Record<string, string>).phone
  if (!phone) {
    throw new Error('Flow has no phone number in data')
  }

  const config = await getWhatsAppConfig()
  if (!config) {
    throw new Error('WhatsApp not configured')
  }

  const supabase = createServiceClient()

  switch (step.action) {
    case 'send_template': {
      if (!step.template) throw new Error('Step requires template name')
      const params = resolveParams(step.params, flow.data as Record<string, string>)
      const result = await sendTemplateMessage({
        phoneNumberId: config.phone_number_id,
        accessToken: config.access_token,
        to: sanitizePhoneForMeta(phone),
        templateName: step.template,
        params,
      })
      const cost = calculateMessageCost('utility')
      await logMessage({
        direction: 'outbound',
        wa_message_id: result.messageId,
        phone,
        message_type: 'template',
        template_name: step.template,
        content: JSON.stringify(params),
        status: 'sent',
        conversation_category: 'utility',
        cost_ngn: cost.ngn,
        business_id: flow.business_id || undefined,
        flow_type: flow.flow_type,
      })
      break
    }

    case 'send_text': {
      if (!step.text) throw new Error('Step requires text')
      const text = resolveText(step.text, flow.data as Record<string, string>)
      const result = await sendTextMessage({
        phoneNumberId: config.phone_number_id,
        accessToken: config.access_token,
        to: sanitizePhoneForMeta(phone),
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
        business_id: flow.business_id || undefined,
        flow_type: flow.flow_type,
      })
      break
    }

    case 'wait_reply': {
      // Don't advance — wait for incoming message handler to advance
      return
    }

    case 'complete': {
      await completeFlow(flow.id)
      return
    }
  }

  // Advance to next step
  const nextStep = flow.step + 1
  if (nextStep >= steps.length) {
    await completeFlow(flow.id)
  } else {
    const nextDef = steps[nextStep]
    const delayMs = (nextDef.delay_hours || 0) * 3600_000
    await supabase
      .from('whatsapp_flows')
      .update({
        step: nextStep,
        next_action_at: new Date(Date.now() + delayMs).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', flow.id)
  }
}

/**
 * Handle an incoming message and route to active flows.
 */
export async function handleIncomingForFlows(args: {
  phone: string
  messageText: string
  buttonReplyId?: string
}): Promise<boolean> {
  const { phone, messageText, buttonReplyId } = args
  const supabase = createServiceClient()

  // Find active flows for this phone
  const { data: flows } = await supabase
    .from('whatsapp_flows')
    .select('*')
    .eq('status', 'active')
    .filter('data->>phone', 'eq', phone)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!flows || flows.length === 0) return false

  const flow = flows[0] as WhatsAppFlow
  const definition = getFlowDefinition(flow.flow_type)
  if (!definition?.onReply) return false

  const replyContent = buttonReplyId || messageText
  const result = definition.onReply(flow, replyContent, flow.step)
  if (!result) return false

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (result.updateData) {
    updates.data = { ...flow.data, ...result.updateData }
  }

  if (result.advanceTo !== undefined) {
    updates.step = result.advanceTo
    const nextDef = definition.steps[result.advanceTo]
    if (nextDef) {
      const delayMs = (nextDef.delay_hours || 0) * 3600_000
      updates.next_action_at = new Date(Date.now() + delayMs).toISOString()
    }
  }

  await supabase.from('whatsapp_flows').update(updates).eq('id', flow.id)

  // Send reply text if provided
  if (result.replyText) {
    const config = await getWhatsAppConfig()
    if (config) {
      await sendTextMessage({
        phoneNumberId: config.phone_number_id,
        accessToken: config.access_token,
        to: sanitizePhoneForMeta(phone),
        text: result.replyText,
      })
    }
  }

  return true
}

// ── Helpers ─────────────────────────────────────────────────

async function completeFlow(flowId: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase
    .from('whatsapp_flows')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', flowId)
}

/**
 * Resolve template params from flow data.
 * Params like "business_name" are looked up in flow.data.
 */
function resolveParams(
  paramKeys: string[] | undefined,
  data: Record<string, string>,
): string[] {
  if (!paramKeys) return []
  return paramKeys.map((key) => data[key] || key)
}

/**
 * Resolve text placeholders like {{business_name}} from flow data.
 */
function resolveText(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || `{{${key}}}`)
}
