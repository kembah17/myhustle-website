'use client'

import { useState, useMemo } from 'react'
import type { Review, ReviewResponse } from '@/lib/types'
import ReviewCard from './ReviewCard'

type SortOption = 'recent' | 'highest' | 'helpful'
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1' | 'photos'

interface ReviewSummaryProps {
  reviews: (Review & { response?: ReviewResponse | null })[]
}

export default function ReviewSummary({ reviews }: ReviewSummaryProps) {
  const [filter, setFilter] = useState<FilterOption>('all')
  const [sort, setSort] = useState<SortOption>('recent')

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0

  const ratingDist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    return {
      star,
      count,
      pct: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    }
  })

  const filtered = useMemo(() => {
    let result = [...reviews]

    // Apply filter
    if (filter === 'photos') {
      result = result.filter((r) => r.photos && r.photos.length > 0)
    } else if (filter !== 'all') {
      const starNum = parseInt(filter)
      result = result.filter((r) => r.rating === starNum)
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sort) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'helpful':
          return (b.helpful_count || 0) - (a.helpful_count || 0)
        default:
          return 0
      }
    })

    return result
  }, [reviews, filter, sort])

  const filterButtons: { key: FilterOption; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: '5', label: '5★' },
    { key: '4', label: '4★' },
    { key: '3', label: '3★' },
    { key: '2', label: '2★' },
    { key: '1', label: '1★' },
    { key: 'photos', label: '📷 With Photos' },
  ]

  if (totalReviews === 0) return null

  return (
    <div className="space-y-6">
      {/* Rating Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Average Rating */}
          <div className="text-center sm:text-left shrink-0">
            <p className="text-5xl font-bold text-hustle-dark">{avgRating.toFixed(1)}</p>
            <div className="flex justify-center sm:justify-start mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl ${star <= Math.round(avgRating) ? 'text-hustle-amber' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-hustle-muted mt-1">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Bar Chart */}
          <div className="flex-1 space-y-1.5">
            {ratingDist.map(({ star, count, pct }) => (
              <button
                key={star}
                onClick={() => setFilter(filter === String(star) ? 'all' : String(star) as FilterOption)}
                className="flex items-center gap-2 w-full group"
              >
                <span className="text-sm text-hustle-muted w-6 text-right shrink-0">{star}★</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-hustle-amber rounded-full transition-all group-hover:bg-hustle-sunset"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-hustle-muted w-12 text-right shrink-0">
                  {pct}% ({count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === key
                  ? 'bg-hustle-blue text-white'
                  : 'bg-gray-100 text-hustle-muted hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Filtered Count */}
      {filter !== 'all' && (
        <p className="text-sm text-hustle-muted">
          Showing {filtered.length} of {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          {filter === 'photos' ? ' with photos' : ` rated ${filter}★`}
        </p>
      )}

      {/* Review Cards */}
      {filtered.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-hustle-muted">No reviews match this filter.</p>
          <button
            onClick={() => setFilter('all')}
            className="text-sm text-hustle-blue hover:underline mt-2"
          >
            Show all reviews
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}
