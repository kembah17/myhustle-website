'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface ReportListingButtonProps {
  businessId: string
  businessName: string
}

const FLAG_OPTIONS = [
  { value: 'spam', label: 'Spam or fake listing', icon: '🚫' },
  { value: 'incorrect_info', label: 'Incorrect information', icon: '❌' },
  { value: 'closed', label: 'Business is closed', icon: '🔒' },
  { value: 'inappropriate', label: 'Inappropriate content', icon: '⚠️' },
  { value: 'duplicate', label: 'Duplicate listing', icon: '📋' },
  { value: 'inactive', label: 'Business appears inactive', icon: '💤' },
  { value: 'phone_invalid', label: 'Phone number is invalid', icon: '📞' },
  { value: 'quality_concern', label: 'Quality concern', icon: '🔍' },
] as const

export default function ReportListingButton({ businessId, businessName }: ReportListingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [existingFlags, setExistingFlags] = useState<string[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    checkExistingFlags()
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  async function checkExistingFlags() {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const headers: Record<string, string> = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const res = await fetch(`/api/flags?business_id=${businessId}`, { headers })
      const data = await res.json()

      if (data.user_flags) {
        setExistingFlags(data.user_flags.map((f: any) => f.flag_type))
      }
    } catch {
      // Silently fail - not critical
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedType) {
      setError('Please select a reason for reporting.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const res = await fetch('/api/flags', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          business_id: businessId,
          flag_type: selectedType,
          details: details.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit report.')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      setExistingFlags(prev => [...prev, selectedType])
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-green-700">✅ Thank you for your report.</p>
        <button
          onClick={() => { setSubmitted(false); setSelectedType(''); setDetails(''); setIsOpen(false) }}
          className="text-xs text-hustle-muted hover:underline mt-1"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs text-hustle-muted hover:text-red-500 transition-colors py-2"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        Report this listing
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
          <h4 className="font-heading text-sm font-semibold text-hustle-dark mb-3">
            Report {businessName}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Flag type options */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {FLAG_OPTIONS.map((option) => {
                const alreadyReported = existingFlags.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                      alreadyReported
                        ? 'bg-gray-50 text-hustle-muted cursor-not-allowed'
                        : selectedType === option.value
                        ? 'bg-red-50 border border-red-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="flag_type"
                      value={option.value}
                      checked={selectedType === option.value}
                      onChange={() => setSelectedType(option.value)}
                      disabled={alreadyReported}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span>{option.icon}</span>
                    <span className={alreadyReported ? 'line-through' : ''}>{option.label}</span>
                    {alreadyReported && (
                      <span className="text-xs text-hustle-muted ml-auto">Reported</span>
                    )}
                  </label>
                )
              })}
            </div>

            {/* Details */}
            <div>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Additional details (optional)"
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-hustle-dark placeholder:text-hustle-muted focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-xs text-hustle-muted py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedType}
                className="flex-1 bg-red-500 text-white text-xs py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
