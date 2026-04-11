"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BusinessRow {
  id: string
  name: string
  slug: string
  phone: string | null
  active: boolean
  user_id: string | null
  created_at: string
  category: { name: string } | null
  city: { name: string } | null
  area: { name: string } | null
}

export default function BusinessesAdminPage() {
  const [businesses, setBusinesses] = useState<BusinessRow[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [claimedFilter, setClaimedFilter] = useState('all')
  const [toggling, setToggling] = useState<string | null>(null)

  const fetchBusinesses = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (claimedFilter !== 'all') params.set('claimed', claimedFilter)
    const res = await fetch(`/api/admin/businesses?${params}`)
    if (res.ok) {
      const json = await res.json()
      setBusinesses(json.data || [])
      setTotalCount(json.count || 0)
    }
    setLoading(false)
  }

  useEffect(() => { fetchBusinesses() }, [statusFilter, claimedFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBusinesses()
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    setToggling(id)
    const res = await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !currentActive }),
    })
    if (res.ok) {
      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, active: !currentActive } : b))
      )
    } else {
      alert('Failed to update status')
    }
    setToggling(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">
          Businesses {!loading && <span className="text-hustle-muted font-normal">({totalCount})</span>}
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
          />
          <button
            type="submit"
            className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors"
          >
            Search
          </button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={claimedFilter}
          onChange={(e) => setClaimedFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
        >
          <option value="all">All Claims</option>
          <option value="claimed">Claimed</option>
          <option value="unclaimed">Unclaimed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Name</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Category</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Area / City</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Claimed</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Created</th>
                <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
              ) : businesses.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-hustle-muted">No businesses found</td></tr>
              ) : (
                businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-hustle-dark max-w-[200px] truncate">{b.name}</td>
                    <td className="px-4 py-3 text-hustle-muted">{b.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-hustle-muted">
                      {b.area?.name || '—'}{b.city?.name ? `, ${b.city.name}` : ''}
                    </td>
                    <td className="px-4 py-3 text-hustle-muted">{b.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {b.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.user_id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {b.user_id ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(b.id, b.active)}
                        disabled={toggling === b.id}
                        className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                          b.active
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        } disabled:opacity-50`}
                      >
                        {toggling === b.id ? '...' : b.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link
                        href={`/business/${b.slug}`}
                        target="_blank"
                        className="text-hustle-blue hover:underline text-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
