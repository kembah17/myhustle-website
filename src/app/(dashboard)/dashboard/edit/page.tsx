'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import type { Business, Category, Area, BusinessHour } from '@/lib/types'

type AreaWithCity = Omit<Area, 'city'> & {
  city?: { name: string; state: string }
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface HourForm {
  day: number
  open_time: string
  close_time: string
  closed: boolean
  id?: string
}

export default function EditBusinessPage() {
  const { user, loading: authLoading } = useAuth()
  const [business, setBusiness] = useState<Business | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<AreaWithCity[]>([])
  const [hours, setHours] = useState<HourForm[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingHours, setSavingHours] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    category_id: '',
    area_id: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    cover_photo_url: '',
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
      tagline: biz.tagline || '',
      description: biz.description || '',
      category_id: biz.category_id || '',
      area_id: biz.area_id || '',
      address: biz.address || '',
      phone: biz.phone || '',
      whatsapp: biz.whatsapp || '',
      email: biz.email || '',
      website: biz.website || '',
      cover_photo_url: biz.cover_photo_url || '',
    })

    // Fetch business hours
    const { data: existingHours } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', biz.id)
      .order('day')

    if (existingHours && existingHours.length > 0) {
      setHours(existingHours.map((h: BusinessHour) => ({
        day: h.day,
        open_time: h.open_time || '09:00',
        close_time: h.close_time || '17:00',
        closed: h.closed,
        id: h.id,
      })))
    } else {
      setHours(DAYS.map((_, i) => ({
        day: i,
        open_time: '09:00',
        close_time: '17:00',
        closed: i >= 6,
      })))
    }

    setLoading(false)
  }, [user, supabase, router])

  useEffect(() => {
    if (!authLoading) fetchData()
  }, [authLoading, fetchData])

  const updateHour = (index: number, field: keyof HourForm, value: string | boolean) => {
    setHours(prev => prev.map((h, i) =>
      i === index ? { ...h, [field]: value } : h
    ))
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !business) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please select an image file', type: 'error' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'Image must be under 5MB', type: 'error' })
      return
    }

    setUploadingCover(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const filePath = `covers/${business.id}/cover.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl
      setForm(f => ({ ...f, cover_photo_url: publicUrl }))
      setToast({ message: 'Cover photo uploaded! Click Save Details to apply.', type: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload cover photo'
      setToast({ message, type: 'error' })
    } finally {
      setUploadingCover(false)
    }
  }

  const handleSave = async () => {
    if (!business) return
    setSaving(true)

    const { error } = await supabase
      .from('businesses')
      .update({
        name: form.name,
        tagline: form.tagline || null,
        description: form.description,
        category_id: form.category_id || null,
        area_id: form.area_id || null,
        address: form.address || null,
        phone: form.phone,
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        website: form.website || null,
        cover_photo_url: form.cover_photo_url || null,
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

  const handleSaveHours = async () => {
    if (!business) return
    setSavingHours(true)

    try {
      await supabase
        .from('business_hours')
        .delete()
        .eq('business_id', business.id)

      const hoursData = hours.map(h => ({
        business_id: business.id,
        day: h.day,
        open_time: h.closed ? null : h.open_time,
        close_time: h.closed ? null : h.close_time,
        closed: h.closed,
      }))

      const { error } = await supabase
        .from('business_hours')
        .insert(hoursData)

      if (error) throw error
      setToast({ message: 'Business hours updated!', type: 'success' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update hours'
      setToast({ message, type: 'error' })
    } finally {
      setSavingHours(false)
    }
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
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">Edit Business Profile</h1>
          <p className="text-hustle-muted">Update your business information, photos, and hours</p>
        </div>

        {/* Cover Photo Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="relative h-[200px] w-full">
            {form.cover_photo_url ? (
              <img
                src={form.cover_photo_url}
                alt="Cover photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-hustle-blue via-hustle-blue/90 to-hustle-dark flex items-center justify-center">
                <div className="text-center text-white/70">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <p className="text-sm">No cover photo yet</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 right-4">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/90 backdrop-blur-sm text-hustle-dark hover:bg-white transition-colors shadow-md flex items-center gap-2"
              >
                {uploadingCover ? (
                  <><LoadingSpinner size="sm" /> Uploading...</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {form.cover_photo_url ? 'Change Cover Photo' : 'Upload Cover Photo'}
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-hustle-muted px-6 py-2">Recommended: 1200x400px, max 5MB. Shows on your business profile page.</p>
        </div>

        {/* Business Details Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-hustle-dark border-b border-gray-100 pb-3">Business Details</h2>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setForm(f => ({ ...f, tagline: e.target.value }))
                }
              }}
              maxLength={100}
              placeholder="e.g. No.1 Screen Doctor in Lagos \ud83d\udcaf"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-hustle-muted">A short catchy slogan for your business. Emojis welcome!</p>
              <p className={`text-xs ${form.tagline.length > 80 ? 'text-hustle-amber' : 'text-hustle-muted'} ${form.tagline.length >= 100 ? '!text-red-500' : ''}`}>
                {form.tagline.length}/100
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">
                Category <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-hustle-dark mb-1">
                Area <span className="text-red-500">*</span>
              </label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+234 801 234 5678"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">WhatsApp</label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                placeholder="+234 801 234 5678"
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
                placeholder="business@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hustle-dark mb-1">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
                placeholder="https://www.example.com"
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
              placeholder="Tell customers about your business, services, and what makes you unique..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent resize-none"
            />
            <p className="text-xs text-hustle-muted mt-1">{form.description.length}/500 characters</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.phone}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <><LoadingSpinner size="sm" /> Saving...</> : 'Save Details'}
            </button>
          </div>
        </div>

        {/* Business Hours Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-lg font-semibold text-hustle-dark border-b border-gray-100 pb-3 mb-4">Business Hours</h2>

          <div className="space-y-3">
            {DAYS.map((day, i) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-hustle-light">
                <div className="w-28 text-sm font-medium text-hustle-dark">{day}</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!hours[i]?.closed}
                    onChange={(e) => updateHour(i, 'closed', !e.target.checked)}
                    className="rounded border-gray-300 text-hustle-blue focus:ring-hustle-blue"
                  />
                  <span className="text-sm text-hustle-muted">Open</span>
                </label>
                {hours[i] && !hours[i].closed ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={hours[i].open_time}
                      onChange={(e) => updateHour(i, 'open_time', e.target.value)}
                      className="px-2 py-1.5 rounded border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
                    />
                    <span className="text-hustle-muted text-sm">to</span>
                    <input
                      type="time"
                      value={hours[i].close_time}
                      onChange={(e) => updateHour(i, 'close_time', e.target.value)}
                      className="px-2 py-1.5 rounded border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-red-500 font-medium">Closed</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
            <button
              onClick={handleSaveHours}
              disabled={savingHours}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {savingHours ? <><LoadingSpinner size="sm" /> Saving...</> : 'Save Hours'}
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
