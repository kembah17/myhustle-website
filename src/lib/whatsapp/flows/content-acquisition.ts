/**
 * Content acquisition flow.
 * Requests photos, hours, and description from business owners
 * to enrich their MyHustle listing.
 */

import type { FlowDefinition, WhatsAppFlow } from '../types'

export const contentAcquisitionFlow: FlowDefinition = {
  type: 'content_acquisition',
  steps: [
    {
      action: 'send_template',
      template: 'myhustle_content_request',
      params: ['business_name'],
      delay_hours: 0,
    },
    {
      action: 'send_text',
      text: 'Hi! We\'d love to make your {{business_name}} listing on MyHustle stand out. 📸\n\nCould you share:\n1. 2-3 photos of your business\n2. Your opening hours\n3. A short description of what you offer\n\nBusinesses with complete profiles get 3x more views!',
      delay_hours: 0.1, // 6 minutes after template
    },
    {
      action: 'wait_reply',
      delay_hours: 0,
    },
    {
      action: 'send_text',
      text: 'Thanks for sharing! 🙏 We\'ll update your listing shortly.\n\nWant to add anything else? Opening hours, services, or pricing? Just send it here.',
      delay_hours: 0,
    },
    {
      action: 'wait_reply',
      delay_hours: 0,
    },
    {
      action: 'send_text',
      text: 'Your listing has been updated! Check it out at myhustle.space 🚀\n\nTip: Share your listing link with customers to boost visibility.',
      delay_hours: 1,
    },
    {
      action: 'complete',
    },
  ],
  onReply: (flow: WhatsAppFlow, message: string, step: number) => {
    if (step === 2) {
      return {
        advanceTo: 3,
        updateData: { content_reply_1: message },
      }
    }
    if (step === 4) {
      return {
        advanceTo: 5,
        updateData: { content_reply_2: message },
      }
    }
    return null
  },
}
