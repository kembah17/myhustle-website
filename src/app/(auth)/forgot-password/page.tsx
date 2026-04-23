'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?type=recovery`,
      })

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setSent(true)
      }
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-heading text-3xl font-bold text-hustle-dark">
              My<span className="text-hustle-amber">Hustle</span>
            </span>
          </Link>
          <h1 className="mt-4 font-heading text-2xl font-bold text-hustle-dark">
            Reset Password
          </h1>
        </div>

        {sent ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="font-heading text-xl font-semibold text-hustle-dark mb-2">
              Check Your Email
            </h2>
            <p className="text-hustle-muted mb-4">
              We sent a password reset link to <strong>{email}</strong>.
              Click the link in the email to reset your password.
            </p>
            <Link href="/login" className="text-hustle-blue font-medium hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <p className="text-hustle-muted text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hustle-blue text-white py-3 rounded-lg font-bold hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><LoadingSpinner size="sm" /> Sending...</> : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-hustle-muted">
              <Link href="/login" className="text-hustle-blue hover:underline">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
