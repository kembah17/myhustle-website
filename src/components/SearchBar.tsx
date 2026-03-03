'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category, Area } from '@/lib/types'

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
  const [areas, setAreas] = useState<Area[]>([])

  useEffect(() => {
    async function loadFilters() {
      const [catRes, areaRes] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('name'),
        supabase
          .from('areas')
          .select('*')
          .order('name'),
      ])
      if (catRes.data) setCategories(catRes.data)
      if (areaRes.data) setAreas(areaRes.data)
    }
    loadFilters()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (categorySlug) params.set('category', categorySlug)
    if (areaSlug) params.set('area', areaSlug)
    if (sort && sort !== 'relevant') params.set('sort', sort)
    router.push(`/search?${params.toString()}`)
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
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
          <select
            value={areaSlug}
            onChange={(e) => setAreaSlug(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-hustle-amber [&>option]:text-hustle-dark [&>option]:bg-white"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.slug}>
                {area.name}
              </option>
            ))}
          </select>
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
    <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 px-6 py-4 rounded-lg text-hustle-dark text-lg focus:outline-none focus:ring-2 focus:ring-hustle-amber"
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
            className="flex-1 px-4 py-3 rounded-lg text-hustle-dark text-base focus:outline-none focus:ring-2 focus:ring-hustle-amber bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <select
            value={areaSlug}
            onChange={(e) => setAreaSlug(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-hustle-dark text-base focus:outline-none focus:ring-2 focus:ring-hustle-amber bg-white"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.slug}>
                {area.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-hustle-dark text-base focus:outline-none focus:ring-2 focus:ring-hustle-amber bg-white"
          >
            <option value="relevant">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </div>
    </form>
  )
}
