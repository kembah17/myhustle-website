'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const AI_SOURCES = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'claude.ai',
  'you.com',
  'phind.com',
  'bard.google.com',
  'meta.ai',
] as const

export default function AIReferralTracker() {
  useEffect(() => {
    try {
      const referrer = document.referrer.toLowerCase()
      if (!referrer) return

      const matchedSource = AI_SOURCES.find(src => referrer.includes(src))
      if (matchedSource && typeof window.gtag === 'function') {
        window.gtag('event', 'ai_referral', {
          ai_source: matchedSource,
          landing_page: window.location.pathname,
          referrer_url: referrer,
        })
      }
    } catch {
      // Silently fail - analytics should never break the app
    }
  }, [])

  return null
}
