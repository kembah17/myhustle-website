'use client'

import { useState } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 20

interface CityWithCount {
  id: string
  slug: string
  name: string
  state: string
  business_count: number
}

interface Props {
  grouped: Record<string, CityWithCount[]>
  sortedStates: string[]
}

export default function PaginatedCityGrid({ grouped, sortedStates }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const displayedStates = sortedStates.slice(0, visibleCount)
  const hasMore = visibleCount < sortedStates.length
  const remaining = sortedStates.length - displayedStates.length

  return (
    <div>
      <div className="space-y-10">
        {displayedStates.map((state) => (
          <div key={state}>
            <h2 className="font-heading text-xl font-bold text-hustle-dark mb-4 border-b border-gray-200 pb-2">
              {state}
              <span className="text-sm font-normal text-hustle-muted ml-2">
                ({grouped[state].length} {grouped[state].length === 1 ? 'city' : 'cities'})
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {grouped[state]
                .sort((a, b) => (b.business_count || 0) - (a.business_count || 0))
                .map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                  >
                    <h3 className="font-heading text-sm font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-xs text-hustle-muted mt-0.5">
                      {city.business_count} {city.business_count === 1 ? 'business' : 'businesses'}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
            className="inline-flex items-center gap-2 bg-hustle-blue hover:bg-hustle-blue/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Show More States
            <span className="text-sm text-blue-200">({remaining} remaining)</span>
          </button>
        </div>
      )}
      {!hasMore && sortedStates.length > PAGE_SIZE && (
        <p className="mt-6 text-center text-hustle-muted text-sm">
          Showing all {sortedStates.length} states
        </p>
      )}
    </div>
  )
}
