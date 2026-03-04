"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AreaRow {
  id: string; slug: string; name: string; city_id: string;
  lat: number; lon: number; description: string | null;
  city?: { name: string } | null
}

export default function AreasListPage() {
  const [areas, setAreas] = useState<AreaRow[]>([])
  const [loading, setLoading] = useState(true)
  const [cityFilter, setCityFilter] = useState('')
  const [cities, setCities] = useState<{ id: string; name: string }[]>([])

  const fetchAreas = async (cid?: string) => {
    const url = cid ? `/api/admin/areas?city_id=${cid}` : '/api/admin/areas'
    const res = await fetch(url)
    if (res.ok) setAreas(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchAreas()
    fetch('/api/admin/cities').then(r => r.json()).then(setCities).catch(() => {})
  }, [])

  const handleFilter = (cid: string) => {
    setCityFilter(cid)
    setLoading(true)
    fetchAreas(cid || undefined)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete area "${name}"?`)) return
    const res = await fetch(`/api/admin/areas/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAreas(cityFilter || undefined)
    else alert('Failed to delete area')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-hustle-dark">Areas</h2>
        <div className="flex items-center gap-3">
          <select value={cityFilter} onChange={(e) => handleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All cities</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Link href="/dashboard/admin/areas/new"
            className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors">
            + Add Area
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">City</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Coordinates</th>
              <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
            ) : areas.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-hustle-muted">No areas found</td></tr>
            ) : areas.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-hustle-dark">{a.name}</td>
                <td className="px-4 py-3 text-hustle-muted">{a.city?.name || '-'}</td>
                <td className="px-4 py-3 text-hustle-muted">{a.lat.toFixed(2)}, {a.lon.toFixed(2)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/dashboard/admin/areas/${a.id}/edit`} className="text-hustle-blue hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(a.id, a.name)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
