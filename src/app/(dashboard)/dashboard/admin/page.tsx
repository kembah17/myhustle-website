"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

interface Counts {
  states: number
  cities: number
  areas: number
  landmarks: number
  categories: number
  businesses: number
  pendingClaims: number
  openFlags: number
  users: number
  pendingSuggestions: number
}

export default function AdminOverview() {
  const [counts, setCounts] = useState<Counts>({
    states: 0, cities: 0, areas: 0, landmarks: 0, categories: 0,
    businesses: 0, pendingClaims: 0, openFlags: 0, users: 0, pendingSuggestions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [revalidating, setRevalidating] = useState(false)
  const [revalMsg, setRevalMsg] = useState('')

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('states').select('id', { count: 'exact', head: true }),
      supabase.from('cities').select('id', { count: 'exact', head: true }),
      supabase.from('areas').select('id', { count: 'exact', head: true }),
      supabase.from('landmarks').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('businesses').select('id', { count: 'exact', head: true }),
      supabase.from('claim_attempts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('listing_flags').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('business_suggestions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then(([s, c, a, l, cat, b, claims, flags, suggestions]) => {
      setCounts({
        states: s.count || 0,
        cities: c.count || 0,
        areas: a.count || 0,
        landmarks: l.count || 0,
        categories: cat.count || 0,
        businesses: b.count || 0,
        pendingClaims: claims.count || 0,
        openFlags: flags.count || 0,
        users: 0, // fetched separately via API
        pendingSuggestions: suggestions.count || 0,
      })
      setLoading(false)
    })

    // Fetch user count from admin API
    fetch('/api/admin/users').then(res => {
      if (res.ok) return res.json()
      return null
    }).then(json => {
      if (json?.count) {
        setCounts(prev => ({ ...prev, users: json.count }))
      }
    }).catch(() => {})
  }, [])

  const handleRevalidate = async () => {
    setRevalidating(true)
    setRevalMsg('')
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: ['cities', 'areas', 'categories', 'landmarks'] }),
      })
      const data = await res.json()
      setRevalMsg(data.message || 'Pages revalidated successfully')
    } catch {
      setRevalMsg('Failed to revalidate')
    }
    setRevalidating(false)
  }

  const cards = [
    { label: 'Businesses', count: counts.businesses, href: '/dashboard/admin/businesses', icon: '🏢' },
    { label: 'Pending Claims', count: counts.pendingClaims, href: '/dashboard/admin/claims', icon: '📋', badge: true, badgeColor: 'bg-amber-100 text-amber-700' },
    { label: 'Open Flags', count: counts.openFlags, href: '/dashboard/admin/flags', icon: '🚩', badge: true, badgeColor: 'bg-red-100 text-red-700' },
    { label: 'Users', count: counts.users, href: '/dashboard/admin/users', icon: '👥' },
    { label: 'Suggestions', count: counts.pendingSuggestions, href: '/dashboard/admin/suggestions', icon: '💡', badge: true, badgeColor: 'bg-amber-100 text-amber-700' },
    { label: 'States', count: counts.states, href: '/dashboard/admin/states', icon: '🗺️' },
    { label: 'Cities', count: counts.cities, href: '/dashboard/admin/cities', icon: '🏙️' },
    { label: 'Areas', count: counts.areas, href: '/dashboard/admin/areas', icon: '📍' },
    { label: 'Landmarks', count: counts.landmarks, href: '/dashboard/admin/landmarks', icon: '🏛️' },
    { label: 'Categories', count: counts.categories, href: '/dashboard/admin/categories', icon: '📂' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold text-hustle-dark">
              {loading ? '...' : card.count}
            </div>
            <div className="text-sm text-hustle-muted flex items-center gap-2">
              {card.label}
              {card.badge && !loading && card.count > 0 && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${card.badgeColor}`}>
                  {card.count}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-hustle-dark mb-3">Cache Management</h2>
        <p className="text-sm text-hustle-muted mb-4">
          After making data changes, rebuild static pages to reflect updates on the public site.
        </p>
        <button
          onClick={handleRevalidate}
          disabled={revalidating}
          className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 disabled:opacity-50 transition-colors"
        >
          {revalidating ? 'Rebuilding...' : '🔄 Rebuild Pages'}
        </button>
        {revalMsg && <p className="text-sm text-green-600 mt-2">{revalMsg}</p>}
      </div>
    </div>
  )
}
