'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-browser'
import DashboardShell from '@/components/dashboard/DashboardShell'
import type { VerificationRequest } from '@/lib/types'

const TIER_LABELS = ['Unverified', 'Phone Verified', 'Document Verified', 'Physically Verified']
const TIER_COLORS = ['bg-gray-300', 'bg-hustle-blue', 'bg-hustle-amber', 'bg-green-500']

export default function VerificationPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [businessId, setBusinessId] = useState<string | null>(null)
  const [currentTier, setCurrentTier] = useState(0)
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Tier 1 state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [tier1Loading, setTier1Loading] = useState(false)
  const [tier1Message, setTier1Message] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Tier 2 state
  const [docType, setDocType] = useState('CAC Certificate')
  const [businessNameOnDoc, setBusinessNameOnDoc] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [tier2Loading, setTier2Loading] = useState(false)
  const [tier2Message, setTier2Message] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Tier 3 state
  const [tier3Loading, setTier3Loading] = useState(false)
  const [tier3Message, setTier3Message] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchVerificationData = useCallback(async (bizId: string) => {
    try {
      const res = await fetch(`/api/verification?business_id=${bizId}`)
      const data = await res.json()
      if (res.ok) {
        setCurrentTier(data.business.verification_tier ?? 0)
        setRequests(data.requests || [])
      }
    } catch {
      console.error('Failed to fetch verification data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function init() {
      if (!user) return
      const { data } = await supabase
        .from('businesses')
        .select('id, verification_tier')
        .eq('user_id', user.id)
        .maybeSingle()
      if (data) {
        setBusinessId(data.id)
        setCurrentTier(data.verification_tier ?? 0)
        await fetchVerificationData(data.id)
      } else {
        setLoading(false)
      }
    }
    init()
  }, [user, supabase, fetchVerificationData])

  const getRequestForTier = (tier: number): VerificationRequest | undefined => {
    return requests.find(r => r.requested_tier === tier)
  }

  // Tier 1: Send OTP
  const handleSendOtp = async () => {
    if (!businessId || !phoneNumber) return
    setTier1Loading(true)
    setTier1Message(null)
    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, requested_tier: 1, phone_number: phoneNumber }),
      })
      const data = await res.json()
      if (res.ok) {
        setOtpSent(true)
        setTier1Message({ type: 'success', text: data.message || 'OTP sent!' })
      } else {
        setTier1Message({ type: 'error', text: data.error || 'Failed to send OTP' })
      }
    } catch {
      setTier1Message({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setTier1Loading(false)
    }
  }

  // Tier 1: Verify OTP
  const handleVerifyOtp = async () => {
    if (!businessId || !otpCode) return
    setTier1Loading(true)
    setTier1Message(null)
    try {
      const res = await fetch('/api/verification/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, otp_code: otpCode }),
      })
      const data = await res.json()
      if (res.ok) {
        setTier1Message({ type: 'success', text: data.message || 'Phone verified!' })
        setCurrentTier(1)
        await fetchVerificationData(businessId)
      } else {
        setTier1Message({ type: 'error', text: data.error || 'Invalid OTP' })
      }
    } catch {
      setTier1Message({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setTier1Loading(false)
    }
  }

  // Tier 2: Submit documents
  const handleSubmitDocuments = async () => {
    if (!businessId) return
    setTier2Loading(true)
    setTier2Message(null)
    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          requested_tier: 2,
          document_type: docType,
          business_name_on_doc: businessNameOnDoc,
          registration_number: regNumber,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setTier2Message({ type: 'success', text: data.message || 'Documents submitted for review!' })
        await fetchVerificationData(businessId)
      } else {
        setTier2Message({ type: 'error', text: data.error || 'Failed to submit documents' })
      }
    } catch {
      setTier2Message({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setTier2Loading(false)
    }
  }

  // Tier 3: Request visit
  const handleRequestVideoCall = async () => {
    if (!businessId) return
    setTier3Loading(true)
    setTier3Message(null)
    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, requested_tier: 3 }),
      })
      const data = await res.json()
      if (res.ok) {
        setTier3Message({ type: 'success', text: data.message || 'Visit request submitted!' })
        await fetchVerificationData(businessId)
      } else {
        setTier3Message({ type: 'error', text: data.error || 'Failed to request visit' })
      }
    } catch {
      setTier3Message({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setTier3Loading(false)
    }
  }

  const renderStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hustle-blue" />
        </div>
      </DashboardShell>
    )
  }

  if (!businessId) {
    return (
      <DashboardShell>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-hustle-dark mb-2">No Business Found</h2>
          <p className="text-hustle-muted">Please create your business listing first before starting verification.</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">Business Verification</h1>
          <p className="text-hustle-muted mt-1">Verify your business to build trust with customers and unlock premium features.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-hustle-dark">Verification Progress</h2>
            <span className={`text-sm font-medium ${currentTier > 0 ? 'text-green-600' : 'text-hustle-muted'}`}>
              Tier {currentTier} — {TIER_LABELS[currentTier]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((tier) => (
              <div key={tier} className="flex-1 flex items-center">
                <div className="flex-1">
                  <div className={`h-2 rounded-full ${tier <= currentTier ? TIER_COLORS[tier] : 'bg-gray-200'} transition-colors`} />
                </div>
                {tier < 3 && (
                  <div className={`w-4 h-4 rounded-full mx-1 flex items-center justify-center flex-shrink-0 ${
                    tier < currentTier ? 'bg-green-500' : tier === currentTier ? TIER_COLORS[tier] : 'bg-gray-200'
                  }`}>
                    {tier < currentTier && (
                      <svg className="w-2.5 h-2.5 text-white" width="10" height="10" style={{width:'10px',height:'10px',maxWidth:'10px',maxHeight:'10px',flexShrink:0}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {TIER_LABELS.map((label, i) => (
              <span key={i} className={`text-xs ${i <= currentTier ? 'text-hustle-dark font-medium' : 'text-hustle-muted'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Tier 1: Phone Verification */}
        <div className={`bg-white rounded-xl border border-gray-200 p-6 ${currentTier >= 1 ? 'opacity-75' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentTier >= 1 ? 'bg-green-500' : 'bg-hustle-blue'}`}>
              {currentTier >= 1 ? (
                <svg className="w-4 h-4 text-white" width="16" height="16" style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-white text-sm font-bold">1</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-hustle-dark">Phone Verification</h3>
              <p className="text-sm text-hustle-muted">Verify your Nigerian phone number via OTP</p>
            </div>
          </div>

          {currentTier >= 1 ? (
            <div className="ml-11 bg-green-50 text-green-700 rounded-lg p-3 text-sm">
              ✓ Phone verified successfully
            </div>
          ) : (
            <div className="ml-11 space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-hustle-dark mb-1">Phone Number</label>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-gray-300 rounded-l-lg text-sm text-hustle-muted">+234</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="8012345678"
                        maxLength={11}
                        className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-hustle-blue outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSendOtp}
                    disabled={tier1Loading || phoneNumber.length < 10}
                    className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tier1Loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-hustle-dark mb-1">Enter OTP Code</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center tracking-widest font-mono focus:ring-2 focus:ring-hustle-blue focus:border-hustle-blue outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={tier1Loading || otpCode.length !== 6}
                      className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tier1Loading ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                      onClick={() => { setOtpSent(false); setOtpCode(''); setTier1Message(null) }}
                      className="text-hustle-muted text-sm hover:text-hustle-dark transition-colors"
                    >
                      Change number
                    </button>
                  </div>
                </>
              )}
              {tier1Message && (
                <div className={`rounded-lg p-3 text-sm ${tier1Message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {tier1Message.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tier 2: Document Verification */}
        <div className={`bg-white rounded-xl border border-gray-200 p-6 ${currentTier < 1 ? 'opacity-50 pointer-events-none' : currentTier >= 2 ? 'opacity-75' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentTier >= 2 ? 'bg-green-500' : currentTier >= 1 ? 'bg-hustle-amber' : 'bg-gray-300'}`}>
              {currentTier >= 2 ? (
                <svg className="w-4 h-4 text-white" width="16" height="16" style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-white text-sm font-bold">2</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-hustle-dark">Document Verification</h3>
              <p className="text-sm text-hustle-muted">Submit business registration documents for review</p>
            </div>
            {currentTier < 1 && (
              <span className="ml-auto text-xs bg-gray-100 text-hustle-muted px-2 py-1 rounded-full">Complete Tier 1 first</span>
            )}
          </div>

          {currentTier >= 2 ? (
            <div className="ml-11 bg-green-50 text-green-700 rounded-lg p-3 text-sm">
              ✓ Documents verified successfully
            </div>
          ) : currentTier >= 1 ? (
            <div className="ml-11 space-y-4">
              {(() => {
                const tier2Req = getRequestForTier(2)
                if (tier2Req && tier2Req.status === 'pending') {
                  return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStatusBadge('pending')}
                        <span className="text-sm text-hustle-dark font-medium">Documents under review</span>
                      </div>
                      <p className="text-sm text-hustle-muted">Your documents have been submitted and are being reviewed by our team. This usually takes 1-3 business days.</p>
                    </div>
                  )
                }
                if (tier2Req && tier2Req.status === 'rejected') {
                  return (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {renderStatusBadge('rejected')}
                          <span className="text-sm text-hustle-dark font-medium">Documents rejected</span>
                        </div>
                        {tier2Req.reviewer_notes && (
                          <p className="text-sm text-red-700">Reason: {tier2Req.reviewer_notes}</p>
                        )}
                        <p className="text-sm text-hustle-muted mt-1">Please resubmit with corrected documents.</p>
                      </div>
                    </>
                  )
                }
                return null
              })()}

              {(() => {
                const tier2Req = getRequestForTier(2)
                if (tier2Req && tier2Req.status === 'pending') return null
                return (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-hustle-dark mb-1">Document Type</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-hustle-blue outline-none"
                      >
                        <option>CAC Certificate</option>
                        <option>Business Registration</option>
                        <option>Tax ID (TIN)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-hustle-dark mb-1">Upload Document</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-hustle-blue transition-colors cursor-pointer">
                        <svg className="mx-auto w-8 h-8 text-hustle-muted mb-2" width="32" height="32" style={{width:'32px',height:'32px',maxWidth:'32px',maxHeight:'32px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-hustle-muted">Click to upload or drag and drop</p>
                        <p className="text-xs text-hustle-muted mt-1">PDF, JPG, PNG up to 10MB</p>
                      </div>
                      <p className="text-xs text-hustle-muted mt-1 italic">File upload coming soon — submit details below for now</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-hustle-dark mb-1">Business Name on Document</label>
                      <input
                        type="text"
                        value={businessNameOnDoc}
                        onChange={(e) => setBusinessNameOnDoc(e.target.value)}
                        placeholder="Exact name as shown on document"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-hustle-blue outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-hustle-dark mb-1">Registration Number</label>
                      <input
                        type="text"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        placeholder="e.g. RC-123456"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-hustle-blue outline-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmitDocuments}
                      disabled={tier2Loading || !businessNameOnDoc || !regNumber}
                      className="bg-hustle-amber text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tier2Loading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                  </>
                )
              })()}

              {tier2Message && (
                <div className={`rounded-lg p-3 text-sm ${tier2Message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {tier2Message.text}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Tier 3: Remote Video Verification */}
        <div className={`bg-white rounded-xl border border-gray-200 p-6 ${currentTier < 2 ? 'opacity-50 pointer-events-none' : currentTier >= 3 ? 'opacity-75' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentTier >= 3 ? 'bg-green-500' : currentTier >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}>
              {currentTier >= 3 ? (
                <svg className="w-4 h-4 text-white" width="16" height="16" style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-white text-sm font-bold">3</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-hustle-dark">Remote Video Verification</h3>
              <p className="text-sm text-hustle-muted">Verify your business via a live video call with our team</p>
            </div>
            {currentTier < 2 && (
              <span className="ml-auto text-xs bg-gray-100 text-hustle-muted px-2 py-1 rounded-full">Complete Tier 2 first</span>
            )}
          </div>

          {currentTier >= 3 ? (
            <div className="ml-11 bg-green-50 text-green-700 rounded-lg p-3 text-sm">
              ✓ Business remotely verified by MyHustle team via video call
            </div>
          ) : currentTier >= 2 ? (
            <div className="ml-11 space-y-4">
              <div className="bg-hustle-light rounded-lg p-4">
                <h4 className="text-sm font-medium text-hustle-dark mb-2">How Remote Video Verification Works</h4>
                <ul className="text-sm text-hustle-muted space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-hustle-blue mt-0.5">1.</span>
                    <span>Request a video verification call below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-hustle-blue mt-0.5">2.</span>
                    <span>Our team will contact you to schedule a convenient video call time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-hustle-blue mt-0.5">3.</span>
                    <span>Join a live video call and show your business premises, signage, and operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-hustle-blue mt-0.5">4.</span>
                    <span>Our team verifies your address, premises, and business operations via the video feed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-hustle-blue mt-0.5">5.</span>
                    <span>Upon approval, you receive the &quot;Fully Verified&quot; badge</span>
                  </li>
                </ul>
              </div>

              {(() => {
                const tier3Req = getRequestForTier(3)
                if (tier3Req && tier3Req.status === 'pending') {
                  return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStatusBadge('pending')}
                        <span className="text-sm text-hustle-dark font-medium">Video call requested</span>
                      </div>
                      <p className="text-sm text-hustle-muted">Your video verification request has been submitted. Our team will contact you to schedule the call.</p>
                    </div>
                  )
                }
                if (tier3Req && tier3Req.status === 'rejected') {
                  return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStatusBadge('rejected')}
                        <span className="text-sm text-hustle-dark font-medium">Video verification not approved</span>
                      </div>
                      {tier3Req.reviewer_notes && (
                        <p className="text-sm text-red-700">Reason: {tier3Req.reviewer_notes}</p>
                      )}
                    </div>
                  )
                }
                return null
              })()}

              {(() => {
                const tier3Req = getRequestForTier(3)
                if (tier3Req && tier3Req.status === 'pending') return null
                return (
                  <button
                    onClick={handleRequestVideoCall}
                    disabled={tier3Loading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tier3Loading ? 'Requesting...' : 'Request Video Verification Call'}
                  </button>
                )
              })()}

              {tier3Message && (
                <div className={`rounded-lg p-3 text-sm ${tier3Message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {tier3Message.text}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </DashboardShell>
  )
}
