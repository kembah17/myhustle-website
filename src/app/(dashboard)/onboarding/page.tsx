'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ProgressSteps from '@/components/ui/ProgressSteps'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import Image from 'next/image'
import type { Category, Area } from '@/lib/types'

const STEPS = ['Basics', 'Location', 'Contact', 'Hours', 'Description', 'Photos', 'Review']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MAX_PHOTOS = 5

interface HourEntry {
  day: number
  open_time: string
  close_time: string
  closed: boolean
}

interface PhotoEntry {
  file: File
  preview: string
  isCover: boolean
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

interface FieldErrors {
  name?: string
  category_id?: string
  area_id?: string
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
  description?: string
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

function isValidNigerianPhone(value: string): boolean {
  if (!value) return false
  const formatted = formatNigerianPhone(value)
  return /^\+234[789]\d{9}$/.test(formatted)
}

function isValidEmail(value: string): boolean {
  if (!value) return true // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidUrl(value: string): boolean {
  if (!value) return true // optional
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
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
  const [photos, setPhotos] = useState<PhotoEntry[]>([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPhotoTips, setShowPhotoTips] = useState(false)
  const [photoError, setPhotoError] = useState('')
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

  // Validate fields
  const validate = useCallback((data: FormData): FieldErrors => {
    const errs: FieldErrors = {}
    if (!data.name.trim()) errs.name = 'Business name is required'
    else if (data.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!data.category_id) errs.category_id = 'Please select a category'
    if (!data.area_id) errs.area_id = 'Please select an area'
    if (!data.phone) errs.phone = 'Phone number is required'
    else if (!isValidNigerianPhone(data.phone)) errs.phone = 'Enter a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)'
    if (data.whatsapp && !isValidNigerianPhone(data.whatsapp)) errs.whatsapp = 'Enter a valid Nigerian phone number'
    if (!isValidEmail(data.email)) errs.email = 'Enter a valid email address'
    if (!isValidUrl(data.website)) errs.website = 'Enter a valid URL (e.g. https://example.com)'
    if (!data.description || data.description.length < 20) errs.description = 'Description must be at least 20 characters'
    return errs
  }, [])

  useEffect(() => {
    setErrors(validate(formData))
  }, [formData, validate])

  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

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
      case 0: return !!(formData.name.trim() && formData.category_id && !errors.name && !errors.category_id)
      case 1: return !!(formData.area_id && !errors.area_id)
      case 2: return !!(formData.phone && !errors.phone && !errors.whatsapp && !errors.email && !errors.website)
      case 3: return true
      case 4: return !!(formData.description && formData.description.length >= 20 && !errors.description)
      case 5: return true // photos optional
      default: return true
    }
  }

  const handleNext = () => {
    // Mark all fields in current step as touched
    switch (step) {
      case 0:
        setTouched(prev => ({ ...prev, name: true, category_id: true }))
        break
      case 1:
        setTouched(prev => ({ ...prev, area_id: true }))
        break
      case 2:
        setTouched(prev => ({ ...prev, phone: true, whatsapp: true, email: true, website: true }))
        break
      case 4:
        setTouched(prev => ({ ...prev, description: true }))
        break
    }
    if (canProceed()) {
      setStep(s => s + 1)
    }
  }

  // Photo handling
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remaining = MAX_PHOTOS - photos.length
    const newFiles = Array.from(files).slice(0, remaining)

    // File size validation - reject files > 5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = newFiles.filter(f => f.size > MAX_FILE_SIZE)
    const validFiles = newFiles.filter(f => f.size <= MAX_FILE_SIZE)

    if (oversizedFiles.length > 0) {
      setPhotoError(`${oversizedFiles.length} photo(s) exceeded the 5MB limit and were not added.`)
      setTimeout(() => setPhotoError(''), 5000)
    }

