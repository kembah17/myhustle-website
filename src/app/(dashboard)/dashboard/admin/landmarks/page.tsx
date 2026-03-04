"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface LandmarkRow {
  id: string; slug: string; name: string; city_id: string; area_id: string | null;
  lat: number; lon: number; type: string; radius_km: number;
  city?: { name: string } | null; area?: { name: string } | null
}

export default function LandmarksListPage() {
  const [landmarks, setLandmarks] = useState<LandmarkRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLandmarks = async () => {
    const res = await fetch('/api/admin/landmarks')
    if (res.ok) setLandmarks(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchLandmarks() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete landmark "${name}"?`)) return
    const res = await fetch(`/api/admin/landmarks/${id}`, { method: 'DELETE' })
    if (res.ok) fetchLandmarks()
    else alert('Failed to delete landmark')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">Landmarks</h2>
        <Link href="/dashboard/admin/landmarks/new"
          className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors">
          + Add Landmark
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">City</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Type</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Radius</th>
              <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
            ) : landmarks.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">No landmarks found</td></tr>
            ) : landmarks.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-hustle-dark">{l.name}</td>
                <td className="px-4 py-3 text-hustle-muted">{l.city?.name || '-'}</td>
                <td className="px-4 py-3 text-hustle-muted">{l.type}</td>
                <td className="px-4 py-3 text-hustle-muted">{l.radius_km} km</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/dashboard/admin/landmarks/${l.id}/edit`} className="text-hustle-blue hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(l.id, l.name)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
