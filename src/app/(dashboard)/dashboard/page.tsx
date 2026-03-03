'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import type { Business, Booking, Review } from '@/lib/types'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [business, setBusiness] = useState<Business | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data: biz } = await supabase
      .from('businesses')
      .select('*, category:categories(name, icon), area:areas(name)')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!biz) {
      router.push('/onboarding')
      return
    }

    setBusiness(biz)

    const [allBookingRes, recentBookingRes, allReviewRes, recentReviewRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('*')
        .eq('business_id', biz.id),
      supabase
        .from('bookings')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('reviews')
        .select('*')
        .eq('business_id', biz.id),
      supabase
        .from('reviews')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    setAllBookings(allBookingRes.data || [])
    setBookings(recentBookingRes.data || [])
    setAllReviews(allReviewRes.data || [])
    setReviews(recentReviewRes.data || [])
    setLoading(false)
  }, [user, supabase, router])

  useEffect(() => {
    if (!authLoading) fetchData()
  }, [authLoading, fetchData])

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardShell>
    )
  }

  if (!business) return null

  const totalBookings = allBookings.length
  const pendingBookings = allBookings.filter(b => b.status === 'pending').length
  const totalReviews = allReviews.length
  const avgRating = totalReviews > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 'N/A'

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">
            {business.name}
          </h1>
          <p className="text-hustle-muted">
            {(business.category as unknown as { icon: string; name: string })?.icon}{' '}
            {(business.category as unknown as { name: string })?.name} &bull;{' '}
            {(business.area as unknown as { name: string })?.name}
          </p>
        </div>

        {/* Email verification banner */}
        {user && !user.email_confirmed_at && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="text-sm font-medium text-amber-800">Verify Your Email</p>
                <p className="text-xs text-amber-700">Verify your email to get a verified badge on your listing.</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.resend({ type: 'signup', email: user.email || '' })
                alert('Verification email sent! Check your inbox.')
              }}
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              Resend Email
            </button>
          </div>
        )}

        {/* Status banner */}
        {!business.verified && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-sm font-medium text-amber-800">Listing Under Review</p>
              <p className="text-xs text-amber-700">Your business listing is pending verification. This usually takes 24-48 hours.</p>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-hustle-muted">Total Bookings</p>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-2xl font-bold text-hustle-dark mt-2">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-hustle-muted">Pending Bookings</p>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-2xl font-bold text-hustle-dark mt-2">
              {pendingBookings}
              {pendingBookings > 0 && (
                <span className="text-sm font-normal text-amber-600 ml-2">needs action</span>
              )}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-hustle-muted">Total Reviews</p>
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-2xl font-bold text-hustle-dark mt-2">{totalReviews}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-hustle-muted">Average Rating</p>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-2xl font-bold text-hustle-dark mt-2">{avgRating}</p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/edit"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-hustle-blue transition-colors group"
          >
            <p className="font-medium text-hustle-dark group-hover:text-hustle-blue">✏️ Edit Profile</p>
            <p className="text-sm text-hustle-muted mt-1">Update your business details</p>
          </Link>
          <Link
            href={`/business/${business.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-hustle-blue transition-colors group"
          >
            <p className="font-medium text-hustle-dark group-hover:text-hustle-blue">👁️ View Listing</p>
            <p className="text-sm text-hustle-muted mt-1">See your public page</p>
          </Link>
          <Link
            href="/dashboard/hours"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-hustle-blue transition-colors group"
          >
            <p className="font-medium text-hustle-dark group-hover:text-hustle-blue">🕒 Manage Hours</p>
            <p className="text-sm text-hustle-muted mt-1">Update opening hours</p>
          </Link>
        </div>

        {/* Recent Bookings table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-hustle-dark">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm text-hustle-blue hover:underline">
              View all →
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-hustle-muted text-sm py-8 text-center">No bookings yet. They will appear here when customers book your services.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 text-hustle-muted font-medium">Customer</th>
                    <th className="text-left py-2 pr-4 text-hustle-muted font-medium hidden sm:table-cell">Service</th>
                    <th className="text-left py-2 pr-4 text-hustle-muted font-medium">Date</th>
                    <th className="text-left py-2 pr-4 text-hustle-muted font-medium hidden md:table-cell">Time</th>
                    <th className="text-left py-2 pr-4 text-hustle-muted font-medium">Status</th>
                    <th className="text-right py-2 text-hustle-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 hover:bg-hustle-light/50">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-hustle-dark">{b.customer_name}</p>
                        {b.customer_phone && (
                          <p className="text-xs text-hustle-muted">{b.customer_phone}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-hustle-muted hidden sm:table-cell">
                        {b.service || '—'}
                      </td>
                      <td className="py-3 pr-4 text-hustle-dark">{b.date}</td>
                      <td className="py-3 pr-4 text-hustle-muted hidden md:table-cell">
                        {b.time || '—'}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href="/dashboard/bookings"
                          className="text-xs text-hustle-blue hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-hustle-dark">Recent Reviews</h2>
            <Link href="/dashboard/reviews" className="text-sm text-hustle-blue hover:underline">
              View all →
            </Link>
          </div>
          {reviews.length === 0 ? (
            <p className="text-hustle-muted text-sm py-8 text-center">No reviews yet. Encourage your customers to leave reviews!</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-hustle-light rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-hustle-blue/10 flex items-center justify-center text-sm font-bold text-hustle-blue">
                        {(r.reviewer_name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-hustle-dark">
                          {r.reviewer_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-hustle-muted">
                          {new Date(r.created_at).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.verified_booking && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">✓ Verified</span>
                      )}
                      <span className="text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                  </div>
                  {r.text && <p className="text-sm text-hustle-dark mt-2 pl-10">{r.text}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
