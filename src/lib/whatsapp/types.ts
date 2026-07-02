/**
 * WhatsApp Cloud API types for MyHustle.
 */

// ── Config ──────────────────────────────────────────────────
export interface WhatsAppConfig {
  id: string
  phone_number_id: string
  waba_id: string
  access_token: string
  verify_token: string
  display_phone?: string
  business_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Messages ────────────────────────────────────────────────
export type MessageDirection = 'inbound' | 'outbound'
export type MessageType = 'text' | 'template' | 'image' | 'document' | 'interactive' | 'audio' | 'video' | 'reaction'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'
export type ConversationCategory = 'marketing' | 'utility' | 'service' | 'authentication'
export type FlowType = 'claim' | 'enrichment' | 'review' | 'badge' | 'outreach' | 'general'

export interface WhatsAppMessage {
  id: string
  direction: MessageDirection
  wa_message_id?: string
  phone: string
  message_type: MessageType
  template_name?: string
  content?: string
  status: MessageStatus
  status_timestamp?: string
  error_message?: string
  conversation_category?: ConversationCategory
  cost_ngn?: number
  business_id?: string
  flow_type?: FlowType
  metadata: Record<string, unknown>
  created_at: string
}

// ── Templates ───────────────────────────────────────────────
export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
export type TemplateStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface WhatsAppTemplate {
  id: string
  name: string
  category: TemplateCategory
  language: string
  status: TemplateStatus
  components: MetaTemplateComponent[]
  meta_template_id?: string
  flow_type?: string
  created_at: string
  updated_at: string
}

export interface MetaTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS'
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  text?: string
  buttons?: MetaTemplateButton[]
  example?: Record<string, unknown>
}

export interface MetaTemplateButton {
  type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY' | 'COPY_CODE'
  text: string
  url?: string
  phone_number?: string
  example?: string[]
}

// ── Flows ───────────────────────────────────────────────────
export type FlowStatus = 'pending' | 'active' | 'completed' | 'failed' | 'cancelled'

export interface WhatsAppFlow {
  id: string
  business_id?: string
  flow_type: string
  status: FlowStatus
  step: number
  data: Record<string, unknown>
  next_action_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface FlowStep {
  action: 'send_template' | 'send_text' | 'wait_reply' | 'check_condition' | 'complete'
  template?: string
  text?: string
  delay_hours?: number
  condition?: (flow: WhatsAppFlow, incomingMessage?: string) => boolean
  params?: string[]
}

export interface FlowDefinition {
  type: string
  steps: FlowStep[]
  onReply?: (flow: WhatsAppFlow, message: string, step: number) => {
    advanceTo?: number
    updateData?: Record<string, unknown>
    replyText?: string
  } | null
}

// ── Webhook payloads ────────────────────────────────────────
export interface MetaWebhookPayload {
  object: string
  entry: MetaWebhookEntry[]
}

export interface MetaWebhookEntry {
  id: string
  changes: MetaWebhookChange[]
}

export interface MetaWebhookChange {
  value: MetaWebhookValue
  field: string
}

export interface MetaWebhookValue {
  messaging_product: string
  metadata: {
    display_phone_number: string
    phone_number_id: string
  }
  contacts?: MetaWebhookContact[]
  messages?: MetaWebhookMessage[]
  statuses?: MetaWebhookStatus[]
}

export interface MetaWebhookContact {
  profile: { name: string }
  wa_id: string
}

export interface MetaWebhookMessage {
  from: string
  id: string
  timestamp: string
  type: string
  text?: { body: string }
  image?: { id: string; mime_type: string; caption?: string }
  document?: { id: string; mime_type: string; filename?: string; caption?: string }
  interactive?: {
    type: string
    button_reply?: { id: string; title: string }
    list_reply?: { id: string; title: string; description?: string }
  }
  button?: { text: string; payload: string }
  context?: { message_id: string }
}

export interface MetaWebhookStatus {
  id: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  recipient_id: string
  errors?: Array<{ code: number; title: string }>
  conversation?: {
    id: string
    origin: { type: string }
  }
}

// ── API response types ──────────────────────────────────────
export interface MetaSendResult {
  messageId: string
}

export interface MetaPhoneInfo {
  id: string
  display_phone_number: string
  verified_name?: string
  quality_rating?: string
}
