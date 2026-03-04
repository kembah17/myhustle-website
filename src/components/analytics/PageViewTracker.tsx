'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

interface PageViewTrackerProps {
  businessId: string
}

export default function PageViewTracker({ businessId }: PageViewTrackerProps) {
  useEffect(() => {
    trackPageView(businessId)
  }, [businessId])

  return null
}
