'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ProgressSteps from '@/components/ui/ProgressSteps'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SearchableSelect from '@/components/ui/SearchableSelect'
import type { SelectOption } from '@/components/ui/SearchableSelect'
import Link from 'next/link'
import Image from 'next/image'
import type { Category, Area } from '@/lib/types'

const STEPS = ['Basics', 'Location & Contact', 'About', 'Photos', 'Review']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MAX_PHOTOS = 5
const OTHER_CATEGORY_VALUE = '__other__'
const DRAFT_KEY = 'myhustle_onboarding_draft'

const STEP_HINTS = [
  'Tell us your business name and what you do',
  'Where are you located and how can customers reach you?',
  'Describe your business in your own words',
  'Add photos to attract more customers (optional)',
  'Review everything and submit',
]

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
  customCategory: string
  area_id: string
  address: string
  phone: string
  phone2: string
  whatsapp: string
  email: string
  website: string
  description: string
  hours: HourEntry[]
}

interface FieldErrors {
  name?: string
  category_id?: string
  customCategory?: string
  area_id?: string
  phone?: string
  phone2?: string
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
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidUrl(value: string): boolean {
  if (!value) return true
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
  const [categorySuggestionSent, setCategorySuggestionSent] = useState(false)
  const [showHours, setShowHours] = useState(false)
  const [showOptionalContact, setShowOptionalContact] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hasExistingBusiness, setHasExistingBusiness] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category_id: '',
    subcategory_id: '',
    customCategory: '',
    area_id: '',
    address: '',
    phone: '',
    phone2: '',
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

