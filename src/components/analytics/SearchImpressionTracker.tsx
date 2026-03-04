'use client'

import { useEffect, useRef } from 'react'
import { trackSearchImpression } from '@/lib/analytics'

interface SearchImpressionTrackerProps {
  businessIds: string[]
  query: string
}

export default function SearchImpressionTracker({ businessIds, query }: SearchImpressionTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    // Only track once per page load
    if (tracked.current) return
    if (businessIds.length === 0 || !query) return
    tracked.current = true

    // Track impression for each business in results
    businessIds.forEach((id) => {
      trackSearchImpression(id, query)
    })
  }, [businessIds, query])

  return null
}
