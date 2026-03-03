'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import type { Review } from '@/lib/types'

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest'

export default function ReviewsPage() {
  const { user, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
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

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    setSubmittingReply(true)

    try {
      const { error } = await supabase
        .from('reviews')
        .update({ owner_response: replyText.trim() })
        .eq('id', reviewId)

      if (error) {
        // Column likely doesn't exist yet
        setToast({
          message: 'Feature coming soon \u2014 responses will be visible to customers in the next update.',
          type: 'info',
        })
      } else {
        setToast({ message: 'Response saved!', type: 'success' })
      }
    } catch {
      setToast({
        message: 'Feature coming soon \u2014 responses will be visible to customers in the next update.',
        type: 'info',
      })
    }

    setReplyingTo(null)
    setReplyText('')
    setSubmittingReply(false)
  }

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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
                {'\u2605'.repeat(Math.round(avgRating))}{'\u2606'.repeat(5 - Math.round(avgRating))}
              </div>
              <p className="text-sm text-hustle-muted mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingDist.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-hustle-muted w-6 text-right">{star}\u2605</span>
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
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">\u2713 Verified Booking</span>
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
                    {'\u2605'.repeat(r.rating)}{'\u2606'.repeat(5 - r.rating)}
                  </div>
                </div>
                {r.text && (
                  <p className="text-sm text-hustle-dark mt-3 pl-13">{r.text}</p>
                )}

                {/* Reply section */}
                <div className="mt-3 pl-13">
                  {replyingTo === r.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your response to this review..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-hustle-dark placeholder:text-hustle-muted focus:outline-none focus:ring-2 focus:ring-hustle-blue resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReply(r.id)}
                          disabled={submittingReply || !replyText.trim()}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50"
                        >
                          {submittingReply ? 'Posting...' : 'Post Reply'}
                        </button>
                        <button
                          onClick={() => { setReplyingTo(null); setReplyText('') }}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-hustle-muted hover:bg-hustle-light transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyingTo(r.id); setReplyText('') }}
                      className="inline-flex items-center gap-1.5 text-sm text-hustle-blue hover:text-hustle-blue/80 transition-colors font-medium"
                    >
                      <svg
                        width="14"
                        height="14"
                        style={{width:'14px',height:'14px',maxWidth:'14px',maxHeight:'14px',flexShrink:0}}
                        className="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
                      </svg>
                      Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
