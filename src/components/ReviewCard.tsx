'use client'

import { useState } from 'react'
import type { Review, ReviewResponse } from '@/lib/types'
import PhotoLightbox from './PhotoLightbox'
import { createClient } from '@/lib/supabase-browser'

interface ReviewCardProps {
  review: Review & { response?: ReviewResponse | null }
  showHelpful?: boolean
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

export default function ReviewCard({ review, showHelpful = true }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0)
  const [hasVoted, setHasVoted] = useState(false)
  const [flagged, setFlagged] = useState(false)

  const reviewText = review.text || ''
  const isLong = reviewText.length > 150
  const displayText = isLong && !expanded ? reviewText.slice(0, 150) + '...' : reviewText
  const photos = review.photos || []

  const handleHelpful = async () => {
    if (hasVoted) return
    setHasVoted(true)
    setHelpfulCount((prev) => prev + 1)
    try {
      const supabase = createClient()
      await supabase
        .from('reviews')
        .update({ helpful_count: helpfulCount + 1 })
        .eq('id', review.id)
    } catch {
      // Silently fail - optimistic update already applied
    }
  }

  const handleFlag = async () => {
    if (flagged) return
    setFlagged(true)
    // Flag is just a visual indicator for now - actual flagging happens via dashboard
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-hustle-blue/10 flex items-center justify-center text-sm font-bold text-hustle-blue shrink-0">
              {(review.reviewer_name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-hustle-dark">
                  {review.reviewer_name || 'Anonymous'}
                </p>
                {(review.is_verified_booking || review.verified_booking) && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    <svg className="w-3 h-3" width="12" height="12" style={{width:'12px',height:'12px',maxWidth:'12px',maxHeight:'12px',flexShrink:0}} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified Booking
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${star <= review.rating ? 'text-hustle-amber' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-hustle-muted">{timeAgo(review.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Text */}
        {reviewText && (
          <div className="mt-3">
            <p className="text-sm text-hustle-dark leading-relaxed">{displayText}</p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-hustle-blue hover:underline mt-1 font-medium"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <div className="flex gap-2 mt-3">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-hustle-blue transition-colors"
              >
                <img
                  src={photo}
                  alt={`Customer review photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        {showHelpful && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleHelpful}
              disabled={hasVoted}
              className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                hasVoted
                  ? 'text-hustle-blue font-medium'
                  : 'text-hustle-muted hover:text-hustle-blue'
              }`}
            >
              <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Helpful{helpfulCount > 0 ? ` (${helpfulCount})` : ''}
            </button>
            <button
              onClick={handleFlag}
              className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                flagged
                  ? 'text-hustle-sunset font-medium'
                  : 'text-hustle-muted hover:text-hustle-sunset'
              }`}
            >
              <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              {flagged ? 'Reported' : 'Report'}
            </button>
          </div>
        )}

        {/* Business Owner Response */}
        {review.response && (
          <div className="mt-3 ml-4 pl-4 border-l-2 border-hustle-blue/20 bg-hustle-light rounded-r-lg p-3">
            <p className="text-xs font-semibold text-hustle-blue mb-1">Response from the business</p>
            <p className="text-sm text-hustle-dark">{review.response.response_text}</p>
            <p className="text-xs text-hustle-muted mt-1">{timeAgo(review.response.created_at)}</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
