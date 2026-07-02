/**
 * Claim notification flow.
 * Triggered when a business is claimed on MyHustle.
 * Sends welcome message and requests verification.
 */

import type { FlowDefinition, WhatsAppFlow } from '../types'

export const claimNotificationFlow: FlowDefinition = {
  type: 'claim_notification',
  steps: [
    {
      action: 'send_template',
      template: 'myhustle_claim_welcome',
      params: ['business_name'],
      delay_hours: 0,
    },
    {
      action: 'wait_reply',
      delay_hours: 0,
    },
    {
      action: 'send_text',
      text: 'Thank you for claiming {{business_name}} on MyHustle! 🎉\n\nTo verify your ownership, please send us:\n1. A photo of your business premises\n2. Your business registration (if available)\n\nThis helps build trust with your customers.',
      delay_hours: 0,
    },
    {
      action: 'wait_reply',
      delay_hours: 0,
    },
    {
      action: 'send_text',
      text: 'We\'ve received your information. Our team will review and verify your business within 24 hours. You\'ll receive a notification once verified. ✅\n\nIn the meantime, visit your listing at myhustle.space to see how it looks!',
      delay_hours: 0,
    },
    {
      action: 'complete',
    },
  ],
  onReply: (flow: WhatsAppFlow, message: string, step: number) => {
    // Step 1: waiting for initial reply after welcome
    if (step === 1) {
      return {
        advanceTo: 2,
        updateData: { initial_reply: message },
      }
    }
    // Step 3: waiting for verification docs
    if (step === 3) {
      return {
        advanceTo: 4,
        updateData: { verification_reply: message },
      }
    }
    return null
  },
}
