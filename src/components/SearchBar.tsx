'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import SmartLocationInput from '@/components/search/SmartLocationInput'
import SearchAutocomplete from '@/components/search/SearchAutocomplete'
import type { Category } from '@/lib/types'

interface SearchBarProps {
  initialQuery?: string
  initialCategory?: string
  initialArea?: string
  initialSort?: string
  variant?: 'hero' | 'compact'
}

export default function SearchBar({
  initialQuery = '',
  initialCategory = '',
  initialArea = '',
  initialSort = '',
  variant = 'hero',
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [categorySlug, setCategorySlug] = useState(initialCategory)
  const [areaSlug, setAreaSlug] = useState(initialArea)
  const [sort, setSort] = useState(initialSort)
  const [categories, setCategories] = useState<Category[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const supabase = createClient()
    async function loadFilters() {
      const catRes = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name')
      if (catRes.data) setCategories(catRes.data)
    }
    loadFilters()
  }, [])

  const doSearch = () => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (categorySlug) params.set('category', categorySlug)
    if (areaSlug) params.set('area', areaSlug)
    if (sort && sort !== 'relevant') params.set('sort', sort)
    router.push(`/search?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch()
  }

  const handleLocationSelect = (slug: string, type: 'area' | 'landmark') => {
    setAreaSlug(slug)
  }

  if (variant === 'compact') {
    return (
      <form ref={formRef} onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <SearchAutocomplete
            value={query}
            onChange={setQuery}
            onSubmit={doSearch}
            placeholder="Search businesses..."
            variant="compact"
          />
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-amber [&>option]:text-hustle-dark [&>option]:bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <div className="flex-1 min-w-0">
            <SmartLocationInput
              onSelect={handleLocationSelect}
              initialValue={initialArea}
              variant="compact"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-amber [&>option]:text-hustle-dark [&>option]:bg-white"
          >
            <option value="relevant">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="az">A-Z</option>
          </select>
          <button
            type="submit"
            className="bg-hustle-amber text-hustle-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-hustle-sunset hover:text-white transition-colors shrink-0"
          >
            Search
          </button>
        </div>
      </form>
    )
  }

  // Hero variant
  return (
    <form ref={formRef} onSubmit={handleSearch} className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchAutocomplete
            value={query}
            onChange={setQuery}
            onSubmit={doSearch}
            placeholder="What are you looking for?"
            variant="hero"
          />
          <button
            type="submit"
            className="bg-hustle-amber text-hustle-dark px-8 py-4 rounded-lg text-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
          >
            Search
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-hustle-dark text-base bg-amber-50 border-2 border-hustle-amber focus:outline-none focus:ring-2 focus:ring-hustle-amber/60"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <div className="flex-1 min-w-0">
            <SmartLocationInput
              onSelect={handleLocationSelect}
              initialValue={initialArea}
              variant="hero"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
