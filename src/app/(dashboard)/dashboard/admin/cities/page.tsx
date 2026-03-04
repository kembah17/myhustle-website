"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CityRow {
  id: string; slug: string; name: string; state: string; state_id: string | null;
  lat: number; lon: number; state_rel?: { name: string } | null
}

export default function CitiesListPage() {
  const [cities, setCities] = useState<CityRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCities = async () => {
    const res = await fetch('/api/admin/cities')
    if (res.ok) setCities(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchCities() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete city "${name}"? This will affect all areas and businesses in this city.`)) return
    const res = await fetch(`/api/admin/cities/${id}`, { method: 'DELETE' })
    if (res.ok) fetchCities()
    else alert('Failed to delete city')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">Cities</h2>
        <Link href="/dashboard/admin/cities/new"
          className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors">
          + Add City
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">State</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Coordinates</th>
              <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
            ) : cities.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">No cities found</td></tr>
            ) : cities.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-hustle-dark">{c.name}</td>
                <td className="px-4 py-3 text-hustle-muted">{c.slug}</td>
                <td className="px-4 py-3 text-hustle-muted">{c.state || '-'}</td>
                <td className="px-4 py-3 text-hustle-muted">{c.lat.toFixed(2)}, {c.lon.toFixed(2)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/dashboard/admin/cities/${c.id}/edit`} className="text-hustle-blue hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
