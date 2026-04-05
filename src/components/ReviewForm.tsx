'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface ReviewFormProps {
  businessId: string
  businessName: string
}

type AuthState = 'loading' | 'not_logged_in' | 'no_booking' | 'has_booking'

function StarSelector({ rating, onSelect }: { rating: number; onSelect: (r: number) => void }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onSelect(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-3xl transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <span className={star <= (hover || rating) ? 'text-hustle-amber' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
      {rating > 0 && (
        <span className="text-sm text-hustle-muted self-center ml-2">
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very Good'}
          {rating === 5 && 'Excellent'}
        </span>
      )}
    </div>
  )
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas not supported')); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Compression failed'))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

export default function ReviewForm({ businessId, businessName }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Closed rating system state
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Check auth and booking status on mount
  useEffect(() => {
    checkAuthAndBooking()
  }, [businessId])

  async function checkAuthAndBooking() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setAuthState('not_logged_in')
        return
      }

      // Check for completed booking with this business
      // Match by customer_email (from auth) and status = completed
      const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('business_id', businessId)
        .eq('customer_email', user.email)
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle()

      if (booking) {
        setBookingId(booking.id)
        setAuthState('has_booking')
        // Pre-fill reviewer name from user metadata if available
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
        if (fullName) setReviewerName(fullName)
      } else {
        setAuthState('no_booking')
      }
    } catch {
      setAuthState('not_logged_in')
    }
  }

  const addPhotos = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    )
    const remaining = 3 - photos.length
    const toAdd = imageFiles.slice(0, remaining)
    const newPhotos = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }, [photos.length])

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) addPhotos(e.dataTransfer.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) { setError('Please select a star rating.'); return }
    if (text.trim().length < 20) { setError('Review must be at least 20 characters.'); return }
    if (text.trim().length > 500) { setError('Review must be 500 characters or less.'); return }
    if (!reviewerName.trim()) { setError('Please enter your name.'); return }

    setSubmitting(true)

    try {
      const supabase = createClient()
      const photoUrls: string[] = []

      // Upload photos to Supabase Storage
      for (const photo of photos) {
        try {
          const compressed = await compressImage(photo.file)
          const fileName = `${businessId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
          const { error: uploadError } = await supabase.storage
            .from('review-photos')
            .upload(fileName, compressed, { contentType: 'image/jpeg' })

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('review-photos')
              .getPublicUrl(fileName)
            if (urlData?.publicUrl) photoUrls.push(urlData.publicUrl)
          }
        } catch {
          // Storage might not be configured - continue without photos
        }
      }

      const isVerifiedBooking = !!bookingId

      const reviewId = crypto.randomUUID()
      const { error: insertError } = await supabase.from('reviews').insert({
        id: reviewId,
        business_id: businessId,
        rating,
        text: text.trim(),
        reviewer_name: reviewerName.trim(),
        photos: photoUrls,
        booking_id: bookingId || null,
        is_verified_booking: isVerifiedBooking,
        verified_booking: isVerifiedBooking,
        status: 'published',
        helpful_count: 0,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setRating(0)
      setText('')
      setReviewerName('')
      photos.forEach((p) => URL.revokeObjectURL(p.preview))
      setPhotos([])
      setIsOpen(false)

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-hustle-muted">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Checking review eligibility...</span>
        </div>
      </div>
    )
  }

  // Not logged in
  if (authState === 'not_logged_in') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-hustle-muted text-sm">
          <a href="/login" className="text-hustle-blue font-semibold hover:underline">Log in</a>
          {' '}to leave a review for {businessName}.
        </p>
      </div>
    )
  }

  // No completed booking
  if (authState === 'no_booking') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">📋</span>
          <div>
            <p className="text-sm font-medium text-amber-900">Reviews are from verified customers only</p>
            <p className="text-sm text-amber-800 mt-1">
              Reviews are from verified customers who completed a booking through MyHustle.
              Book this business first, then leave a review after your appointment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-semibold text-green-800">Thank you for your review!</p>
        <p className="text-sm text-green-700 mt-1">Your review of {businessName} has been submitted.</p>
        <button
          onClick={() => { setSuccess(false); setIsOpen(true) }}
          className="mt-3 text-sm text-hustle-blue hover:underline"
        >
          Write another review
        </button>
      </div>
    )
  }

  // Has booking - show review button / form
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-hustle-blue text-white py-3 px-6 rounded-xl font-bold hover:bg-hustle-dark transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-lg">✍️</span>
        Write a Review
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-hustle-dark">
          Review {businessName}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-hustle-muted hover:text-hustle-dark text-sm"
        >
          Cancel
        </button>
      </div>

      {bookingId && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
          <span className="text-green-600 text-sm">✅</span>
          <p className="text-xs text-green-800">Verified booking — your review will be marked as verified</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Your Rating</label>
          <StarSelector rating={rating} onSelect={setRating} />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="reviewer-name" className="block text-sm font-medium text-hustle-dark mb-1">
            Your Name
          </label>
          <input
            id="reviewer-name"
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-hustle-dark placeholder:text-hustle-muted focus:outline-none focus:ring-2 focus:ring-hustle-blue"
          />
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-hustle-dark mb-1">
            Your Review
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience... (minimum 20 characters)"
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-hustle-dark placeholder:text-hustle-muted focus:outline-none focus:ring-2 focus:ring-hustle-blue resize-none"
          />
          <p className="text-xs text-hustle-muted mt-1 text-right">
            {text.length}/500
          </p>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">
            Photos <span className="text-hustle-muted font-normal">(optional, up to 3)</span>
          </label>

          {photos.length < 3 && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-hustle-blue bg-hustle-blue/5'
                  : 'border-gray-200 hover:border-hustle-blue/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => { if (e.target.files) addPhotos(e.target.files); e.target.value = '' }}
                className="hidden"
              />
              <p className="text-sm text-hustle-muted">
                📷 Drag photos here or <span className="text-hustle-blue font-medium">click to select</span>
              </p>
              <p className="text-xs text-hustle-muted mt-1">JPEG, PNG, or WebP. Max 5MB each.</p>
            </div>
          )}

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div className="flex gap-2 mt-2">
              {photos.map((photo, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={photo.preview}
                    alt={`Upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-hustle-blue text-white py-3 rounded-lg font-bold hover:bg-hustle-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px'}} viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  )
}
