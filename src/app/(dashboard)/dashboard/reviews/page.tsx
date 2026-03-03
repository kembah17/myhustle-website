'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Review } from '@/lib/types'

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest'

export default function ReviewsPage() {
  const { user, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const router = useRouter()
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data: biz } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!biz) {
      router.push('/onboarding')
      return
    }

    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false })

    setReviews(data || [])
    setLoading(false)
  }, [user, supabase, router])

  useEffect(() => {
    if (!authLoading) fetchData()
  }, [authLoading, fetchData])

  const sorted = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: totalReviews > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / totalReviews) * 100)
      : 0,
  }))

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">Reviews</h1>
          <p className="text-hustle-muted">See what your customers are saying</p>
        </div>

        {/* Rating summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="text-center sm:text-left">
              <p className="text-5xl font-bold text-hustle-dark">{avgRating.toFixed(1)}</p>
              <div className="text-lg mt-1">
                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              </div>
              <p className="text-sm text-hustle-muted mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingDist.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-hustle-muted w-6 text-right">{star}★</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-hustle-amber rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-hustle-muted w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sort controls */}
        {reviews.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-hustle-muted">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        )}

        {/* Reviews list */}
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-hustle-muted font-medium">No reviews yet</p>
            <p className="text-sm text-hustle-muted mt-1">Encourage your customers to leave reviews after their visit!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-hustle-blue/10 flex items-center justify-center text-sm font-bold text-hustle-blue">
                      {(r.reviewer_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-hustle-dark">
                          {r.reviewer_name || 'Anonymous'}
                        </p>
                        {r.verified_booking && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">✓ Verified Booking</span>
                        )}
                      </div>
                      <p className="text-xs text-hustle-muted">
                        {new Date(r.created_at).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-base">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
                {r.text && (
                  <p className="text-sm text-hustle-dark mt-3 pl-13">{r.text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
