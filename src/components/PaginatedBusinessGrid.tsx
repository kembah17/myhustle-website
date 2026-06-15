'use client'

import { useState } from 'react'
import BusinessGrid from './BusinessGrid'
import type { Business, Category, Area, Review } from '@/lib/types'

const PAGE_SIZE = 20

interface Props {
  businesses: (Business & { category?: Category; area?: Area; reviews?: Review[] })[]
  areaName: string
}

export default function PaginatedBusinessGrid({ businesses, areaName }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(businesses.length / PAGE_SIZE)
  const displayed = businesses.slice(0, page * PAGE_SIZE)
  const hasMore = page < totalPages

  return (
    <div>
      <BusinessGrid businesses={displayed} />
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="inline-flex items-center gap-2 bg-hustle-blue hover:bg-hustle-blue/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Show More Businesses in {areaName}
            <span className="text-sm text-blue-200">({businesses.length - displayed.length} remaining)</span>
          </button>
        </div>
      )}
      {!hasMore && businesses.length > PAGE_SIZE && (
        <p className="mt-6 text-center text-hustle-muted text-sm">
          Showing all {businesses.length} businesses found in {areaName} so far
        </p>
      )}
    </div>
  )
}
