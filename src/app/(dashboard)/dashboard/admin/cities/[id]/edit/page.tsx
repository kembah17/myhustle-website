"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import type { State } from '@/lib/types'

export default function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [states, setStates] = useState<State[]>([])
  const [form, setForm] = useState({ name: '', state_id: '', state: '', lat: '', lon: '' })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/cities').then(r => r.json()),
      fetch('/api/admin/states').then(r => r.json()),
    ]).then(([cities, sts]) => {
      setStates(sts)
      const city = cities.find((c: { id: string }) => c.id === id)
      if (city) setForm({ name: city.name, state_id: city.state_id || '', state: city.state || '', lat: String(city.lat), lon: String(city.lon) })
      setLoading(false)
    })
  }, [id])

  const handleStateChange = (stateId: string) => {
    const st = states.find(s => s.id === stateId)
    setForm({ ...form, state_id: stateId, state: st?.name || '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/cities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, lat: parseFloat(form.lat) || 0, lon: parseFloat(form.lon) || 0 }),
    })
    if (res.ok) router.push('/dashboard/admin/cities')
    else { const d = await res.json(); setError(d.error || 'Failed to update city') }
    setSaving(false)
  }

  if (loading) return <div className="text-hustle-muted py-8">Loading...</div>

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-hustle-dark mb-4">Edit City</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">State</label>
          <select value={form.state_id} onChange={(e) => handleStateChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent">
            <option value="">Select state...</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Latitude</label>
            <input type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Longitude</label>
            <input type="number" step="any" value={form.lon} onChange={(e) => setForm({ ...form, lon: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Update City'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="border border-gray-300 text-hustle-dark px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
