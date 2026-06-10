/**
 * Quality scoring system for business listings.
 * Determines whether a business page should be indexed by search engines
 * based on content quality signals.
 */

export interface QualityScore {
  /** Numeric score (0-13 max) */
  score: number
  /** Human-readable list of signals that contributed to the score */
  signals: string[]
  /** Whether the page meets the minimum threshold for search engine indexing */
  isIndexable: boolean
}

/** Minimum score required for a page to be indexed */
export const INDEX_THRESHOLD = 3

export function calculateQualityScore(business: {
  description?: string | null
  area_id?: string | null
  website?: string | null
  hasPhotos?: boolean
  hasReviews?: boolean
  hasHours?: boolean
  isClaimed?: boolean
}): QualityScore {
  let score = 0
  const signals: string[] = []

  // Description quality (0-2 points)
  const descLen = (business.description || '').trim().length
  if (descLen > 200) {
    score += 2
    signals.push(`description>${200}chars(${descLen})`)
  } else if (descLen >= 100) {
    score += 1
    signals.push(`description>=${100}chars(${descLen})`)
  }

  // Has area_id (1 point)
  if (business.area_id) {
    score += 1
    signals.push('has_area')
  }

  // Has website (1 point)
  if (business.website) {
    score += 1
    signals.push('has_website')
  }

  // Has photos (2 points)
  if (business.hasPhotos) {
    score += 2
    signals.push('has_photos')
  }

  // Has published reviews (3 points)
  if (business.hasReviews) {
    score += 3
    signals.push('has_reviews')
  }

  // Has business hours (1 point)
  if (business.hasHours) {
    score += 1
    signals.push('has_hours')
  }

  // Is claimed/verified (2 points)
  if (business.isClaimed) {
    score += 2
    signals.push('is_claimed')
  }

  return {
    score,
    signals,
    isIndexable: score >= INDEX_THRESHOLD,
  }
}
