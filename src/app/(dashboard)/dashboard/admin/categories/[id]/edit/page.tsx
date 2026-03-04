"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [parents, setParents] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({ name: '', parent_id: '', icon: '', description: '', seo_title_template: '', seo_description_template: '' })

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then((cats) => {
      setParents(cats.filter((c: { parent_id: string | null; id: string }) => !c.parent_id && c.id !== id))
      const cat = cats.find((c: { id: string }) => c.id === id)
      if (cat) setForm({
        name: cat.name, parent_id: cat.parent_id || '', icon: cat.icon || '',
        description: cat.description || '', seo_title_template: cat.seo_title_template || '',
        seo_description_template: cat.seo_description_template || '',
      })
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, parent_id: form.parent_id || null }),
    })
    if (res.ok) router.push('/dashboard/admin/categories')
    else { const d = await res.json(); setError(d.error || 'Failed to update category') }
    setSaving(false)
  }

  if (loading) return <div className="text-hustle-muted py-8">Loading...</div>

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-hustle-dark mb-4">Edit Category</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Parent Category</label>
          <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent">
            <option value="">None (top-level)</option>
            {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Icon (emoji)</label>
          <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" rows={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">SEO Title Template</label>
          <input type="text" value={form.seo_title_template} onChange={(e) => setForm({ ...form, seo_title_template: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">SEO Description Template</label>
          <textarea value={form.seo_description_template} onChange={(e) => setForm({ ...form, seo_description_template: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent" rows={2} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Update Category'}
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
