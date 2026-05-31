import Link from 'next/link'
import StarRating from './StarRating'
import VerificationBadge from './VerificationBadge'
import type { Category, Area, Review } from '@/lib/types'

interface SimilarBusiness {
  id: string
  slug: string
  name: string
  description: string | null
  cover_photo_url: string | null
  verified: boolean
  verification_tier: number
  tagline: string | null
  category: Pick<Category, 'name' | 'slug' | 'icon'> | null
  area: (Pick<Area, 'name' | 'slug'> & { city?: { name: string; slug: string } | null }) | null
  reviews: Pick<Review, 'rating'>[] | null
}

interface SimilarBusinessesProps {
  businesses: SimilarBusiness[]
  categoryName: string
  categorySlug: string
  areaName: string
  areaSlug: string
  citySlug: string
}

export default function SimilarBusinesses({
  businesses,
  categoryName,
  categorySlug,
  areaName,
  areaSlug,
  citySlug,
}: SimilarBusinessesProps) {
  if (!businesses || businesses.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl font-bold mb-6">
        Similar {categoryName} Nearby
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((biz) => {
          const reviews = biz.reviews || []
          const avgRating =
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0

          return (
            <Link
              key={biz.id}
              href={`/business/${biz.slug}`}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Cover Photo */}
              {biz.cover_photo_url && (
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={biz.cover_photo_url}
                    alt={`${biz.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors line-clamp-1">
                    {biz.name}
                  </h3>
                  {(biz.verification_tier > 0 || biz.verified) && (
                    <VerificationBadge
                      tier={biz.verification_tier || (biz.verified ? 1 : 0)}
                      variant="compact"
                    />
                  )}
                </div>

                {/* Category Badge */}
                {biz.category && (
                  <span className="inline-flex items-center gap-1 bg-hustle-light text-hustle-muted text-xs font-medium px-2 py-0.5 rounded-full mb-2">
                    {biz.category.icon && <span>{biz.category.icon}</span>}
                    {biz.category.name}
                  </span>
                )}

                {/* Area */}
                {biz.area && (
                  <p className="text-xs text-hustle-muted mb-2 flex items-center gap-1">
                    <svg
                      className="w-3 h-3 flex-shrink-0"
                      width="12"
                      height="12"
                      style={{ width: '12px', height: '12px', maxWidth: '12px', maxHeight: '12px', flexShrink: 0 }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {biz.area.name}
                    {biz.area.city?.name ? `, ${biz.area.city.name}` : ''}
                  </p>
                )}

                {/* Rating */}
                {reviews.length > 0 && (
                  <StarRating rating={avgRating} count={reviews.length} size="sm" />
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Internal Links */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link
          href={`/${citySlug}/${areaSlug}/${categorySlug}`}
          className="text-hustle-blue hover:text-hustle-amber font-medium transition-colors"
        >
          Browse all {categoryName} in {areaName} &rarr;
        </Link>
        <Link
          href={`/category/${categorySlug}`}
          className="text-hustle-blue hover:text-hustle-amber font-medium transition-colors"
        >
          More {categoryName} across Nigeria &rarr;
        </Link>
      </div>
    </section>
  )
}
