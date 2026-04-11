'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setToast({ message: error.message, type: 'error' })
      } else {
        setToast({ message: 'Welcome back! Redirecting...', type: 'success' })
        setTimeout(() => router.push(redirect), 1000)
      }
    } catch {
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

    const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  )

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
            Welcome Back
          </h1>
          <p className="mt-2 text-hustle-muted">
            Sign in to manage your business listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-hustle-dark">Password</label>
              <Link href="/forgot-password" className="text-sm text-hustle-blue hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                placeholder="Your password"
              />
              <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hustle-blue text-white py-3 rounded-lg font-bold text-lg hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><LoadingSpinner size="sm" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-hustle-muted">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-hustle-blue font-medium hover:underline">
            List your business
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
