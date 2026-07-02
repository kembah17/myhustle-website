/**
 * Meta WhatsApp messaging cost calculator.
 * Nigeria-specific rates based on Meta's 2025 pricing.
 */

export const META_RATES_NGN = {
  marketing: { per_message: 57.17 },
  utility: { per_message: 14.03 },
  authentication: { per_message: 12.38 },
  service: { per_conversation: 6.60 },
  free_tier: { conversations_per_month: 1000 },
} as const

export const META_RATES_USD = {
  marketing: { per_message: 0.0347 },
  utility: { per_message: 0.0085 },
  authentication: { per_message: 0.0075 },
  service: { per_conversation: 0.004 },
  free_tier: { conversations_per_month: 1000 },
} as const

export interface CostEstimate {
  total_cost_ngn: number
  total_cost_usd: number
  per_recipient_ngn: number
}

/**
 * Calculate cost for a single message by category.
 */
export function calculateMessageCost(
  category: string,
): { ngn: number; usd: number } {
  const cat = category.toLowerCase()
  switch (cat) {
    case 'marketing':
      return { ngn: META_RATES_NGN.marketing.per_message, usd: META_RATES_USD.marketing.per_message }
    case 'utility':
      return { ngn: META_RATES_NGN.utility.per_message, usd: META_RATES_USD.utility.per_message }
    case 'authentication':
      return { ngn: META_RATES_NGN.authentication.per_message, usd: META_RATES_USD.authentication.per_message }
    case 'service':
      return { ngn: META_RATES_NGN.service.per_conversation, usd: META_RATES_USD.service.per_conversation }
    default:
      return { ngn: META_RATES_NGN.utility.per_message, usd: META_RATES_USD.utility.per_message }
  }
}

/**
 * Estimate cost for a broadcast to N recipients.
 */
export function estimateBroadcastCost(
  recipientCount: number,
  templateCategory: string,
): CostEstimate {
  const { ngn, usd } = calculateMessageCost(templateCategory)
  return {
    total_cost_ngn: recipientCount * ngn,
    total_cost_usd: recipientCount * usd,
    per_recipient_ngn: ngn,
  }
}
