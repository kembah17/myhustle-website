'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ProgressSteps from '@/components/ui/ProgressSteps'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import type { Category, Area } from '@/lib/types'

const STEPS = ['Basics', 'Location', 'Contact', 'Hours', 'Description', 'Review']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface HourEntry {
  day: number
  open_time: string
  close_time: string
  closed: boolean
}

interface FormData {
  name: string
  category_id: string
  subcategory_id: string
  area_id: string
  address: string
  phone: string
  whatsapp: string
  email: string
  website: string
  description: string
  hours: HourEntry[]
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatNigerianPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('234')) return '+' + digits
  if (digits.startsWith('0') && digits.length > 1) return '+234' + digits.slice(1)
  if (digits.length === 10 && !digits.startsWith('0')) return '+234' + digits
  return value
}

type AreaWithCity = Omit<Area, 'city'> & {
  city?: { name: string; state: string }
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<AreaWithCity[]>([])
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category_id: '',
    subcategory_id: '',
    area_id: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    description: '',
    hours: DAYS.map((_, i) => ({
      day: i,
      open_time: '09:00',
      close_time: '17:00',
      closed: i >= 6,
    })),
  })

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }))
    }
  }, [user, formData.email])

  useEffect(() => {
    if (user?.user_metadata?.business_name && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.user_metadata.business_name }))
    }
  }, [user, formData.name])

  const fetchData = useCallback(async () => {
    setDataLoading(true)
    const [catRes, areaRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('areas').select('*, city:cities(name, state)').order('name'),
    ])
    if (catRes.data) {
      setCategories(catRes.data.filter((c: Category) => !c.parent_id))
    }
    if (areaRes.data) setAreas(areaRes.data as AreaWithCity[])
    setDataLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (formData.category_id) {
      supabase
        .from('categories')
        .select('*')
        .eq('parent_id', formData.category_id)
        .order('name')
        .then(({ data }) => {
          setSubcategories(data || [])
        })
    } else {
      setSubcategories([])
    }
  }, [formData.category_id, supabase])

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateHour = (dayIndex: number, field: keyof HourEntry, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      hours: prev.hours.map((h, i) =>
        i === dayIndex ? { ...h, [field]: value } : h
      ),
    }))
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!(formData.name && formData.category_id)
      case 1: return !!(formData.area_id)
      case 2: return !!(formData.phone)
      case 3: return true
      case 4: return !!(formData.description && formData.description.length >= 20)
      default: return true
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)

    try {
      let slug = generateSlug(formData.name)
      const { data: existing } = await supabase
        .from('businesses')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle()

      if (existing) slug = `${slug}-${Date.now().toString(36)}`

      const categoryId = formData.subcategory_id || formData.category_id
      const area = areas.find(a => a.id === formData.area_id)

      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .insert({
          name: formData.name,
          slug,
          description: formData.description,
          category_id: categoryId,
          area_id: formData.area_id,
          city_id: area?.city_id || null,
          phone: formData.phone,
          whatsapp: formData.whatsapp ? formatNigerianPhone(formData.whatsapp) : null,
          email: formData.email || null,
          website: formData.website || null,
          address: formData.address || null,
          user_id: user.id,
          verified: false,
          active: true,
        })
        .select()
        .single()

      if (bizError) throw bizError

      if (business) {
        const hoursData = formData.hours.map(h => ({
          business_id: business.id,
          day: h.day,
          open_time: h.closed ? null : h.open_time,
          close_time: h.closed ? null : h.close_time,
          closed: h.closed,
        }))

        await supabase.from('business_hours').insert(hoursData)
      }

      setToast({ message: 'Business listed successfully! Redirecting...', type: 'success' })
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create listing'
      setToast({ message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-hustle-light flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-hustle-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hustle-light">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className="bg-hustle-blue text-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="inline-block">
            <span className="font-heading text-2xl font-bold">
              My<span className="text-hustle-amber">Hustle</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-hustle-dark mb-2">
            Set Up Your Business Listing
          </h1>
          <p className="text-hustle-muted">Complete these steps to get your business listed on MyHustle</p>
        </div>

        <div className="mb-8">
          <ProgressSteps steps={STEPS} currentStep={step} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Step 0: Basics */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Business Basics</h2>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Business Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                  placeholder="e.g. Ada's Hair Studio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => {
                    updateField('category_id', e.target.value)
                    updateField('subcategory_id', '')
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              {subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-hustle-dark mb-1">Subcategory</label>
                  <select
                    value={formData.subcategory_id}
                    onChange={(e) => updateField('subcategory_id', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                  >
                    <option value="">Select a subcategory (optional)</option>
                    {subcategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Location</h2>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Area *</label>
                <select
                  value={formData.area_id}
                  onChange={(e) => updateField('area_id', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                >
                  <option value="">Select your area</option>
                  {areas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name}{a.city ? ` - ${a.city.name}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                  placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Contact Information</h2>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                  placeholder="08012345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                  placeholder="08012345678 (auto-formats to +234)"
                />
                {formData.whatsapp && (
                  <p className="text-xs text-hustle-muted mt-1">
                    Will be saved as: {formatNigerianPhone(formData.whatsapp)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          )}

          {/* Step 3: Hours */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Business Hours</h2>
              <p className="text-sm text-hustle-muted">Set your opening hours for each day of the week.</p>
              <div className="space-y-3">
                {DAYS.map((day, i) => (
                  <div key={day} className="flex items-center gap-3 p-3 rounded-lg bg-hustle-light">
                    <div className="w-24 text-sm font-medium text-hustle-dark">{day}</div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!formData.hours[i].closed}
                        onChange={(e) => updateHour(i, 'closed', !e.target.checked)}
                        className="rounded border-gray-300 text-hustle-blue focus:ring-hustle-blue"
                      />
                      <span className="text-sm text-hustle-muted">Open</span>
                    </label>
                    {!formData.hours[i].closed && (
                      <>
                        <input
                          type="time"
                          value={formData.hours[i].open_time}
                          onChange={(e) => updateHour(i, 'open_time', e.target.value)}
                          className="px-2 py-1.5 rounded border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
                        />
                        <span className="text-hustle-muted">to</span>
                        <input
                          type="time"
                          value={formData.hours[i].close_time}
                          onChange={(e) => updateHour(i, 'close_time', e.target.value)}
                          className="px-2 py-1.5 rounded border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
                        />
                      </>
                    )}
                    {formData.hours[i].closed && (
                      <span className="text-sm text-red-500 font-medium">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Description</h2>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">
                  Business Description * <span className="text-hustle-muted font-normal">(min. 20 characters)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent resize-none"
                  placeholder="Tell customers about your business, services, and what makes you special..."
                />
                <p className="text-xs text-hustle-muted mt-1">
                  {formData.description.length}/20 characters minimum
                </p>
              </div>
              <div className="bg-hustle-light rounded-lg p-4 border border-dashed border-gray-300">
                <p className="text-sm text-hustle-muted text-center">
                  Photo uploads coming soon! You can add photos from your dashboard after setup.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Review Your Listing</h2>
              <p className="text-sm text-hustle-muted">Please review your details before submitting.</p>

              <div className="space-y-3">
                <div className="p-4 bg-hustle-light rounded-lg">
                  <h3 className="text-sm font-medium text-hustle-muted mb-1">Business Name</h3>
                  <p className="text-hustle-dark font-medium">{formData.name}</p>
                  <p className="text-xs text-hustle-muted">URL: myhustle.com/business/{generateSlug(formData.name)}</p>
                </div>

                <div className="p-4 bg-hustle-light rounded-lg">
                  <h3 className="text-sm font-medium text-hustle-muted mb-1">Category</h3>
                  <p className="text-hustle-dark">
                    {categories.find(c => c.id === formData.category_id)?.name || 'N/A'}
                    {formData.subcategory_id && subcategories.find(c => c.id === formData.subcategory_id) && (
                      <span> &rarr; {subcategories.find(c => c.id === formData.subcategory_id)?.name}</span>
                    )}
                  </p>
                </div>

                <div className="p-4 bg-hustle-light rounded-lg">
                  <h3 className="text-sm font-medium text-hustle-muted mb-1">Location</h3>
                  <p className="text-hustle-dark">
                    {areas.find(a => a.id === formData.area_id)?.name || 'N/A'}
                    {formData.address && <span> &bull; {formData.address}</span>}
                  </p>
                </div>

                <div className="p-4 bg-hustle-light rounded-lg">
                  <h3 className="text-sm font-medium text-hustle-muted mb-1">Contact</h3>
                  <p className="text-hustle-dark">Phone: {formData.phone}</p>
                  {formData.whatsapp && <p className="text-hustle-dark">WhatsApp: {formatNigerianPhone(formData.whatsapp)}</p>}
                  {formData.email && <p className="text-hustle-dark">Email: {formData.email}</p>}
                  {formData.website && <p className="text-hustle-dark">Web: {formData.website}</p>}
                </div>

                <div className="p-4 bg-hustle-light rounded-lg">
                  <h3 className="text-sm font-medium text-hustle-muted mb-1">Hours</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                    {DAYS.map((day, i) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-hustle-muted">{day}:</span>
                        <span className="text-hustle-dark">
                          {formData.hours[i].closed
                            ? 'Closed'
                            : `${formData.hours[i].open_time} - ${formData.hours[i].close_time}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-hustle-light rounded-lg">
                  <h3 className="text-sm font-medium text-hustle-muted mb-1">Description</h3>
                  <p className="text-hustle-dark text-sm">{formData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-hustle-muted hover:text-hustle-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &larr; Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2.5 rounded-lg text-sm font-bold bg-hustle-amber text-hustle-dark hover:bg-hustle-sunset hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <><LoadingSpinner size="sm" /> Submitting...</> : 'Submit Listing'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