    const newPhotos: PhotoEntry[] = validFiles.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      isCover: photos.length === 0 && i === 0,
    }))

    setPhotos(prev => [...prev, ...newPhotos])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removePhoto = (index: number) => {
    const removed = photos[index]
    URL.revokeObjectURL(removed.preview)
    const updated = photos.filter((_, i) => i !== index)
    // If removed was cover, make first remaining the cover
    if (removed.isCover && updated.length > 0) {
      updated[0].isCover = true
    }
    setPhotos(updated)
  }

  const setCoverPhoto = (index: number) => {
    setPhotos(prev => prev.map((p, i) => ({ ...p, isCover: i === index })))
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
          phone: formatNigerianPhone(formData.phone),
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
        // Insert hours
        const hoursData = formData.hours.map(h => ({
          business_id: business.id,
          day: h.day,
          open_time: h.closed ? null : h.open_time,
          close_time: h.closed ? null : h.close_time,
          closed: h.closed,
        }))
        await supabase.from('business_hours').insert(hoursData)

        // Upload photos
        // TODO: Add WebP conversion using sharp library for optimised image delivery
        // This would reduce image sizes by 25-35% while maintaining quality
        // Implementation: sharp(buffer).webp({ quality: 80 }).toBuffer()
        if (photos.length > 0) {
          setUploadingPhotos(true)
          for (let i = 0; i < photos.length; i++) {
            const photo = photos[i]
            const ext = photo.file.name.split('.').pop() || 'jpg'
            const filePath = `businesses/${business.id}/${Date.now()}-${i}.${ext}`

            const { error: uploadError } = await supabase.storage
              .from('business-photos')
              .upload(filePath, photo.file, {
                cacheControl: '3600',
                upsert: false,
              })

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('business-photos')
                .getPublicUrl(filePath)


              // Auto-generate SEO alt text from business details
              const categoryName = categories.find(c => c.id === formData.category_id)?.name || ''
              const areaName = areas.find(a => a.id === formData.area_id)?.name || ''
              const cityName = areas.find(a => a.id === formData.area_id)?.city?.name || ''

              await supabase.from('business_photos').insert({
                business_id: business.id,
                url: urlData.publicUrl,
                is_cover: photo.isCover,
                position: i,
                alt_text: `${formData.name} - ${categoryName} in ${areaName}, ${cityName}`,
              })
            }
          }
          setUploadingPhotos(false)
        }
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

  // Inline error component
  const FieldError = ({ field }: { field: keyof FieldErrors }) => {
    if (!touched[field] || !errors[field]) return null
    return <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠️ {errors[field]}</p>
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
                <label className="block text-sm font-medium text-hustle-dark mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  onBlur={() => markTouched('name')}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                    touched.name && errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="e.g. Ada's Hair Studio"
                />
                <FieldError field="name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => {
                    updateField('category_id', e.target.value)
                    updateField('subcategory_id', '')
                    markTouched('category_id')
                  }}
                  onBlur={() => markTouched('category_id')}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                    touched.category_id && errors.category_id ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
                <FieldError field="category_id" />
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
                <label className="block text-sm font-medium text-hustle-dark mb-1">
                  Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.area_id}
                  onChange={(e) => {
                    updateField('area_id', e.target.value)
                    markTouched('area_id')
                  }}
                  onBlur={() => markTouched('area_id')}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                    touched.area_id && errors.area_id ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select your area</option>
                  {areas.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name}{a.city ? ` - ${a.city.name}` : ''}
                    </option>
                  ))}
                </select>
                <FieldError field="area_id" />
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
                <label className="block text-sm font-medium text-hustle-dark mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  onBlur={() => markTouched('phone')}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                    touched.phone && errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="08012345678"
                />
                <FieldError field="phone" />
                {formData.phone && !errors.phone && (
                  <p className="text-xs text-green-600 mt-1">✓ Will be saved as: {formatNigerianPhone(formData.phone)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  onBlur={() => markTouched('whatsapp')}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                    touched.whatsapp && errors.whatsapp ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="08012345678 (auto-formats to +234)"
                />
                <FieldError field="whatsapp" />
                {formData.whatsapp && !errors.whatsapp && (
                  <p className="text-xs text-green-600 mt-1">✓ Will be saved as: {formatNigerianPhone(formData.whatsapp)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => markTouched('email')}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                    touched.email && errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="business@example.com"
                />
                <FieldError field="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  onBlur={() => markTouched('website')}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                    touched.website && errors.website ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="https://www.example.com"
                />
                <FieldError field="website" />
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
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-hustle-light">
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
                      <div className="flex items-center gap-2">
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
                      </div>
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
                  Business Description <span className="text-red-500">*</span>
                  <span className="text-hustle-muted font-normal"> (min. 20 characters)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  onBlur={() => markTouched('description')}
                  rows={5}
                  className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent resize-none ${
                    touched.description && errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Tell customers about your business, services, and what makes you special..."
                />
                <div className="flex items-center justify-between mt-1">
                  <FieldError field="description" />
                  <p className={`text-xs ${
                    formData.description.length >= 20 ? 'text-green-600' : 'text-hustle-muted'
                  }`}>
                    {formData.description.length}/20 min
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Photos */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Business Photos</h2>

              {/* Collapsible Photo & Video Tips */}
              <div className="bg-hustle-light rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowPhotoTips(!showPhotoTips)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-hustle-dark hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <span>📸 Photo & Video Tips</span>
                  <svg
                    className={`w-5 h-5 text-hustle-muted transition-transform duration-200 ${showPhotoTips ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showPhotoTips && (
                  <div className="px-4 pb-4 space-y-3 text-sm text-hustle-muted">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="bg-white rounded-md p-2.5 border border-gray-100">
                        <p className="font-medium text-hustle-dark text-xs mb-1">Accepted Formats</p>
                        <p className="text-xs">JPG, PNG, WebP</p>
                      </div>
                      <div className="bg-white rounded-md p-2.5 border border-gray-100">
                        <p className="font-medium text-hustle-dark text-xs mb-1">Maximum Size</p>
                        <p className="text-xs">5MB per photo</p>
                      </div>
                      <div className="bg-white rounded-md p-2.5 border border-gray-100">
                        <p className="font-medium text-hustle-dark text-xs mb-1">Recommended</p>
                        <p className="text-xs">1200×800px min, landscape</p>
                      </div>
                    </div>
                    <div className="bg-hustle-amber/10 rounded-md p-3 border border-hustle-amber/20">
                      <p className="text-xs text-hustle-dark">⭐ <strong>Cover photo tip:</strong> Choose your best photo — it appears in search results and is the first thing customers see.</p>
                    </div>
                    <div>
                      <p className="font-medium text-hustle-dark text-xs mb-1.5">Tips for great photos:</p>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-1.5">☀️ Use good natural lighting</li>
                        <li className="flex items-start gap-1.5">🏠 Show your shopfront or entrance</li>
                        <li className="flex items-start gap-1.5">📷 Photograph your products or services</li>
                        <li className="flex items-start gap-1.5">👥 Include your team (with their permission)</li>
                        <li className="flex items-start gap-1.5">✨ Keep backgrounds clean and uncluttered</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-md p-2.5 border border-gray-200">
                      <p className="text-xs text-hustle-muted">🎥 <strong>Video (coming soon):</strong> MP4 format, max 30MB, under 60 seconds</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-hustle-muted">
                Add up to {MAX_PHOTOS} photos of your business. The cover photo will be shown in search results.
              </p>

              {/* Photo error message */}
              {photoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-sm text-red-700">{photoError}</p>
                </div>
              )}

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 aspect-square">
                      <Image
                        src={photo.preview}
                        alt={`Photo ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      {photo.isCover && (
                        <div className="absolute top-2 left-2 bg-hustle-amber text-hustle-dark text-xs font-bold px-2 py-1 rounded">
                          Cover
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!photo.isCover && (
                          <button
                            onClick={() => setCoverPhoto(i)}
                            className="px-3 py-1.5 rounded bg-white text-hustle-dark text-xs font-medium hover:bg-hustle-amber transition-colors"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          onClick={() => removePhoto(i)}
                          className="px-3 py-1.5 rounded bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload area */}
              {photos.length < MAX_PHOTOS && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-hustle-blue hover:bg-hustle-light/50 transition-colors"
                >
                  <p className="text-3xl mb-2">📷</p>
                  <p className="text-sm font-medium text-hustle-dark">Click to upload photos</p>
                  <p className="text-xs text-hustle-muted mt-1">
                    {photos.length}/{MAX_PHOTOS} photos added &bull; JPG, PNG up to 5MB each
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              )}

              {photos.length === 0 && (
                <div className="bg-hustle-light rounded-lg p-4">
                  <p className="text-sm text-hustle-muted text-center">
                    📸 Photos are optional but businesses with photos get 3x more views!
                    You can also add photos later from your dashboard.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
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
                  <p className="text-hustle-dark">Phone: {formatNigerianPhone(formData.phone)}</p>
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

                {photos.length > 0 && (
                  <div className="p-4 bg-hustle-light rounded-lg">
                    <h3 className="text-sm font-medium text-hustle-muted mb-2">Photos ({photos.length})</h3>
                    <div className="flex gap-2 overflow-x-auto">
                      {photos.map((photo, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image src={photo.preview} alt={`Photo ${i + 1}`} fill className="object-cover" />
                          {photo.isCover && (
                            <div className="absolute bottom-0 left-0 right-0 bg-hustle-amber text-hustle-dark text-[10px] font-bold text-center py-0.5">
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || uploadingPhotos}
                className="px-8 py-2.5 rounded-lg text-sm font-bold bg-hustle-amber text-hustle-dark hover:bg-hustle-sunset hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading || uploadingPhotos ? (
                  <><LoadingSpinner size="sm" /> {uploadingPhotos ? 'Uploading photos...' : 'Submitting...'}</>
                ) : (
                  'Submit Listing'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
