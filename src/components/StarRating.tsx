'use client'

interface StarRatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export default function StarRating({ rating, count = 0, size = 'md', showCount = true }: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <span key={i} className={`${sizeClasses[size]} text-hustle-amber`}>★</span>
      )
    } else if (i - 0.5 <= rating) {
      stars.push(
        <span key={i} className={`${sizeClasses[size]} text-hustle-amber`}>★</span>
      )
    } else {
      stars.push(
        <span key={i} className={`${sizeClasses[size]} text-gray-300`}>★</span>
      )
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        {stars}
      </div>
      {showCount && (
        <span className="text-hustle-muted text-sm ml-1">
          {rating.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}
