'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import PhotoLightbox from '@/components/PhotoLightbox'
import type { Review, ReviewResponse } from '@/lib/types'

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
type FilterStatus = 'all' | 'published' | 'flagged'

interface EnhancedReview extends Review {
  response?: ReviewResponse | null
}

export default function ReviewsPage() {
  const { user, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<EnhancedReview[]>([])
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [filterPhotos, setFilterPhotos] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null)
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

    setBusinessId(biz.id)

    // Fetch all reviews (including flagged for owner view)
    const { data: reviewData } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false })

    const rawReviews = (reviewData || []) as Review[]

    // Fetch responses
    const reviewIds = rawReviews.map(r => r.id)
    let responses: ReviewResponse[] = []
    if (reviewIds.length > 0) {
      const { data: respData } = await supabase
        .from('review_responses')
        .select('*')
        .in('review_id', reviewIds)
      responses = (respData || []) as ReviewResponse[]
    }

    // Merge
    const enhanced: EnhancedReview[] = rawReviews.map(r => ({
      ...r,
      photos: r.photos || [],
      helpful_count: r.helpful_count || 0,
      status: r.status || 'published',
      response: responses.find(resp => resp.review_id === r.id) || null,
    }))

    setReviews(enhanced)
    setLoading(false)
  }, [user, supabase, router])

  useEffect(() => {
    if (!authLoading) fetchData()
  }, [authLoading, fetchData])

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim() || !businessId) return
    setSubmittingReply(true)

    try {
      const responseId = crypto.randomUUID()
      const { error } = await supabase
        .from('review_responses')
        .upsert({
          id: responseId,
          review_id: reviewId,
          business_id: businessId,
          response_text: replyText.trim(),
        }, { onConflict: 'review_id' })

      if (error) {
        setToast({ message: 'Failed to save response. Please try again.', type: 'error' })
      } else {
        setToast({ message: 'Response posted!', type: 'success' })
        // Update local state
        setReviews(prev => prev.map(r =>
          r.id === reviewId
            ? { ...r, response: { id: responseId, review_id: reviewId, business_id: businessId, response_text: replyText.trim(), created_at: new Date().toISOString() } }
            : r
        ))
      }
    } catch {
      setToast({ message: 'Failed to save response. Please try again.', type: 'error' })
    }

    setReplyingTo(null)
    setReplyText('')
    setSubmittingReply(false)
  }

  const handleFlag = async (reviewId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'flagged' ? 'published' : 'flagged'
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', reviewId)

      if (!error) {
        setReviews(prev => prev.map(r =>
          r.id === reviewId ? { ...r, status: newStatus as Review['status'] } : r
        ))
        setToast({
          message: newStatus === 'flagged' ? 'Review flagged. It will be hidden from public view.' : 'Review restored to public view.',
          type: 'success',
        })
      }
    } catch {
      setToast({ message: 'Failed to update review status.', type: 'error' })
    }
  }

  // Filter and sort
  const filtered = reviews
    .filter(r => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false
      if (filterRating !== null && r.rating !== filterRating) return false
      if (filterPhotos && (!r.photos || r.photos.length === 0)) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'highest': return b.rating - a.rating
        case 'lowest': return a.rating - b.rating
        case 'helpful': return (b.helpful_count || 0) - (a.helpful_count || 0)
        default: return 0
      }
    })

  const totalReviews = reviews.length
  const publishedReviews = reviews.filter(r => r.status === 'published').length
  const flaggedReviews = reviews.filter(r => r.status === 'flagged').length
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0
  const respondedCount = reviews.filter(r => r.response).length
  const responseRate = totalReviews > 0 ? Math.round((respondedCount / totalReviews) * 100) : 0
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
      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">Reviews</h1>
          <p className="text-hustle-muted">Manage and respond to customer reviews</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Total Reviews</p>
            <p className="text-2xl font-bold text-hustle-dark mt-1">{totalReviews}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Average Rating</p>
            <p className="text-2xl font-bold text-hustle-dark mt-1">
              {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
              {avgRating > 0 && <span className="text-hustle-amber text-lg ml-1">★</span>}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Response Rate</p>
            <p className="text-2xl font-bold text-hustle-dark mt-1">{responseRate}%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-hustle-muted">Flagged</p>
            <p className="text-2xl font-bold text-hustle-dark mt-1">{flaggedReviews}</p>
          </div>
        </div>

        {/* Rating breakdown */}
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
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                  className={`flex items-center gap-2 w-full group ${filterRating === star ? 'opacity-100' : ''}`}
                >
                  <span className="text-sm text-hustle-muted w-6 text-right">{star}★</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${filterRating === star ? 'bg-hustle-blue' : 'bg-hustle-amber group-hover:bg-hustle-sunset'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-hustle-muted w-8">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and sort */}
        {reviews.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === 'all' ? 'bg-hustle-blue text-white' : 'bg-gray-100 text-hustle-muted hover:bg-gray-200'}`}
              >
                All ({totalReviews})
              </button>
              <button
                onClick={() => setFilterStatus('published')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === 'published' ? 'bg-hustle-blue text-white' : 'bg-gray-100 text-hustle-muted hover:bg-gray-200'}`}
              >
                Published ({publishedReviews})
              </button>
              <button
                onClick={() => setFilterStatus('flagged')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === 'flagged' ? 'bg-hustle-sunset text-white' : 'bg-gray-100 text-hustle-muted hover:bg-gray-200'}`}
              >
                Flagged ({flaggedReviews})
              </button>
              <button
                onClick={() => setFilterPhotos(!filterPhotos)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterPhotos ? 'bg-hustle-blue text-white' : 'bg-gray-100 text-hustle-muted hover:bg-gray-200'}`}
              >
                📷 With Photos
              </button>
              {filterRating !== null && (
                <button
                  onClick={() => setFilterRating(null)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-hustle-amber text-white"
                >
                  {filterRating}★ ✕
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        )}

        {/* Reviews list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-hustle-muted font-medium">
              {totalReviews === 0 ? 'No reviews yet' : 'No reviews match your filters'}
            </p>
            <p className="text-sm text-hustle-muted mt-1">
              {totalReviews === 0
                ? 'Encourage your customers to leave reviews after their visit!'
                : 'Try adjusting your filters to see more reviews.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className={`bg-white rounded-xl border p-5 ${
                  r.status === 'flagged' ? 'border-hustle-sunset/30 bg-red-50/30' : 'border-gray-200'
                }`}
              >
                {/* Review header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-hustle-blue/10 flex items-center justify-center text-sm font-bold text-hustle-blue">
                      {(r.reviewer_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-hustle-dark">
                          {r.reviewer_name || 'Anonymous'}
                        </p>
                        {(r.is_verified_booking || r.verified_booking) && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">✓ Verified Booking</span>
                        )}
                        {r.status === 'flagged' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">🚩 Flagged</span>
                        )}
                      </div>
                      <p className="text-xs text-hustle-muted">
                        {new Date(r.created_at).toLocaleDateString('en-NG', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                        {r.helpful_count > 0 && (
                          <span className="ml-2">· 👍 {r.helpful_count} found helpful</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-base">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>

                {/* Review text */}
                {r.text && (
                  <p className="text-sm text-hustle-dark mt-3">{r.text}</p>
                )}

                {/* Photos */}
                {r.photos && r.photos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {r.photos.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox({ photos: r.photos, index: i })}
                        className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-hustle-blue transition-colors"
                      >
                        <img src={photo} alt={`Review photo ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Existing response */}
                {r.response && (
                  <div className="mt-3 ml-4 pl-4 border-l-2 border-hustle-blue/20 bg-hustle-light rounded-r-lg p-3">
                    <p className="text-xs font-semibold text-hustle-blue mb-1">Your response</p>
                    <p className="text-sm text-hustle-dark">{r.response.response_text}</p>
                    <p className="text-xs text-hustle-muted mt-1">
                      {new Date(r.response.created_at).toLocaleDateString('en-NG', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                  {replyingTo === r.id ? (
                    <div className="flex-1 space-y-3">
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
                          {submittingReply ? 'Posting...' : r.response ? 'Update Response' : 'Post Response'}
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
                    <>
                      <button
                        onClick={() => { setReplyingTo(r.id); setReplyText(r.response?.response_text || '') }}
                        className="inline-flex items-center gap-1.5 text-sm text-hustle-blue hover:text-hustle-blue/80 transition-colors font-medium"
                      >
                        <svg width="14" height="14" style={{width:'14px',height:'14px',maxWidth:'14px',maxHeight:'14px',flexShrink:0}} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
                        </svg>
                        {r.response ? 'Edit Response' : 'Respond'}
                      </button>
                      <button
                        onClick={() => handleFlag(r.id, r.status || 'published')}
                        className={`inline-flex items-center gap-1.5 text-sm transition-colors font-medium ${
                          r.status === 'flagged'
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-hustle-muted hover:text-hustle-sunset'
                        }`}
                      >
                        {r.status === 'flagged' ? '✓ Restore' : '🚩 Flag'}
                      </button>
                    </>
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
