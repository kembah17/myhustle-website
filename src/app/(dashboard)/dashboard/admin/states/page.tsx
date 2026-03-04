"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { State } from '@/lib/types'

export default function StatesListPage() {
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStates = async () => {
    const res = await fetch('/api/admin/states')
    if (res.ok) setStates(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchStates() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete state "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/states/${id}`, { method: 'DELETE' })
    if (res.ok) fetchStates()
    else alert('Failed to delete state')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">States</h2>
        <Link
          href="/dashboard/admin/states/new"
          className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors"
        >
          + Add State
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Code</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Geo Zone</th>
              <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
            ) : states.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">No states found</td></tr>
            ) : states.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-hustle-dark">{s.name}</td>
                <td className="px-4 py-3 text-hustle-muted">{s.slug}</td>
                <td className="px-4 py-3 text-hustle-muted">{s.code || '-'}</td>
                <td className="px-4 py-3 text-hustle-muted">{s.geo_zone || '-'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/dashboard/admin/states/${s.id}/edit`} className="text-hustle-blue hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(s.id, s.name)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
