"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLandmarkPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [cities, setCities] = useState<{ id: string; name: string }[]>([])
  const [areas, setAreas] = useState<{ id: string; name: string; city_id: string }[]>([])
  const [form, setForm] = useState({ name: '', city_id: '', area_id: '', lat: '', lon: '', type: 'general', radius_km: '1.0', description: '' })

  useEffect(() => {
    fetch('/api/admin/cities').then(r => r.json()).then(setCities).catch(() => {})
    fetch('/api/admin/areas').then(r => r.json()).then(setAreas).catch(() => {})
  }, [])

  const filteredAreas = areas.filter(a => !form.city_id || a.city_id === form.city_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/landmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        lat: parseFloat(form.lat) || 0,
        lon: parseFloat(form.lon) || 0,
        radius_km: parseFloat(form.radius_km) || 1.0,
        area_id: form.area_id || null,
        aliases: [],
      }),
    })
    if (res.ok) router.push('/dashboard/admin/landmarks')
    else { const d = await res.json(); setError(d.error || 'Failed to create landmark') }
    setSaving(false)
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-hustle-dark mb-4">Add New Landmark</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" placeholder="e.g. The Palms Shopping Mall" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">City *</label>
          <select required value={form.city_id} onChange={(e) => setForm({ ...form, city_id: e.target.value, area_id: '' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent">
            <option value="">Select city...</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Area (optional)</label>
          <select value={form.area_id} onChange={(e) => setForm({ ...form, area_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent">
            <option value="">None</option>
            {filteredAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent">
              <option value="general">General</option>
              <option value="mall">Mall</option>
              <option value="market">Market</option>
              <option value="transport">Transport Hub</option>
              <option value="historical">Historical</option>
              <option value="religious">Religious</option>
              <option value="educational">Educational</option>
              <option value="government">Government</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Radius (km)</label>
            <input type="number" step="0.1" value={form.radius_km} onChange={(e) => setForm({ ...form, radius_km: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" />
          </div>
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
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" rows={3} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Create Landmark'}
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
