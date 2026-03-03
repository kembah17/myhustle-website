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
  const [reviews, setReviews] = useState<Review[]>([])
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

    const [bookingRes, reviewRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('reviews')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    setBookings(bookingRes.data || [])
    setReviews(reviewRes.data || [])
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

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A'

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

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Status</p>
            <p className="text-lg font-bold text-hustle-dark mt-1">
              {business.verified ? '✅ Verified' : '⏳ Pending'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Bookings</p>
            <p className="text-lg font-bold text-hustle-dark mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Reviews</p>
            <p className="text-lg font-bold text-hustle-dark mt-1">{reviews.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Avg Rating</p>
            <p className="text-lg font-bold text-hustle-dark mt-1">⭐ {avgRating}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/edit"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-hustle-blue transition-colors group"
          >
            <p className="font-medium text-hustle-dark group-hover:text-hustle-blue">✏️ Edit Listing</p>
            <p className="text-sm text-hustle-muted mt-1">Update your business details</p>
          </Link>
          <Link
            href="/dashboard/hours"
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-hustle-blue transition-colors group"
          >
            <p className="font-medium text-hustle-dark group-hover:text-hustle-blue">🕒 Manage Hours</p>
            <p className="text-sm text-hustle-muted mt-1">Update opening hours</p>
          </Link>
          <Link
            href={`/business/${business.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-hustle-blue transition-colors group"
          >
            <p className="font-medium text-hustle-dark group-hover:text-hustle-blue">👁️ View Listing</p>
            <p className="text-sm text-hustle-muted mt-1">See your public page</p>
          </Link>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-hustle-dark">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm text-hustle-blue hover:underline">
              View all
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-hustle-muted text-sm py-4 text-center">No bookings yet. They will appear here when customers book your services.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-hustle-light rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-hustle-dark">{b.customer_name}</p>
                    <p className="text-xs text-hustle-muted">{b.date} {b.time && `at ${b.time}`}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-hustle-dark">Recent Reviews</h2>
            <Link href="/dashboard/reviews" className="text-sm text-hustle-blue hover:underline">
              View all
            </Link>
          </div>
          {reviews.length === 0 ? (
            <p className="text-hustle-muted text-sm py-4 text-center">No reviews yet. Encourage your customers to leave reviews!</p>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="p-3 bg-hustle-light rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{'⭐'.repeat(r.rating)}</span>
                    <span className="text-xs text-hustle-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {r.text && <p className="text-sm text-hustle-dark">{r.text}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
