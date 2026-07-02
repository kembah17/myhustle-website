/**
 * Badge outreach flow.
 * Sends MyHustle badge embed code to businesses with websites.
 */

import type { FlowDefinition, WhatsAppFlow } from '../types'

export const badgeOutreachFlow: FlowDefinition = {
  type: 'badge_outreach',
  steps: [
    {
      action: 'send_template',
      template: 'myhustle_badge_offer',
      params: ['business_name'],
      delay_hours: 0,
    },
    {
      action: 'wait_reply',
      delay_hours: 0,
    },
    {
      action: 'send_text',
      text: 'Great! Here\'s your MyHustle Verified badge code. Just paste it into your website:\n\n{{badge_code}}\n\nNeed help adding it? Reply and we\'ll guide you through it! 💪',
      delay_hours: 0,
    },
    {
      action: 'complete',
    },
  ],
  onReply: (flow: WhatsAppFlow, message: string, step: number) => {
    if (step === 1) {
      const reply = message.toLowerCase()
      if (reply.includes('yes') || reply.includes('sure') || reply.includes('ok') || reply.includes('send')) {
        return {
          advanceTo: 2,
          updateData: { accepted: true },
        }
      }
      return {
        advanceTo: 3, // skip to complete
        replyText: 'No problem! The badge is always available in your MyHustle dashboard if you change your mind. 👍',
      }
    }
    return null
  },
}
