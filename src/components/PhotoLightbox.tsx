'use client'

import { useEffect, useCallback, useState } from 'react'

interface PhotoLightboxProps {
  photos: string[]
  initialIndex: number
  onClose: () => void
}

export default function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goNext, goPrev])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Counter */}
      {photos.length > 1 && (
        <div className="absolute top-4 left-4 text-white/70 text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      )}

      {/* Previous button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photos[currentIndex]}
          alt={`Review photo ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>

      {/* Next button */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
          aria-label="Next photo"
        >
          ›
        </button>
      )}
    </div>
  )
}
