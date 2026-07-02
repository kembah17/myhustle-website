/**
 * Bulk campaign flow.
 * Generic bulk messaging with rate limiting.
 * Used for announcements, promotions, and outreach campaigns.
 */

import type { FlowDefinition } from '../types'

export const bulkCampaignFlow: FlowDefinition = {
  type: 'bulk_campaign',
  steps: [
    {
      action: 'send_template',
      template: 'myhustle_campaign', // Will be overridden by flow data.template_name
      params: ['business_name'],
      delay_hours: 0,
    },
    {
      action: 'complete',
    },
  ],
  // Bulk campaigns don't handle replies by default
  onReply: () => null,
}
