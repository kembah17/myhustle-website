"use client"
import { useState } from 'react'

interface ClaimCTAProps {
  businessName: string
  businessSlug: string
  businessId?: string
}

export default function ClaimCTA({ businessName, businessSlug, businessId }: ClaimCTAProps) {
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (dismissed) return null

  const waLink = `https://wa.me/2349160763078?text=${encodeURIComponent(
    `Hi! I want to claim my business: ${businessName} (https://myhustle.space/business/${businessSlug})`
  )}`

  const handleClaimViaAPI = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/whatsapp/flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'myhustle_webhook_verify',
        },
        body: JSON.stringify({
          businessId: businessId || undefined,
          flowType: 'claim_notification',
          phone,
          data: {
            business_name: businessName,
            business_slug: businessSlug,
          },
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        // Fallback to wa.me link
        window.open(waLink, '_blank')
      }
    } catch {
      // Fallback to wa.me link
      window.open(waLink, '_blank')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="fixed bottom-16 left-0 right-0 bg-green-600 text-white p-3 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">✅ Claim request sent!</p>
            <p className="text-xs text-green-100">We&apos;ll send you a WhatsApp message shortly to verify your ownership.</p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-green-200 hover:text-white p-1" aria-label="Dismiss">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-green-600 text-white p-3 z-40 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm sm:text-base">Is this your business?</p>
            <p className="text-xs sm:text-sm text-green-100 truncate">Claim {businessName} to update info &amp; get more customers</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!showPhoneInput ? (
              <>
                <button
                  onClick={() => setShowPhoneInput(true)}
                  className="bg-white text-green-700 px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-green-50 transition whitespace-nowrap"
                >
                  Claim Now
                </button>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-200 hover:text-white text-xs underline whitespace-nowrap"
                >
                  via WhatsApp
                </a>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-32 sm:w-40 px-2 py-1.5 rounded-lg text-xs text-gray-900 border-0 focus:ring-2 focus:ring-green-300"
                  autoFocus
                />
                <button
                  onClick={handleClaimViaAPI}
                  disabled={submitting}
                  className="bg-white text-green-700 px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-green-50 transition disabled:opacity-50"
                >
                  {submitting ? '...' : 'Send'}
                </button>
              </div>
            )}
            <button onClick={() => setDismissed(true)} className="text-green-200 hover:text-white p-1" aria-label="Dismiss">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-yellow-200 mt-1">{error}</p>}
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
