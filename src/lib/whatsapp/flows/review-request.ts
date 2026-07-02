/**
 * Review request flow.
 * Asks customers to leave reviews for businesses they visited.
 */

import type { FlowDefinition, WhatsAppFlow } from '../types'

export const reviewRequestFlow: FlowDefinition = {
  type: 'review_request',
  steps: [
    {
      action: 'send_template',
      template: 'myhustle_review_request',
      params: ['business_name', 'review_url'],
      delay_hours: 0,
    },
    {
      action: 'wait_reply',
      delay_hours: 0,
    },
    {
      action: 'send_text',
      text: 'Thank you for your feedback! Your review helps other Nigerians find great businesses. 🇳🇬\n\nHave a great day!',
      delay_hours: 0,
    },
    {
      action: 'complete',
    },
  ],
  onReply: (flow: WhatsAppFlow, message: string, step: number) => {
    if (step === 1) {
      return {
        advanceTo: 2,
        updateData: { review_reply: message },
      }
    }
    return null
  },
}