  // Restore draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const { _step, ...fields } = parsed
        setFormData(prev => ({ ...prev, ...fields }))
        if (typeof _step === 'number' && _step >= 0 && _step <= 4) {
          setStep(_step)
        }
        setDraftRestored(true)
      } catch {
        // Invalid draft, ignore
      }
    }
  }, [])

  // Save draft to localStorage on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formData, _step: step }))
    }, 500)
    return () => clearTimeout(timer)
  }, [formData, step])

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setDraftRestored(false)
    setFormData({
      name: '',
      category_id: '',
      subcategory_id: '',
      customCategory: '',
      area_id: '',
      address: '',
      phone: '',
      phone2: '',
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
    setStep(0)
    setTouched({})
  }

  // Check if user already has a business
  useEffect(() => {
    if (user) {
      supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setHasExistingBusiness(true)
          }
        })
    }
  }, [user, supabase])

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
    if (formData.category_id && formData.category_id !== OTHER_CATEGORY_VALUE) {
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

  const categoryOptions: SelectOption[] = useMemo(() => {
    const opts: SelectOption[] = categories
      .filter(c => c.slug !== 'other')
      .map(c => ({
        value: c.id,
        label: `${c.icon || ''} ${c.name}`.trim(),
        searchTerms: c.name,
      }))
    opts.push({
      value: OTHER_CATEGORY_VALUE,
      label: '\ud83d\udce6 Other / My category isn\'t listed',
      searchTerms: 'other not listed custom',
    })
    return opts
  }, [categories])

  const subcategoryOptions: SelectOption[] = useMemo(() => {
    return subcategories.map(c => ({
      value: c.id,
      label: c.name,
      searchTerms: c.name,
    }))
  }, [subcategories])

  const areaOptions: SelectOption[] = useMemo(() => {
    return areas
      .sort((a, b) => {
        const stateA = a.city?.state || ''
        const stateB = b.city?.state || ''
        if (stateA !== stateB) return stateA.localeCompare(stateB)
        const cityA = a.city?.name || ''
        const cityB = b.city?.name || ''
        if (cityA !== cityB) return cityA.localeCompare(cityB)
        return a.name.localeCompare(b.name)
      })
      .map(a => {
        const cityName = a.city?.name || ''
        const stateName = a.city?.state || ''
        const groupLabel = stateName ? `${stateName} \u2014 ${cityName}` : cityName || 'Other'
        return {
          value: a.id,
          label: `${a.name}${cityName ? `, ${cityName}` : ''}${stateName ? ` (${stateName})` : ''}`,
          group: groupLabel,
          searchTerms: `${a.name} ${cityName} ${stateName}`,
        }
      })
  }, [areas])

  const validate = useCallback((data: FormData): FieldErrors => {
    const errs: FieldErrors = {}
    if (!data.name.trim()) errs.name = 'Business name is required'
    else if (data.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!data.category_id) {
      errs.category_id = 'Please select a category'
    } else if (data.category_id === OTHER_CATEGORY_VALUE) {
      if (!data.customCategory.trim()) {
        errs.customCategory = 'Please describe your business category'
      } else if (data.customCategory.trim().length < 3) {
        errs.customCategory = 'Category name must be at least 3 characters'
      }
    }
    if (!data.area_id) errs.area_id = 'Please select an area'
    if (!data.phone) errs.phone = 'Phone number is required'
    else if (!isValidNigerianPhone(data.phone)) errs.phone = 'Enter a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)'
    if (data.phone2 && !isValidNigerianPhone(data.phone2)) errs.phone2 = 'Enter a valid Nigerian phone number'
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
      case 0: {
        const hasName = !!(formData.name.trim() && !errors.name)
        if (formData.category_id === OTHER_CATEGORY_VALUE) {
          return hasName && !!(formData.customCategory.trim().length >= 3 && !errors.customCategory)
        }
        return hasName && !!(formData.category_id && !errors.category_id)
      }
      case 1:
        return !!(formData.area_id && !errors.area_id && formData.phone && !errors.phone && !errors.phone2 && !errors.whatsapp && !errors.email && !errors.website)
      case 2:
        return !!(formData.description && formData.description.length >= 20 && !errors.description)
      case 3:
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    switch (step) {
      case 0:
        setTouched(prev => ({ ...prev, name: true, category_id: true, customCategory: true }))
        break
      case 1:
        setTouched(prev => ({ ...prev, area_id: true, phone: true, phone2: true, whatsapp: true, email: true, website: true }))
        break
      case 2:
        setTouched(prev => ({ ...prev, description: true }))
        break
    }
    if (canProceed()) {
      setStep(s => s + 1)
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const remaining = MAX_PHOTOS - photos.length
    const newFiles = Array.from(files).slice(0, remaining)
    const MAX_FILE_SIZE = 5 * 1024 * 1024
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

      let resolvedCategoryId = formData.subcategory_id || formData.category_id
      const isOther = formData.category_id === OTHER_CATEGORY_VALUE

      if (isOther) {
        const { data: otherCat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', 'other')
          .is('parent_id', null)
          .maybeSingle()

        if (otherCat) {
          resolvedCategoryId = otherCat.id
        } else {
          resolvedCategoryId = categories[0]?.id || ''
        }

        const area = areas.find(a => a.id === formData.area_id)
        const suggesterName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Unknown'

        await supabase.from('business_suggestions').insert({
          business_name: formData.name,
          category: formData.customCategory.trim(),
          area: area?.name || '',
          city: area?.city?.name || 'Lagos',
          suggester_name: suggesterName,
        })

        setCategorySuggestionSent(true)
      }

      const area = areas.find(a => a.id === formData.area_id)

      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .insert({
          name: formData.name,
          slug,
          description: formData.description,
          category_id: resolvedCategoryId,
          area_id: formData.area_id,
          city_id: area?.city_id || null,
          phone: formatNigerianPhone(formData.phone),
          whatsapp: formData.whatsapp ? formatNigerianPhone(formData.whatsapp) : null,
          phone2: formData.phone2 ? formatNigerianPhone(formData.phone2) : null,
          email: formData.email || null,
          website: formData.website || null,
          address: formData.address || null,
          user_id: user.id,
          verified: false,
          active: true,
        })
        .select()
        .single()

      if (bizError) {
        console.error('Business creation error:', bizError)
        throw new Error(`Could not create listing: ${bizError.message}`)
      }

      if (!business) {
        throw new Error('Business was not created. Please try again.')
      }

      // Stop reminder sequence — user has listed a business
      try {
        fetch('/api/reminders/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id }),
        }).catch(() => {}) // Fire-and-forget, never block onboarding
      } catch {
        // Silently ignore — reminders are non-critical
      }

      // Insert hours (independent of photos)
      try {
        const hoursData = formData.hours.map(h => ({
          business_id: business.id,
          day: h.day,
          open_time: h.closed ? null : h.open_time,
          close_time: h.closed ? null : h.close_time,
          closed: h.closed,
        }))
        await supabase.from('business_hours').insert(hoursData)
      } catch (hoursErr) {
        console.error('Hours save error (non-fatal):', hoursErr)
      }

      // Upload photos (independent - business already created)
      if (photos.length > 0) {
        setUploadingPhotos(true)
        let photoErrors = 0
        for (let i = 0; i < photos.length; i++) {
          try {
            const photo = photos[i]
            const ext = photo.file.name.split('.').pop() || 'jpg'
            const filePath = `businesses/${business.id}/${Date.now()}-${i}.${ext}`

            const { error: uploadError } = await supabase.storage
              .from('business-photos')
              .upload(filePath, photo.file, {
                cacheControl: '3600',
                upsert: false,
              })

            if (uploadError) {
              console.error(`Photo ${i + 1} upload error:`, uploadError)
              photoErrors++
              continue
            }

            const { data: urlData } = supabase.storage
              .from('business-photos')
              .getPublicUrl(filePath)

            const categoryName = isOther
              ? formData.customCategory
              : (categories.find(c => c.id === formData.category_id)?.name || '')
            const areaName = areas.find(a => a.id === formData.area_id)?.name || ''
            const cityName = areas.find(a => a.id === formData.area_id)?.city?.name || ''

            await supabase.from('business_photos').insert({
              business_id: business.id,
              url: urlData.publicUrl,
              is_cover: photo.isCover,
              position: i,
              alt_text: `${formData.name} - ${categoryName} in ${areaName}, ${cityName}`,
            })
          } catch (photoErr) {
            console.error(`Photo ${i + 1} error:`, photoErr)
            photoErrors++
          }
        }
        setUploadingPhotos(false)

        if (photoErrors > 0 && photoErrors < photos.length) {
          // Clear draft on partial success too - business was created
          localStorage.removeItem(DRAFT_KEY)
          setToast({ message: `Listing created! ${photoErrors} photo(s) could not be uploaded \u2014 you can add them later from your dashboard.`, type: 'success' })
          router.push('/dashboard?welcome=new')
          return
        } else if (photoErrors === photos.length) {
          // Clear draft - business was created
          localStorage.removeItem(DRAFT_KEY)
          setToast({ message: 'Listing created! Photos could not be uploaded \u2014 you can add them later from your dashboard.', type: 'success' })
          router.push('/dashboard?welcome=new')
          return
        }
      }

      // Clear draft on successful submission
      localStorage.removeItem(DRAFT_KEY)

      if (isOther) {
        setToast({ message: 'Thanks for suggesting a new category \u2014 we\'ll review it soon!', type: 'success' })
      }
      router.push('/dashboard?welcome=new')
    } catch (err: unknown) {
      console.error('Submission error:', err)
      let message = 'Something went wrong. Please try again.'
      if (err instanceof Error) {
        if (err.message.includes('row-level security') || err.message.includes('policy')) {
          message = 'Permission error \u2014 please sign out and sign back in, then try again.'
        } else if (err.message.includes('duplicate') || err.message.includes('unique')) {
          message = 'A business with this name already exists. Please use a different name.'
        } else if (err.message.includes('foreign key') || err.message.includes('category')) {
          message = 'The selected category or area is no longer available. Please go back and select again.'
        } else {
          message = err.message
        }
      }
      setToast({ message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const FieldError = ({ field }: { field: keyof FieldErrors }) => {
    if (!touched[field] || !errors[field]) return null
    return <p className="text-xs text-red-500 mt-1 flex items-center gap-1">\u26a0\ufe0f {errors[field]}</p>
  }

  // Loading state
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

  // Auth guard: if not loading and no user, show sign-in prompt
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-hustle-light flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">\ud83d\udd12</div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark mb-2">Sign In Required</h1>
          <p className="text-hustle-muted mb-6">You need to be signed in to list your business on MyHustle.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-hustle-blue text-white rounded-lg font-medium hover:bg-hustle-blue/90 transition-colors">
            Sign In to Continue
          </Link>
        </div>
      </div>
    )
  }

  // Existing business check: if user already has a business, show redirect
  if (hasExistingBusiness) {
    return (
      <div className="min-h-screen bg-hustle-light flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">\u2705</div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark mb-2">You Already Have a Business Listed!</h1>
          <p className="text-hustle-muted mb-6">You can manage your existing listing from your dashboard.</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-hustle-blue text-white rounded-lg font-medium hover:bg-hustle-blue/90 transition-colors">
            Go to Dashboard \u2192
          </Link>
        </div>
      </div>
    )
  }

  // Success state: show full success screen after submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-hustle-light flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">\ud83c\udf89</div>
          <h1 className="font-heading text-2xl font-bold text-hustle-dark mb-2">Your Business is Listed!</h1>
          <p className="text-hustle-muted mb-6">
            Congratulations! Your business is now live on MyHustle. You can manage your listing from your dashboard.
          </p>
          {categorySuggestionSent && (
            <p className="text-sm text-hustle-muted mb-4 bg-hustle-light border border-gray-200 rounded-lg p-3">
              \ud83d\udce6 Thanks for suggesting a new category \u2014 we&apos;ll review it and may add it as an official category soon!
            </p>
          )}
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-hustle-blue text-white rounded-lg font-medium hover:bg-hustle-blue/90 transition-colors">
            Go to Dashboard \u2192
          </Link>
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

        {/* Draft restored indicator */}
        {draftRestored && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              \ud83d\udcdd We saved your progress from last time. Pick up where you left off!
            </p>
            <button
              type="button"
              onClick={clearDraft}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 whitespace-nowrap ml-4"
            >
              Start Fresh
            </button>
          </div>
        )}

        <div className="mb-4">
          <ProgressSteps steps={STEPS} currentStep={step} />
        </div>

        {/* Step completion indicator */}
        <p className="text-sm text-hustle-muted mb-6 flex items-center gap-1.5">
          <span className="inline-block w-5 h-5 rounded-full bg-hustle-blue/10 text-hustle-blue text-xs font-bold flex items-center justify-center">{step + 1}</span>
          {STEP_HINTS[step]}
        </p>

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
                {!(touched.name && errors.name) && (
                  <p className="text-xs text-hustle-muted mt-1">\ud83d\udca1 Use your real business name \u2014 this is how customers will find you.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-hustle-dark mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={categoryOptions}
                  value={formData.category_id}
                  onChange={(val) => {
                    updateField('category_id', val)
                    updateField('subcategory_id', '')
                    if (val !== OTHER_CATEGORY_VALUE) {
                      updateField('customCategory', '')
                    }
                    markTouched('category_id')
                  }}
                  onBlur={() => markTouched('category_id')}
                  placeholder="Search for a category..."
                  error={!!(touched.category_id && errors.category_id)}
                />
                <FieldError field="category_id" />
              </div>

              {formData.category_id === OTHER_CATEGORY_VALUE && (
                <div className="bg-hustle-light rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-hustle-dark mb-1">
                      What type of business is this? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customCategory}
                      onChange={(e) => updateField('customCategory', e.target.value)}
                      onBlur={() => markTouched('customCategory')}
                      className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                        touched.customCategory && errors.customCategory ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="e.g. Pet Grooming, Solar Installation, Travel Agency..."
                    />
                    <FieldError field="customCategory" />
                  </div>
                  <p className="text-xs text-hustle-muted flex items-center gap-1">
                    \ud83d\udca1 We'll review your suggestion and may add it as an official category soon!
                  </p>
                </div>
              )}

              {subcategories.length > 0 && formData.category_id !== OTHER_CATEGORY_VALUE && (
                <div>
                  <label className="block text-sm font-medium text-hustle-dark mb-1">Subcategory</label>
                  <SearchableSelect
                    options={subcategoryOptions}
                    value={formData.subcategory_id}
                    onChange={(val) => updateField('subcategory_id', val)}
                    placeholder="Search for a subcategory (optional)..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 1: Location & Contact */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-semibold text-hustle-dark">Location</h2>
                <div>
                  <label className="block text-sm font-medium text-hustle-dark mb-1">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    options={areaOptions}
                    value={formData.area_id}
                    onChange={(val) => {
                      updateField('area_id', val)
                      markTouched('area_id')
                    }}
                    onBlur={() => markTouched('area_id')}
                    placeholder="Search by area, city, or state..."
                    error={!!(touched.area_id && errors.area_id)}
                    grouped
                  />
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

              <div className="border-t border-gray-200" />

              <div className="space-y-4">
                <h2 className="font-heading text-xl font-semibold text-hustle-dark">Contact</h2>
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
                    <p className="text-xs text-green-600 mt-1">\u2713 Phone number accepted</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-hustle-dark mb-1">Alternative Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone2}
                    onChange={(e) => updateField('phone2', e.target.value)}
                    onBlur={() => markTouched('phone2')}
                    className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent ${
                      touched.phone2 && errors.phone2 ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="08012345678"
                  />
                  <FieldError field="phone2" />
                  {formData.phone2 && !errors.phone2 && (
                    <p className="text-xs text-green-600 mt-1">✓ Phone number accepted</p>
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
                    placeholder="08012345678"
                  />
                  <FieldError field="whatsapp" />
                  {formData.whatsapp && !errors.whatsapp && (
                    <p className="text-xs text-green-600 mt-1">\u2713 WhatsApp number accepted</p>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowOptionalContact(!showOptionalContact)}
                    className="text-sm text-hustle-blue hover:text-hustle-blue/80 font-medium flex items-center gap-1 transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${showOptionalContact ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {showOptionalContact ? 'Hide' : 'Add'} email & website (optional)
                  </button>

                  {showOptionalContact && (
                    <div className="mt-3 space-y-4">
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
                </div>
              </div>
            </div>
          )}

          {/* Step 2: About */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-semibold text-hustle-dark">About Your Business</h2>
                <div>
                  <label className="block text-sm font-medium text-hustle-dark mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    onBlur={() => markTouched('description')}
                    rows={5}
                    className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent resize-none ${
                      touched.description && errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Tell customers what makes your business special. What services do you offer? What sets you apart?"
                  />
                  <div className="flex justify-between mt-1">
                    <FieldError field="description" />
                    <span className={`text-xs ${formData.description.length < 20 ? 'text-hustle-muted' : 'text-green-600'}`}>
                      {formData.description.length}/20 min
                    </span>
                  </div>
                  <p className="text-xs text-hustle-muted mt-1">\ud83d\udca1 Tip: Mention what you sell or do, your location advantage, and why customers choose you.</p>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              <div>
                <button
                  type="button"
                  onClick={() => setShowHours(!showHours)}
                  className="text-sm text-hustle-blue hover:text-hustle-blue/80 font-medium flex items-center gap-1 transition-colors"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showHours ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showHours ? 'Hide' : 'Set'} business hours (optional)
                </button>

                {showHours && (
                  <div className="mt-4 space-y-3">
                    {formData.hours.map((hour, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                          <span className="w-20 sm:w-24 text-sm font-medium text-hustle-dark">{DAYS[i]}</span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hour.closed}
                              onChange={(e) => updateHour(i, 'closed', e.target.checked)}
                              className="rounded border-gray-300 text-hustle-blue focus:ring-hustle-blue"
                            />
                            <span className="text-sm text-hustle-muted">Closed</span>
                          </label>
                        </div>
                        {!hour.closed && (
                          <div className="flex items-center gap-2 pl-0 sm:pl-0">
                            <input
                              type="time"
                              value={hour.open_time}
                              onChange={(e) => updateHour(i, 'open_time', e.target.value)}
                              className="flex-1 sm:flex-none sm:w-auto px-2 py-1.5 rounded border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
                            />
                            <span className="text-hustle-muted text-sm">to</span>
                            <input
                              type="time"
                              value={hour.close_time}
                              onChange={(e) => updateHour(i, 'close_time', e.target.value)}
                              className="flex-1 sm:flex-none sm:w-auto px-2 py-1.5 rounded border border-gray-200 text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-hustle-dark">\ud83d\udcf8 Photos</h2>
                <span className="text-sm text-hustle-muted">Optional</span>
              </div>
              <p className="text-sm text-hustle-muted">
                Add photos to help customers find and trust your business. You can always add more later.
              </p>

              {photoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">\u26a0\ufe0f {photoError}</div>
              )}

              {photos.length < MAX_PHOTOS && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-hustle-blue hover:bg-hustle-light/50 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <div className="text-4xl mb-2">\ud83d\udcf7</div>
                  <p className="text-hustle-dark font-medium">Click to upload photos</p>
                  <p className="text-sm text-hustle-muted mt-1">
                    JPG, PNG up to 5MB each. {MAX_PHOTOS - photos.length} of {MAX_PHOTOS} remaining.
                  </p>
                </div>
              )}

              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={photo.preview}
                        alt={`Photo ${i + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!photo.isCover && (
                          <button
                            type="button"
                            onClick={() => setCoverPhoto(i)}
                            className="bg-white text-hustle-dark text-xs px-2 py-1 rounded-md hover:bg-gray-100"
                          >
                            \u2b50 Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600"
                        >
                          \u00d7 Remove
                        </button>
                      </div>
                      {photo.isCover && (
                        <div className="absolute top-1 left-1 bg-hustle-amber text-white text-xs px-2 py-0.5 rounded-full">\u2b50 Cover</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowPhotoTips(!showPhotoTips)}
                className="text-sm text-hustle-blue hover:text-hustle-blue/80 font-medium flex items-center gap-1 transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showPhotoTips ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showPhotoTips ? 'Hide' : 'Show'} photo tips
              </button>

              {showPhotoTips && (
                <div className="bg-hustle-light rounded-lg p-4 space-y-2 text-sm text-hustle-muted">
                  <p className="font-medium text-hustle-dark">\ud83d\udca1 Tips for great photos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>\u2600\ufe0f Use natural lighting when possible</li>
                    <li>\ud83c\udfe0 Show your storefront or workspace</li>
                    <li>\ud83d\udc65 Include photos of your team at work</li>
                    <li>\u2728 Showcase your best products or results</li>
                    <li>\ud83c\udfa5 Keep images clear and well-framed</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-hustle-dark">Review Your Listing</h2>
              <p className="text-sm text-hustle-muted">Please review your information before submitting.</p>

              <div className="space-y-4">
                <div className="bg-hustle-light rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-hustle-dark mb-2">Business Basics</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex">
                      <dt className="w-32 text-hustle-muted">Name</dt>
                      <dd className="text-hustle-dark font-medium">{formData.name}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-hustle-muted">Category</dt>
                      <dd className="text-hustle-dark">
                        {formData.category_id === OTHER_CATEGORY_VALUE
                          ? `${formData.customCategory} (suggested)`
                          : categories.find(c => c.id === formData.category_id)?.name || ''}
                      </dd>
                    </div>
                    {formData.subcategory_id && (
                      <div className="flex">
                        <dt className="w-32 text-hustle-muted">Subcategory</dt>
                        <dd className="text-hustle-dark">
                          {subcategories.find(c => c.id === formData.subcategory_id)?.name || ''}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="bg-hustle-light rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-hustle-dark mb-2">Location & Contact</h3>
                  <dl className="space-y-1 text-sm">
                    <div className="flex">
                      <dt className="w-32 text-hustle-muted">Area</dt>
                      <dd className="text-hustle-dark">
                        {(() => {
                          const area = areas.find(a => a.id === formData.area_id)
                          if (!area) return ''
                          return `${area.name}${area.city ? `, ${area.city.name} (${area.city.state})` : ''}`
                        })()}
                      </dd>
                    </div>
                    {formData.address && (
                      <div className="flex">
                        <dt className="w-32 text-hustle-muted">Address</dt>
                        <dd className="text-hustle-dark">{formData.address}</dd>
                      </div>
                    )}
                    <div className="flex">
                      <dt className="w-32 text-hustle-muted">Phone</dt>
                      <dd className="text-hustle-dark">{formData.phone}</dd>
                    </div>
                    {formData.phone2 && (
                      <div className="flex">
                        <dt className="w-32 text-hustle-muted">Alt. Phone</dt>
                        <dd className="text-hustle-dark">{formData.phone2}</dd>
                      </div>
                    )}
                    {formData.whatsapp && (
                      <div className="flex">
                        <dt className="w-32 text-hustle-muted">WhatsApp</dt>
                        <dd className="text-hustle-dark">{formData.whatsapp}</dd>
                      </div>
                    )}
                    {formData.email && (
                      <div className="flex">
                        <dt className="w-32 text-hustle-muted">Email</dt>
                        <dd className="text-hustle-dark">{formData.email}</dd>
                      </div>
                    )}
                    {formData.website && (
                      <div className="flex">
                        <dt className="w-32 text-hustle-muted">Website</dt>
                        <dd className="text-hustle-dark">{formData.website}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="bg-hustle-light rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-hustle-dark mb-2">About</h3>
                  <p className="text-sm text-hustle-dark whitespace-pre-wrap">{formData.description}</p>
                </div>

                {photos.length > 0 && (
                  <div className="bg-hustle-light rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-hustle-dark mb-2">Photos ({photos.length})</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map((photo, i) => (
                        <div key={i} className="relative rounded overflow-hidden">
                          <Image
                            src={photo.preview}
                            alt={`Photo ${i + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-20 object-cover"
                          />
                          {photo.isCover && (
                            <div className="absolute top-0.5 left-0.5 bg-hustle-amber text-white text-[10px] px-1 rounded">\u2b50 Cover</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-hustle-dark font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-hustle-blue text-white hover:bg-hustle-blue/90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {step === 3 && photos.length === 0 ? 'Skip Photos' : 'Next'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || uploadingPhotos}
                className="px-8 py-2.5 rounded-lg bg-hustle-amber text-white font-semibold hover:bg-hustle-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading || uploadingPhotos ? (
                  <>
                    <LoadingSpinner size="sm" />
                    {uploadingPhotos ? 'Uploading photos...' : 'Creating listing...'}
                  </>
                ) : (
                  <>\u2728 Create My Listing</>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
