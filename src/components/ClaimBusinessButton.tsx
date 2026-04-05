'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import ClaimBusinessModal from './ClaimBusinessModal'

interface ClaimBusinessButtonProps {
  businessId: string
  businessName: string
  businessSlug: string
}

export default function ClaimBusinessButton({ businessId, businessName, businessSlug }: ClaimBusinessButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [checking, setChecking] = useState(false)

  async function handleClick() {
    setChecking(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to login with return URL
        window.location.href = `/login?redirect=/business/${businessSlug}`
        return
      }

      setShowModal(true)
    } catch {
      // If auth check fails, redirect to login
      window.location.href = `/login?redirect=/business/${businessSlug}`
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={checking}
        className="w-full flex items-center justify-center gap-2 bg-hustle-amber/10 text-hustle-amber border border-hustle-amber/30 py-3 px-4 rounded-xl font-semibold hover:bg-hustle-amber/20 transition-colors disabled:opacity-50"
      >
        {checking ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Checking...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Claim this Business
          </>
        )}
      </button>

      <ClaimBusinessModal
        businessId={businessId}
        businessName={businessName}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
