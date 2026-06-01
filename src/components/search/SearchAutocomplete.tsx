'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface BusinessSuggestion {
  slug: string
  name: string
  category: string | null
  categoryIcon: string | null
  area: string | null
  city: string | null
}

interface CategorySuggestion {
  slug: string
  name: string
  icon: string | null
  isParent: boolean
}

interface AreaSuggestion {
  slug: string
  name: string
  citySlug: string | null
  cityName: string | null
}

interface AutocompleteResults {
  businesses: BusinessSuggestion[]
  categories: CategorySuggestion[]
  areas: AreaSuggestion[]
}

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  variant?: 'hero' | 'compact'
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder = 'What are you looking for?',
  variant = 'hero',
}: SearchAutocompleteProps) {
  const router = useRouter()
  const [results, setResults] = useState<AutocompleteResults | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Build flat list of all suggestions for keyboard navigation
  const flatItems = useCallback(() => {
    if (!results) return []
    const items: { type: string; index: number }[] = []
    results.businesses.forEach((_, i) => items.push({ type: 'business', index: i }))
    results.categories.forEach((_, i) => items.push({ type: 'category', index: i }))
    results.areas.forEach((_, i) => items.push({ type: 'area', index: i }))
    return items
  }, [results])

  // Fetch autocomplete results with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value || value.trim().length < 2) {
      setResults(null)
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(value.trim())}`)
        if (res.ok) {
          const data: AutocompleteResults = await res.json()
          const hasResults =
            data.businesses.length > 0 ||
            data.categories.length > 0 ||
            data.areas.length > 0
          setResults(hasResults ? data : null)
          setIsOpen(hasResults)
          setActiveIndex(-1)
        }
      } catch {
        // Silently fail — user can still search normally
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigate to selected suggestion
  const navigateTo = useCallback(
    (type: string, index: number) => {
      if (!results) return
      setIsOpen(false)

      if (type === 'business') {
        const biz = results.businesses[index]
        router.push(`/business/${biz.slug}`)
      } else if (type === 'category') {
        const cat = results.categories[index]
        router.push(`/category/${cat.slug}`)
      } else if (type === 'area') {
        const area = results.areas[index]
        if (area.citySlug) {
          router.push(`/${area.citySlug}/${area.slug}`)
        }
      }
    },
    [results, router]
  )

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = flatItems()

    if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (!isOpen || items.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      const item = items[activeIndex]
      navigateTo(item.type, item.index)
    }
  }

  const totalResults = results
    ? results.businesses.length + results.categories.length + results.areas.length
    : 0

  // Track cumulative index for keyboard navigation highlighting
  let cumulativeIndex = 0

  const inputClasses =
    variant === 'hero'
      ? 'flex-1 w-full px-6 py-4 rounded-lg text-hustle-dark text-lg bg-amber-50 border-2 border-hustle-amber focus:outline-none focus:ring-2 focus:ring-hustle-amber/60 placeholder-hustle-dark/40'
      : 'flex-1 w-full px-4 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent'

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          handleKeyDown(e)
          // Allow form submit on Enter when no suggestion is active
          if (e.key === 'Enter' && activeIndex < 0 && onSubmit) {
            onSubmit()
          }
        }}
        onFocus={() => {
          if (results && totalResults > 0) setIsOpen(true)
        }}
        placeholder={placeholder}
        enterKeyHint="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        className={inputClasses}
      />

      {/* Loading indicator */}
      {isLoading && value.length >= 2 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className={`animate-spin rounded-full border-2 border-t-transparent ${
            variant === 'hero' ? 'h-5 w-5 border-hustle-amber' : 'h-4 w-4 border-white/40'
          }`} />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && results && totalResults > 0 && (
        <div
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-[400px] overflow-y-auto"
        >
          {/* Businesses */}
          {results.businesses.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-bold text-hustle-muted uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                🏢 Businesses
              </div>
              {results.businesses.map((biz, i) => {
                const itemIndex = cumulativeIndex++
                return (
                  <button
                    key={`biz-${biz.slug}`}
                    role="option"
                    aria-selected={activeIndex === itemIndex}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-gray-50 last:border-0 ${
                      activeIndex === itemIndex
                        ? 'bg-hustle-amber/10'
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                    onClick={() => navigateTo('business', i)}
                  >
                    <span className="text-lg shrink-0 mt-0.5">
                      {biz.categoryIcon || '🏢'}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-hustle-dark truncate">
                        {biz.name}
                      </div>
                      <div className="text-xs text-hustle-muted truncate">
                        {[biz.category, biz.area, biz.city]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-bold text-hustle-muted uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                📂 Categories
              </div>
              {results.categories.map((cat, i) => {
                const itemIndex = cumulativeIndex++
                return (
                  <button
                    key={`cat-${cat.slug}`}
                    role="option"
                    aria-selected={activeIndex === itemIndex}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 ${
                      activeIndex === itemIndex
                        ? 'bg-hustle-amber/10'
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                    onClick={() => navigateTo('category', i)}
                  >
                    <span className="text-lg shrink-0">{cat.icon || '📂'}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-hustle-dark truncate">
                        {cat.name}
                      </div>
                      <div className="text-xs text-hustle-muted">
                        Browse all {cat.name.toLowerCase()} businesses
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Areas */}
          {results.areas.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-bold text-hustle-muted uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                📍 Locations
              </div>
              {results.areas.map((area, i) => {
                const itemIndex = cumulativeIndex++
                return (
                  <button
                    key={`area-${area.slug}`}
                    role="option"
                    aria-selected={activeIndex === itemIndex}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 ${
                      activeIndex === itemIndex
                        ? 'bg-hustle-amber/10'
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                    onClick={() => navigateTo('area', i)}
                  >
                    <span className="text-lg shrink-0">📍</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-hustle-dark truncate">
                        {area.name}
                      </div>
                      {area.cityName && (
                        <div className="text-xs text-hustle-muted">
                          {area.cityName}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Search for query footer */}
          <button
            className={`w-full text-left px-4 py-3 flex items-center gap-3 bg-hustle-blue/5 transition-colors hover:bg-hustle-blue/10 border-t border-gray-200`}
            onClick={() => {
              setIsOpen(false)
              onSubmit?.()
            }}
          >
            <span className="text-lg shrink-0">🔍</span>
            <div className="font-semibold text-hustle-blue text-sm">
              Search for &ldquo;{value}&rdquo;
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
