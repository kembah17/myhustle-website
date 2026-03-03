import Link from 'next/link'
import StarRating from './StarRating'
import type { Business, Category, Area, Review } from '@/lib/types'

interface BusinessCardProps {
  business: Business & {
    category?: Category
    area?: Area
    reviews?: Review[]
  }
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const avgRating = business.reviews && business.reviews.length > 0
    ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length
    : 0
  const reviewCount = business.reviews?.length || 0

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link href={`/business/${business.slug}`} className="group">
              <h3 className="font-heading font-semibold text-lg text-hustle-dark group-hover:text-hustle-blue transition-colors truncate">
                {business.name}
              </h3>
            </Link>
          </div>
          {business.verified && (
            <span className="ml-2 flex-shrink-0 inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Category Badge */}
        {business.category && (
          <Link
            href={`/category/${business.category.slug}`}
            className="inline-flex items-center gap-1 bg-hustle-light text-hustle-muted text-xs font-medium px-2.5 py-1 rounded-full hover:bg-hustle-blue hover:text-white transition-colors mb-3"
          >
            {business.category.icon && <span>{business.category.icon}</span>}
            {business.category.name}
          </Link>
        )}

        {/* Area */}
        {business.area && (
          <p className="text-sm text-hustle-muted mb-2 flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <Link href={`/lagos/${business.area.slug}`} className="hover:text-hustle-blue transition-colors">
              {business.area.name}, Lagos
            </Link>
          </p>
        )}

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="mb-3">
            <StarRating rating={avgRating} count={reviewCount} size="sm" />
          </div>
        )}

        {/* Description snippet */}
        {business.description && (
          <p className="text-sm text-hustle-muted line-clamp-2 mb-3">
            {business.description}
          </p>
        )}
      </div>

      {/* Card Footer - Action Buttons */}
      <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-2">
        {business.whatsapp && (
          <a
            href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-500 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        )}
        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-hustle-blue text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-hustle-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </a>
        )}
        <Link
          href={`/business/${business.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 border border-hustle-blue text-hustle-blue text-sm font-medium px-3 py-2 rounded-lg hover:bg-hustle-blue hover:text-white transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
