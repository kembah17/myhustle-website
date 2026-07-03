'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AreaData {
  id: string
  slug: string
  name: string
  business_count: number
}

interface CityData {
  id: string
  slug: string
  name: string
  state: string
  business_count: number
  areas: AreaData[]
}

interface PaginatedNearMeProps {
  cities: CityData[]
  initialCityCount?: number
  initialAreaCount?: number
}

export default function PaginatedNearMe({
  cities,
  initialCityCount = 10,
  initialAreaCount = 8,
}: PaginatedNearMeProps) {
  const [visibleCityCount, setVisibleCityCount] = useState(initialCityCount)
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set())

  const visibleCities = cities.slice(0, visibleCityCount)
  const hasMoreCities = cities.length > visibleCityCount
  const remainingCities = cities.length - visibleCityCount

  const toggleCityAreas = (cityId: string) => {
    setExpandedCities((prev) => {
      const next = new Set(prev)
      if (next.has(cityId)) {
        next.delete(cityId)
      } else {
        next.add(cityId)
      }
      return next
    })
  }

  return (
    <div className="space-y-8">
      {visibleCities.map((city) => {
        const isExpanded = expandedCities.has(city.id)
        const visibleAreas = isExpanded ? city.areas : city.areas.slice(0, initialAreaCount)
        const hasMoreAreas = city.areas.length > initialAreaCount
        const hiddenAreaCount = city.areas.length - initialAreaCount

        return (
          <div
            key={city.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* City Header */}
            <Link
              href={`/${city.slug}`}
              className="block px-6 py-4 bg-hustle-blue hover:bg-hustle-blue/90 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-bold text-white">
                    {city.name}
                  </h2>
                  <p className="text-blue-200 text-sm">{city.state} State</p>
                </div>
                <div className="text-right">
                  <span className="text-hustle-amber font-bold text-lg">
                    {city.business_count.toLocaleString()}
                  </span>
                  <p className="text-blue-200 text-xs">
                    {city.business_count === 1 ? 'business' : 'businesses'}
                  </p>
                </div>
              </div>
            </Link>

            {/* Areas Grid */}
            {city.areas.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {visibleAreas.map((area) => (
                    <Link
                      key={area.id}
                      href={`/${city.slug}/${area.slug}`}
                      className="group px-3 py-2.5 rounded-lg border border-gray-100 hover:border-hustle-amber hover:bg-hustle-amber/5 transition-all text-center"
                    >
                      <span className="text-sm font-medium text-hustle-dark group-hover:text-hustle-blue transition-colors">
                        {area.name}
                      </span>
                      {area.business_count > 0 && (
                        <span className="block text-xs text-hustle-muted mt-0.5">
                          {area.business_count.toLocaleString()} {area.business_count === 1 ? 'biz' : 'businesses'}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                {hasMoreAreas && !isExpanded && (
                  <button
                    onClick={() => toggleCityAreas(city.id)}
                    className="mt-3 text-sm font-medium text-hustle-blue hover:text-hustle-amber transition-colors"
                  >
                    Show all {city.areas.length} areas (+{hiddenAreaCount} more)
                  </button>
                )}

                {isExpanded && hasMoreAreas && (
                  <button
                    onClick={() => toggleCityAreas(city.id)}
                    className="mt-3 text-sm font-medium text-hustle-muted hover:text-hustle-dark transition-colors"
                  >
                    Show fewer areas
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-hustle-muted text-sm">
                Areas coming soon for {city.name}
              </div>
            )}
          </div>
        )
      })}

      {hasMoreCities && (
        <div className="text-center">
          <button
            onClick={() => setVisibleCityCount(cities.length)}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-hustle-blue rounded-lg hover:bg-hustle-blue/90 transition-colors"
          >
            Show All {cities.length} Cities
            <span className="text-blue-200">({remainingCities} more)</span>
          </button>
        </div>
      )}
    </div>
  )
}
