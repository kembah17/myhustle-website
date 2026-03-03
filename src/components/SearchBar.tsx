'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/lib/types'

interface SearchBarProps {
  initialQuery?: string
  initialCategory?: string
  variant?: 'hero' | 'compact'
}

export default function SearchBar({ initialQuery = '', initialCategory = '', variant = 'hero' }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [categorySlug, setCategorySlug] = useState(initialCategory)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name')
      if (data) setCategories(data)
    }
    loadCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (categorySlug) params.set('category', categorySlug)
    router.push(`/search?${params.toString()}`)
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search businesses..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-hustle-dark text-sm focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-hustle-amber text-hustle-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
        >
          Search
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="flex-1 px-6 py-4 rounded-lg text-hustle-dark text-lg focus:outline-none focus:ring-2 focus:ring-hustle-amber"
        />
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="px-4 py-4 rounded-lg text-hustle-dark text-base focus:outline-none focus:ring-2 focus:ring-hustle-amber bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-hustle-amber text-hustle-dark px-8 py-4 rounded-lg text-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}
