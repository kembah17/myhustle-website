'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface AreaItem {
  slug: string
  name: string
  count: number
  citySlug: string
  cityName?: string
}

interface ExpandableAreaPillsProps {
  areas: AreaItem[]
  categorySlug: string
  initialCount?: number
  batchSize?: number
  groupByCity?: boolean
  /** Build href for each pill. Defaults to /{citySlug}/{areaSlug}/{categorySlug} */
  buildHref?: (area: AreaItem) => string
}

export default function ExpandableAreaPills({
  areas,
  categorySlug,
  initialCount = 20,
  batchSize = 20,
  groupByCity = true,
  buildHref,
}: ExpandableAreaPillsProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount)

  const getHref = buildHref || ((area: AreaItem) => `/${area.citySlug}/${area.slug}/${categorySlug}`)

  // Group areas by city if enabled
  const grouped = useMemo(() => {
    if (!groupByCity) return null

    const cityMap = new Map<string, { cityName: string; citySlug: string; areas: AreaItem[]; totalCount: number }>()
    for (const area of areas) {
      const key = area.citySlug
      const existing = cityMap.get(key)
      if (existing) {
        existing.areas.push(area)
        existing.totalCount += area.count
      } else {
        cityMap.set(key, {
          cityName: area.cityName || area.citySlug,
          citySlug: area.citySlug,
          areas: [area],
          totalCount: area.count,
        })
      }
    }

    // Sort cities by total business count descending
    return Array.from(cityMap.values())
      .sort((a, b) => b.totalCount - a.totalCount)
  }, [areas, groupByCity])

  // For grouped mode: flatten to count visible pills across cities
  const flatAreas = useMemo(() => {
    if (!grouped) return areas
    const flat: AreaItem[] = []
    for (const city of grouped) {
      // Areas within each city already sorted by count (from server)
      for (const area of city.areas) {
        flat.push(area)
      }
    }
    return flat
  }, [grouped, areas])

  const visibleAreas = flatAreas.slice(0, visibleCount)
  const hasMore = flatAreas.length > visibleCount
  const remaining = flatAreas.length - visibleCount

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + batchSize, flatAreas.length))
  }

  // Grouped rendering
  if (groupByCity && grouped) {
    // Build a set of visible area slugs for quick lookup
    const visibleSet = new Set(visibleAreas.map((a) => `${a.citySlug}/${a.slug}`))

    return (
      <div className="space-y-4">
        {grouped.map((city) => {
          const cityVisibleAreas = city.areas.filter(
            (a) => visibleSet.has(`${a.citySlug}/${a.slug}`)
          )
          if (cityVisibleAreas.length === 0) return null

          return (
            <div key={city.citySlug}>
              <h3 className="text-sm font-semibold text-hustle-dark mb-2">
                {city.cityName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cityVisibleAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={getHref(area)}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm hover:border-hustle-amber hover:shadow-sm transition-all"
                  >
                    <span className="font-medium text-hustle-dark">{area.name}</span>
                    <span className="text-hustle-muted text-xs">({area.count})</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {hasMore && (
          <button
            onClick={handleShowMore}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-hustle-blue bg-hustle-blue/5 border border-hustle-blue/20 rounded-full hover:bg-hustle-blue/10 transition-colors"
          >
            Show {Math.min(batchSize, remaining)} more areas
            <span className="text-hustle-muted">({remaining} remaining)</span>
          </button>
        )}
      </div>
    )
  }

  // Flat rendering (no grouping)
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {visibleAreas.map((area) => (
          <Link
            key={area.slug}
            href={getHref(area)}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm hover:border-hustle-amber hover:shadow-sm transition-all"
          >
            <span className="font-medium text-hustle-dark">{area.name}</span>
            {area.count > 0 && (
              <span className="text-hustle-muted text-xs">({area.count})</span>
            )}
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={handleShowMore}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-hustle-blue bg-hustle-blue/5 border border-hustle-blue/20 rounded-full hover:bg-hustle-blue/10 transition-colors"
        >
          Show {Math.min(batchSize, remaining)} more areas
          <span className="text-hustle-muted">({remaining} remaining)</span>
        </button>
      )}
    </div>
  )
}
