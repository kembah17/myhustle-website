'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import type { Business, Category, Area } from '@/lib/types'

type AreaWithCity = Omit<Area, 'city'> & {
  city?: { name: string; state: string }
}

export default function EditBusinessPage() {
  const { user, loading: authLoading } = useAuth()
  const [business, setBusiness] = useState<Business | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<AreaWithCity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    area_id: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
  })

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [bizRes, catRes, areaRes] = await Promise.all([
      supabase.from('businesses').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('categories').select('*').is('parent_id', null).order('name'),
      supabase.from('areas').select('*, city:cities(name, state)').order('name'),
    ])

    if (!bizRes.data) {
      router.push('/onboarding')
      return
    }

    const biz = bizRes.data
    setBusiness(biz)
    setCategories(catRes.data || [])
    setAreas((areaRes.data || []) as AreaWithCity[])

    setForm({
      name: biz.name || '',
      description: biz.description || '',
      category_id: biz.category_id || '',
      area_id: biz.area_id || '',
      address: biz.address || '',
      phone: biz.phone || '',
      whatsapp: biz.whatsapp || '',
      email: biz.email || '',
      website: biz.website || '',
    })

    setLoading(false)
  }, [user, supabase, router])

  useEffect(() => {
    if (!authLoading) fetchData()
  }, [authLoading, fetchData])

  const handleSave = async () => {
    if (!business) return
    setSaving(true)

    const { error } = await supabase
      .from('businesses')
      .update({
        name: form.name,
        description: form.description,
        category_id: form.category_id || null,
        area_id: form.area_id || null,
        address: form.address || null,
        phone: form.phone,
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        website: form.website || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', business.id)

    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: 'Business details updated!', type: 'success' })
    }
    setSaving(false)
  }

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">Edit Business Details</h1>
          <p className="text-hustle-muted">Update your business information</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Business Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Area</label>
            <select
              value={form.area_id}
              onChange={(e) => setForm(f => ({ ...f, area_id: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            >
              <option value="">Select area</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}{a.city ? ` - ${a.city.name}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">WhatsApp</label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <><LoadingSpinner size="sm" /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
