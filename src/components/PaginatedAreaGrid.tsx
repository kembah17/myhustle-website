'use client'

import { useState } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 20

interface AreaItem {
  id: string
  name: string
  slug: string
  area_type: string | null
  business_count: number
}

interface Props {
  areas: AreaItem[]
  citySlug: string
  cityName: string
}

export default function PaginatedAreaGrid({ areas, citySlug, cityName }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(areas.length / PAGE_SIZE)
  const displayed = areas.slice(0, page * PAGE_SIZE)
  const hasMore = page < totalPages

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((area) => (
          <Link
            key={area.id}
            href={`/${citySlug}/${area.slug}`}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber block group"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-hustle-dark text-base md:text-lg group-hover:text-hustle-blue transition-colors">
                {area.name}
              </h3>
              <span className="bg-hustle-blue/10 text-hustle-blue text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
                {area.business_count.toLocaleString()}
              </span>
            </div>

            {area.area_type && (
              <p className="text-xs text-hustle-muted mt-2 capitalize">
                {area.area_type} area
              </p>
            )}

            <p className="text-xs text-hustle-blue mt-3 group-hover:text-hustle-amber transition-colors">
              View all businesses &rarr;
            </p>
          </Link>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="inline-flex items-center gap-2 bg-hustle-blue hover:bg-hustle-blue/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Show More Areas in {cityName}
            <span className="text-sm text-blue-200">({areas.length - displayed.length} remaining)</span>
          </button>
        </div>
      )}
      {!hasMore && areas.length > PAGE_SIZE && (
        <p className="mt-6 text-center text-hustle-muted text-sm">
          Showing all {areas.length} areas in {cityName}
        </p>
      )}
    </div>
  )
}
