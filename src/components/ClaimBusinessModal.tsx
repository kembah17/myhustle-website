'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface ClaimBusinessModalProps {
  businessId: string
  businessName: string
  isOpen: boolean
  onClose: () => void
}

type Step = 'loading' | 'phone' | 'matched' | 'dispute' | 'uploading' | 'pending' | 'error'

export default function ClaimBusinessModal({ businessId, businessName, isOpen, onClose }: ClaimBusinessModalProps) {
  const [step, setStep] = useState<Step>('loading')
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null)
  const [phoneInput, setPhoneInput] = useState('')
  const [claimId, setClaimId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [docType, setDocType] = useState<'cac_certificate' | 'utility_bill'>('cac_certificate')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    fetchClaimStatus()
  }, [isOpen, businessId])

  async function getAuthToken(): Promise<string | null> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  }

  async function fetchClaimStatus() {
    setStep('loading')
    setError('')
    try {
      const token = await getAuthToken()
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`/api/claim?business_id=${businessId}`, { headers })
      const data = await res.json()

      if (data.is_claimed) {
        setMessage('This business has already been claimed.')
        setStep('error')
        return
      }

      setMaskedPhone(data.masked_phone)

      // Check if user has existing claims
      if (data.claims && data.claims.length > 0) {
        const latestClaim = data.claims[0]
        if (latestClaim.status === 'pending') {
          setStep('pending')
          return
        }
        if (latestClaim.status === 'approved') {
          setMessage('Your claim has been approved!')
          setStep('error')
          return
        }
      }

      setStep('phone')
    } catch {
      setError('Failed to load claim information.')
      setStep('error')
    }
  }

  async function handlePhoneVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!phoneInput.trim()) {
      setError('Please enter the phone number.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const token = await getAuthToken()
      if (!token) {
        setError('You must be logged in to claim a business.')
        setSubmitting(false)
        return
      }

      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_id: businessId,
          phone_entered: phoneInput,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to verify phone.')
        setSubmitting(false)
        return
      }

      setClaimId(data.claim_id)
      setMessage(data.message)

      if (data.matched) {
        setStep('matched')
      } else {
        setStep('dispute')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDocUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !claimId) {
      setError('Please select a document to upload.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const token = await getAuthToken()
      if (!token) {
        setError('You must be logged in.')
        setSubmitting(false)
        return
      }

      const formData = new FormData()
      formData.append('claim_attempt_id', claimId)
      formData.append('document_type', docType)
      formData.append('file', file)

      const res = await fetch('/api/claim/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to upload document.')
        setSubmitting(false)
        return
      }

      setMessage(data.message)
      setStep('pending')
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-hustle-dark/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-heading text-lg font-bold text-hustle-dark">Claim this Business</h2>
            <p className="text-sm text-hustle-muted mt-0.5">{businessName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-hustle-muted hover:text-hustle-dark transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Loading */}
          {step === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <svg className="animate-spin w-8 h-8 text-hustle-blue" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-hustle-muted mt-3">Loading claim information...</p>
            </div>
          )}

          {/* Phone Verification Step */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneVerify} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  To claim this business, enter the phone number registered with the listing.
                  We'll verify it matches our records.
                </p>
              </div>

              {maskedPhone && (
                <div className="text-center">
                  <p className="text-sm text-hustle-muted">Phone on file:</p>
                  <p className="font-heading text-xl font-bold text-hustle-dark tracking-wider">{maskedPhone}</p>
                </div>
              )}

              <div>
                <label htmlFor="claim-phone" className="block text-sm font-medium text-hustle-dark mb-1">
                  Enter full phone number
                </label>
                <input
                  id="claim-phone"
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-hustle-dark placeholder:text-hustle-muted focus:outline-none focus:ring-2 focus:ring-hustle-blue"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-hustle-blue text-white py-3 rounded-lg font-bold hover:bg-hustle-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify Phone Number'
                )}
              </button>
            </form>
          )}

          {/* Phone Matched */}
          {step === 'matched' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-green-800">Phone Number Matched!</h3>
              <p className="text-sm text-hustle-muted">{message}</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  🔒 OTP verification coming soon. Your claim has been submitted for manual review.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-hustle-blue text-white py-3 rounded-lg font-bold hover:bg-hustle-dark transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Dispute / Document Upload */}
          {step === 'dispute' && (
            <form onSubmit={handleDocUpload} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  {message || 'Phone does not match. You can submit documents to prove ownership.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-2">
                  Document Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="doc_type"
                      value="cac_certificate"
                      checked={docType === 'cac_certificate'}
                      onChange={() => setDocType('cac_certificate')}
                      className="text-hustle-blue focus:ring-hustle-blue"
                    />
                    <div>
                      <p className="text-sm font-medium text-hustle-dark">CAC Certificate</p>
                      <p className="text-xs text-hustle-muted">Corporate Affairs Commission registration</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="doc_type"
                      value="utility_bill"
                      checked={docType === 'utility_bill'}
                      onChange={() => setDocType('utility_bill')}
                      className="text-hustle-blue focus:ring-hustle-blue"
                    />
                    <div>
                      <p className="text-sm font-medium text-hustle-dark">Utility Bill</p>
                      <p className="text-xs text-hustle-muted">Recent utility bill showing business address</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">
                  Upload Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-hustle-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-hustle-blue/10 file:text-hustle-blue hover:file:bg-hustle-blue/20"
                />
                <p className="text-xs text-hustle-muted mt-1">PDF, JPG, or PNG. Max 10MB.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !file}
                className="w-full bg-hustle-blue text-white py-3 rounded-lg font-bold hover:bg-hustle-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Submit Claim'
                )}
              </button>
            </form>
          )}

          {/* Pending Review */}
          {step === 'pending' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-amber-800">Claim Under Review</h3>
              <p className="text-sm text-hustle-muted">
                {message || 'Your claim is being reviewed by our team. We\'ll notify you once it\'s processed.'}
              </p>
              <button
                onClick={onClose}
                className="w-full bg-hustle-blue text-white py-3 rounded-lg font-bold hover:bg-hustle-dark transition-colors"
              >
                Got it
              </button>
            </div>
          )}

          {/* Error State */}
          {step === 'error' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-sm text-hustle-muted">{error || message}</p>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-hustle-dark py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
