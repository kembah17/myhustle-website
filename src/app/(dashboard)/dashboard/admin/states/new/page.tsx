"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewStatePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', code: '', geo_zone: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/dashboard/admin/states')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create state')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-hustle-dark mb-4">Add New State</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" placeholder="e.g. Lagos State" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Code</label>
          <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" placeholder="e.g. LA" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Geo Zone</label>
          <select value={form.geo_zone} onChange={(e) => setForm({ ...form, geo_zone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent">
            <option value="">Select zone...</option>
            <option value="South-West">South-West</option>
            <option value="South-East">South-East</option>
            <option value="South-South">South-South</option>
            <option value="North-Central">North-Central</option>
            <option value="North-East">North-East</option>
            <option value="North-West">North-West</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Create State'}
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
