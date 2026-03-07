'use client'

import { useState } from 'react'
import PhotoLightbox from '@/components/PhotoLightbox'
import type { BusinessPhoto } from '@/lib/types'

interface PhotoGalleryProps {
  photos: BusinessPhoto[]
  businessName: string
}

export default function PhotoGallery({ photos, businessName }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Sort by position
  const sortedPhotos = [...photos].sort((a, b) => a.position - b.position)
  const photoUrls = sortedPhotos.map(p => p.url)

  if (photos.length === 0) {
    return (
      <div>
        <h2 className="font-heading text-2xl font-bold mb-4">Photos</h2>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-hustle-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-hustle-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM8.25 8.625a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
            </svg>
          </div>
          <p className="text-hustle-muted text-sm">
            No photos yet. Business owners can add photos from their dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold mb-4">
        Photos
        <span className="text-hustle-muted text-lg font-normal ml-2">({photos.length})</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedPhotos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:ring-offset-2"
          >
            <img
              src={photo.url}
              alt={photo.alt_text || `${businessName} photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photoUrls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
