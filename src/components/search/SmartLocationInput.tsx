'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { expandSearchTerms } from '@/lib/synonyms'
import type { Area, Landmark } from '@/lib/types'

interface LocationResult {
  slug: string
  name: string
  type: 'area' | 'landmark'
  cityName?: string
  distance?: number
}

interface SmartLocationInputProps {
  onSelect: (slug: string, type: 'area' | 'landmark') => void
  initialValue?: string
  className?: string
  variant?: 'hero' | 'compact'
}

// Haversine distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function SmartLocationInput({
  onSelect,
  initialValue = '',
  className = '',
  variant = 'hero',
}: SmartLocationInputProps) {
  const [query, setQuery] = useState(initialValue)
  const [areas, setAreas] = useState<(Area & { city?: { name: string; slug: string } })[]>([])
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const [results, setResults] = useState<LocationResult[]>([])
  const [nearbyAreas, setNearbyAreas] = useState<LocationResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fetchedRef = useRef(false)

  // Fetch areas and landmarks on mount
  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const supabase = createClient()

    async function loadData() {
      const [areaRes, landmarkRes] = await Promise.all([
        supabase
          .from('areas')
          .select('id, slug, name, city_id, lat, lon, city:cities(name, slug)')
          .order('name'),
        supabase
          .from('landmarks')
          .select('id, slug, name, city_id, area_id, lat, lon, type, radius_km, aliases')
          .order('name'),
      ])
      if (areaRes.data) setAreas(areaRes.data as any)
      if (landmarkRes.data) setLandmarks(landmarkRes.data as Landmark[])
    }
    loadData()
  }, [])

  // Request geolocation on focus
  const requestGeoLocation = useCallback(() => {
    if (geoStatus !== 'idle' || !navigator.geolocation) {
      if (!navigator.geolocation) setGeoStatus('denied')
      return
    }

    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setGeoStatus('granted')

        // Find nearest areas
        const withDistance = areas
          .filter((a) => a.lat && a.lon)
          .map((a) => ({
            slug: a.slug,
            name: a.name,
            type: 'area' as const,
            cityName: (a.city as any)?.name || '',
            distance: haversineDistance(latitude, longitude, a.lat, a.lon),
          }))
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 5)

        setNearbyAreas(withDistance)
      },
      () => {
        setGeoStatus('denied')
        // Show popular areas as fallback
        const popular = areas
          .slice(0, 5)
          .map((a) => ({
            slug: a.slug,
            name: a.name,
            type: 'area' as const,
            cityName: (a.city as any)?.name || '',
          }))
        setNearbyAreas(popular)
      },
      { timeout: 5000, maximumAge: 300000 }
    )
  }, [geoStatus, areas])

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTerms = expandSearchTerms(query)
    const lowerQuery = query.toLowerCase().trim()

    // Filter areas
    const matchedAreas: LocationResult[] = areas
      .filter((area) => {
        const areaName = area.name.toLowerCase()
        // Direct name match
        if (areaName.includes(lowerQuery)) return true
        // Synonym match against area name
        return searchTerms.some((term) => areaName.includes(term))
      })
      .map((area) => ({
        slug: area.slug,
        name: area.name,
        type: 'area' as const,
        cityName: (area.city as any)?.name || '',
      }))

    // Filter landmarks
    const matchedLandmarks: LocationResult[] = landmarks
      .filter((lm) => {
        const lmName = lm.name.toLowerCase()
        if (lmName.includes(lowerQuery)) return true
        // Check aliases
        if (lm.aliases?.some((alias) => alias.toLowerCase().includes(lowerQuery))) return true
        return searchTerms.some(
          (term) => lmName.includes(term) || lm.aliases?.some((a) => a.toLowerCase().includes(term))
        )
      })
      .map((lm) => ({
        slug: lm.slug,
        name: lm.name,
        type: 'landmark' as const,
      }))

    // Combine and limit
    const combined = [...matchedAreas.slice(0, 5), ...matchedLandmarks.slice(0, 3)]
    setResults(combined.slice(0, 8))
    setSelectedIndex(-1)
  }, [query, areas, landmarks])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim() ? results : nearbyAreas
    if (!items.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const item = items[selectedIndex]
      handleSelect(item)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSelect = (item: LocationResult) => {
    setQuery(item.name)
    setIsOpen(false)
    onSelect(item.slug, item.type)
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showNearby = isOpen && !query.trim() && nearbyAreas.length > 0
  const showResults = isOpen && query.trim() && results.length > 0
  const displayItems = query.trim() ? results : nearbyAreas

  const baseInputClass =
    variant === 'hero'
      ? 'w-full px-6 py-4 rounded-lg text-hustle-dark text-lg bg-amber-50 border-2 border-hustle-amber focus:outline-none focus:ring-2 focus:ring-hustle-amber/60 placeholder-hustle-dark/40'
      : 'w-full px-3 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent'

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            requestGeoLocation()
          }}
          onKeyDown={handleKeyDown}
          placeholder="📍 Area or landmark..."
          className={baseInputClass}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {geoStatus === 'loading' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-hustle-amber border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              onSelect('', 'area')
              inputRef.current?.focus()
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${variant === 'hero' ? 'text-hustle-muted hover:text-hustle-dark' : 'text-white/60 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nearby chips */}
      {showNearby && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-hustle-muted">
              {geoStatus === 'granted' ? '📍 Nearby areas' : '🔥 Popular areas'}
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {nearbyAreas.map((item, idx) => (
              <button
                key={`${item.type}-${item.slug}`}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-hustle-light transition-colors ${
                  selectedIndex === idx ? 'bg-hustle-light' : ''
                }`}
              >
                <span className="text-sm">📍</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-hustle-dark block truncate">
                    {item.name}
                  </span>
                  {item.cityName && (
                    <span className="text-xs text-hustle-muted">{item.cityName}</span>
                  )}
                </div>
                {item.distance !== undefined && (
                  <span className="text-xs text-hustle-muted shrink-0">
                    {item.distance < 1
                      ? `${Math.round(item.distance * 1000)}m`
                      : `${item.distance.toFixed(1)}km`}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {showResults && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="max-h-64 overflow-y-auto">
            {results.map((item, idx) => (
              <button
                key={`${item.type}-${item.slug}`}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-hustle-light transition-colors ${
                  selectedIndex === idx ? 'bg-hustle-light' : ''
                }`}
              >
                <span className="text-sm">
                  {item.type === 'landmark' ? '📍' : '🏘️'}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-hustle-dark block truncate">
                    {item.name}
                  </span>
                  {item.cityName && (
                    <span className="text-xs text-hustle-muted">{item.cityName}</span>
                  )}
                </div>
                <span className="text-xs text-hustle-muted capitalize shrink-0">
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
