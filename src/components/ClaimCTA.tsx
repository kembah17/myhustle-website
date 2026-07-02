'use client'
import { useState } from 'react'

export default function ClaimCTA({ businessName, businessSlug }: { businessName: string; businessSlug: string }) {
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-green-600 text-white p-3 z-40 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm sm:text-base">Is this your business?</p>
            <p className="text-xs sm:text-sm text-green-100 truncate">Claim {businessName} to update info &amp; get more customers</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://wa.me/2349160763078?text=${encodeURIComponent(`Hi! I want to claim my business: ${businessName} (https://myhustle.space/business/${businessSlug})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-green-50 transition whitespace-nowrap"
            >
              Claim via WhatsApp
            </a>
            <button onClick={() => setDismissed(true)} className="text-green-200 hover:text-white p-1" aria-label="Dismiss">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-green-200 text-xs underline mt-1">
          {expanded ? 'Hide benefits' : 'Why claim?'}
        </button>
        {expanded && (
          <div className="mt-2 text-xs text-green-100 grid grid-cols-2 sm:grid-cols-3 gap-1">
            <div>Update business info</div>
            <div>Add photos &amp; logo</div>
            <div>Get customer reviews</div>
            <div>Show your phone number</div>
            <div>Set business hours</div>
            <div>Rank higher in search</div>
          </div>
        )}
      </div>
    </div>
  )
}
