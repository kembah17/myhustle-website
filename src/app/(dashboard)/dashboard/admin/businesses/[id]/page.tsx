"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface BusinessDetail {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  phone2: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  address: string | null
  tagline: string | null
  active: boolean
  verified: boolean
  tier: string
  user_id: string | null
  category_id: string
  city_id: string
  area_id: string | null
  created_at: string
  updated_at: string
  category: { id: string; name: string } | null
  city: { id: string; name: string } | null
  area: { id: string; name: string } | null
}

interface CategoryOption {
  id: string
  name: string
}

export default function AdminBusinessDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [business, setBusiness] = useState<BusinessDetail | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    phone2: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
    tagline: '',
    category_id: '',
    active: true,
    verified: false,
  })

  useEffect(() => {
    fetchBusiness()
    fetchCategories()
  }, [id])

  const fetchBusiness = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/businesses/${id}`)
    if (res.ok) {
      const data = await res.json()
      setBusiness(data)
      setForm({
        name: data.name || '',
        description: data.description || '',
        phone: data.phone || '',
        phone2: data.phone2 || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        website: data.website || '',
        address: data.address || '',
        tagline: data.tagline || '',
        category_id: data.category_id || '',
        active: data.active ?? true,
        verified: data.verified ?? false,
      })
    } else {
      setMessage({ type: 'error', text: 'Failed to load business' })
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories')
    if (res.ok) {
      const json = await res.json()
      setCategories(json.data || json || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const res = await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const updated = await res.json()
      setBusiness((prev) => prev ? { ...prev, ...updated } : prev)
      setMessage({ type: 'success', text: 'Business updated successfully' })
    } else {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }))
      setMessage({ type: 'error', text: err.error || 'Failed to update' })
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to DELETE this business? This cannot be undone.')) return
    const res = await fetch(`/api/admin/businesses/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard/admin/businesses')
    } else {
      setMessage({ type: 'error', text: 'Failed to delete business' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hustle-blue"></div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-hustle-muted">Business not found</p>
        <Link href="/dashboard/admin/businesses" className="text-hustle-blue hover:underline mt-2 inline-block">
          ← Back to businesses
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin/businesses"
            className="text-sm text-hustle-muted hover:text-hustle-blue transition-colors"
          >
            ← Back to businesses
          </Link>
          <h2 className="text-xl font-semibold text-hustle-dark mt-1">{business.name}</h2>
          <p className="text-sm text-hustle-muted">
            ID: {business.id} • Slug: {business.slug}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/business/${business.slug}`}
            target="_blank"
            className="text-sm bg-gray-100 text-hustle-dark px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Public Page ↗
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Meta info */}
      <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-hustle-muted">Category</span>
          <p className="font-medium text-hustle-dark">{business.category?.name || '—'}</p>
        </div>
        <div>
          <span className="text-hustle-muted">City</span>
          <p className="font-medium text-hustle-dark">{business.city?.name || '—'}</p>
        </div>
        <div>
          <span className="text-hustle-muted">Area</span>
          <p className="font-medium text-hustle-dark">{business.area?.name || '—'}</p>
        </div>
        <div>
          <span className="text-hustle-muted">Claimed</span>
          <p className="font-medium text-hustle-dark">{business.user_id ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <span className="text-hustle-muted">Created</span>
          <p className="font-medium text-hustle-dark">{new Date(business.created_at).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-hustle-muted">Updated</span>
          <p className="font-medium text-hustle-dark">{new Date(business.updated_at).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="text-hustle-muted">Tier</span>
          <p className="font-medium text-hustle-dark">{business.tier}</p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-hustle-dark">Edit Business</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">Business Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
            />
          </div>

          {/* Phone 2 */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">Phone 2</label>
            <input
              type="text"
              value={form.phone2}
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">WhatsApp</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">Website</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-hustle-muted mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-hustle-muted mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-hustle-muted mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
          />
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="rounded border-gray-300 text-hustle-blue focus:ring-hustle-blue/20"
            />
            <span className="text-sm font-medium text-hustle-dark">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => setForm({ ...form, verified: e.target.checked })}
              className="rounded border-gray-300 text-hustle-blue focus:ring-hustle-blue/20"
            />
            <span className="text-sm font-medium text-hustle-dark">Verified</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-hustle-blue text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
