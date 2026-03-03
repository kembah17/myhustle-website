/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { BusinessHour } from '@/lib/types'

interface BookingFormProps {
  businessId: string
  businessName: string
  businessSlug: string
  businessWhatsapp?: string | null
  businessPhone?: string | null
}

interface BookingResult {
  id: string
  status: string
  created_at: string
}

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDateDisplay(date: Date): string {
  const day = DAY_NAMES_SHORT[date.getDay()]
  const dateNum = date.getDate()
  const month = MONTH_NAMES[date.getMonth()]
  const year = date.getFullYear()
  return `${day}, ${dateNum} ${month} ${year}`
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function to12Hour(time24: string): string {
  const [hStr, mStr] = time24.split(':')
  let h = parseInt(hStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${h}:${mStr} ${ampm}`
}

function generateTimeSlots(openTime: string, closeTime: string): string[] {
  const slots: string[] = []
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)
  const startMinutes = openH * 60 + openM
  const endMinutes = closeH * 60 + closeM

  for (let m = startMinutes; m < endMinutes; m += 30) {
    const h = Math.floor(m / 60)
    const min = m % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }
  return slots
}

function validateNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '')
  if (/^0[7-9][01]\d{8}$/.test(cleaned)) return true
  if (/^\+234[7-9][01]\d{8}$/.test(cleaned)) return true
  if (/^234[7-9][01]\d{8}$/.test(cleaned)) return true
  return false
}

function isToday(date: Date): boolean {
  const now = new Date()
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
}

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'Date' },
    { num: 2, label: 'Time' },
    { num: 3, label: 'Details' },
    { num: 4, label: 'Confirm' },
  ]

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step.num < currentStep
                  ? 'bg-green-500 text-white'
                  : step.num === currentStep
                  ? 'bg-hustle-amber text-hustle-dark'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.num < currentStep ? (
                <svg className="w-4 h-4" width="16" height="16" style={{width:"16px",height:"16px",maxWidth:"16px",maxHeight:"16px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                step.num === currentStep ? 'text-hustle-dark' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mt-[-16px] transition-all duration-300 ${
                step.num < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BookingForm({
  businessId,
  businessName,
  businessSlug,
  businessWhatsapp,
  businessPhone,
}: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [hoursLoading, setHoursLoading] = useState(true)
  const [hoursError, setHoursError] = useState<string | null>(null)

  // Step 1: Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Step 2: Time
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Step 3: Details
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [service, setService] = useState('')
  const [notes, setNotes] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)

  // Step 4: Confirmation
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)

  // Fetch business hours
  useEffect(() => {
    async function fetchHours() {
      setHoursLoading(true)
      setHoursError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', businessId)

        if (error) throw error
        setBusinessHours((data || []) as BusinessHour[])
      } catch {
        setHoursError('Could not load business hours. Please try again.')
      } finally {
        setHoursLoading(false)
      }
    }
    fetchHours()
  }, [businessId])

  // Generate next 14 days
  const next14Days = useCallback(() => {
    const days: Date[] = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      d.setHours(0, 0, 0, 0)
      days.push(d)
    }
    return days
  }, [])

  // Check if a day is closed
  const isDayClosed = useCallback(
    (date: Date): boolean => {
      if (businessHours.length === 0) return false // If no hours data, allow all days
      const dayNum = date.getDay()
      const hourEntry = businessHours.find((h) => h.day === dayNum)
      if (!hourEntry) return true // No entry means closed
      return hourEntry.closed
    },
    [businessHours]
  )

  // Get hours for a specific day
  const getHoursForDay = useCallback(
    (date: Date): BusinessHour | null => {
      const dayNum = date.getDay()
      return businessHours.find((h) => h.day === dayNum) || null
    },
    [businessHours]
  )

  // Generate time slots for selected date
  const timeSlots = useCallback((): string[] => {
    if (!selectedDate) return []
    const hours = getHoursForDay(selectedDate)
    if (!hours || hours.closed || !hours.open_time || !hours.close_time) return []
    return generateTimeSlots(hours.open_time, hours.close_time)
  }, [selectedDate, getHoursForDay])

  // Handle phone validation
  const handlePhoneChange = (value: string) => {
    setCustomerPhone(value)
    if (value.length > 0 && !validateNigerianPhone(value)) {
      setPhoneError('Enter a valid Nigerian number (e.g. 08012345678)')
    } else {
      setPhoneError(null)
    }
  }

  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !customerName.trim() || !customerPhone.trim()) return
    if (!validateNigerianPhone(customerPhone)) {
      setPhoneError('Enter a valid Nigerian number (e.g. 08012345678)')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.replace(/[\s-]/g, ''),
          service: service.trim() || null,
          date: formatDateISO(selectedDate),
          time: selectedTime,
          notes: notes.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      setBookingResult(data.booking)
      setStep(5) // Success state
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
    setCustomerName('')
    setCustomerPhone('')
    setService('')
    setNotes('')
    setPhoneError(null)
    setSubmitError(null)
    setBookingResult(null)
  }

  // Generate WhatsApp link
  const getWhatsAppLink = (): string | null => {
    if (!businessWhatsapp || !bookingResult || !selectedDate || !selectedTime) return null
    const cleanNumber = businessWhatsapp.replace(/[^0-9]/g, '')
    const formattedNumber = cleanNumber.startsWith('0')
      ? '234' + cleanNumber.slice(1)
      : cleanNumber.startsWith('234')
      ? cleanNumber
      : cleanNumber
    const message = encodeURIComponent(
      `Hi! I just booked ${service || 'an appointment'} at ${businessName} for ${formatDateDisplay(selectedDate)} at ${to12Hour(selectedTime)}. My name is ${customerName}. Booking ref: ${bookingResult.id.slice(0, 8)}`
    )
    return `https://wa.me/${formattedNumber}?text=${message}`
  }

  // ===== RENDER =====

  // Loading state
  if (hoursLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (hoursError) {
    return (
      <div className="bg-white border border-red-200 rounded-xl p-8 shadow-sm text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <p className="text-red-600 font-medium">{hoursError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-hustle-blue underline hover:text-hustle-dark"
        >
          Try again
        </button>
      </div>
    )
  }

  // Success state (Step 5)
  if (step === 5 && bookingResult) {
    const whatsappLink = getWhatsAppLink()
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" width="32" height="32" style={{width:"32px",height:"32px",maxWidth:"32px",maxHeight:"32px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-hustle-dark mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-hustle-muted mb-1">
            Your booking at <span className="font-semibold text-hustle-dark">{businessName}</span> has been received.
          </p>
          <p className="text-sm text-hustle-muted mb-6">
            Ref: <span className="font-mono font-semibold text-hustle-dark">{bookingResult.id.slice(0, 8).toUpperCase()}</span>
          </p>

          {/* Booking summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-hustle-muted">Date</span>
                <span className="font-medium text-hustle-dark">{selectedDate ? formatDateDisplay(selectedDate) : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hustle-muted">Time</span>
                <span className="font-medium text-hustle-dark">{selectedTime ? to12Hour(selectedTime) : ''}</span>
              </div>
              {service && (
                <div className="flex justify-between">
                  <span className="text-hustle-muted">Service</span>
                  <span className="font-medium text-hustle-dark">{service}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-hustle-muted">Name</span>
                <span className="font-medium text-hustle-dark">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-hustle-muted">Status</span>
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  Pending confirmation
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            ) : businessPhone ? (
              <a
                href={`tel:${businessPhone}`}
                className="w-full flex items-center justify-center gap-2 bg-hustle-blue text-white py-3 rounded-lg font-bold hover:bg-hustle-dark transition-colors"
              >
                <svg className="w-5 h-5" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call to Confirm
              </a>
            ) : null}
            <button
              onClick={resetForm}
              className="w-full py-3 rounded-lg font-bold text-hustle-muted border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-hustle-blue mb-2">
        Book an Appointment
      </h3>
      <p className="text-sm text-hustle-muted mb-4">
        Schedule a visit to {businessName}
      </p>

      <StepIndicator currentStep={step} />

      {/* ===== STEP 1: Date Selection ===== */}
      {step === 1 && (
        <div className="space-y-4">
          <h4 className="font-heading font-semibold text-hustle-dark">Choose a Date</h4>

          {businessHours.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium">No business hours set</p>
              <p className="mt-1">This business hasn&apos;t set their hours yet. You can still pick a date and they&apos;ll confirm availability.</p>
            </div>
          ) : null}

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Day headers */}
            {DAY_NAMES_SHORT.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-hustle-muted py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {next14Days().map((date) => {
              const closed = isDayClosed(date)
              const today = isToday(date)
              const selected = selectedDate && formatDateISO(date) === formatDateISO(selectedDate)
              const hours = getHoursForDay(date)

              return (
                <button
                  key={formatDateISO(date)}
                  type="button"
                  disabled={closed}
                  onClick={() => {
                    setSelectedDate(date)
                    setSelectedTime(null) // Reset time when date changes
                  }}
                  className={`relative flex flex-col items-center py-2 px-1 rounded-lg text-center transition-all duration-200 ${
                    closed
                      ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                      : selected
                      ? 'bg-hustle-amber text-hustle-dark ring-2 ring-hustle-amber ring-offset-1'
                      : today
                      ? 'bg-hustle-blue/5 text-hustle-dark hover:bg-hustle-amber/20 border border-hustle-blue/20'
                      : 'bg-gray-50 text-hustle-dark hover:bg-hustle-amber/20'
                  }`}
                >
                  <span className="text-[10px] font-medium leading-tight">
                    {DAY_NAMES_SHORT[date.getDay()]}
                  </span>
                  <span className={`text-lg font-bold leading-tight ${closed ? 'text-gray-300' : ''}`}>
                    {date.getDate()}
                  </span>
                  <span className="text-[9px] leading-tight">
                    {MONTH_NAMES[date.getMonth()]}
                  </span>
                  {closed && (
                    <span className="text-[8px] text-red-400 font-medium">Closed</span>
                  )}
                  {!closed && hours && hours.open_time && (
                    <span className={`text-[8px] leading-tight ${
                      selected ? 'text-hustle-dark/70' : 'text-hustle-muted'
                    }`}>
                      {hours.open_time.slice(0, 5)}
                    </span>
                  )}
                  {today && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-hustle-amber rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          {selectedDate && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-hustle-muted">
                Selected: <span className="font-semibold text-hustle-dark">{formatDateDisplay(selectedDate)}</span>
              </p>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-hustle-amber text-hustle-dark px-6 py-2.5 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== STEP 2: Time Selection ===== */}
      {step === 2 && selectedDate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-semibold text-hustle-dark">Pick a Time</h4>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-hustle-blue hover:text-hustle-dark transition-colors"
            >
              ← Change date
            </button>
          </div>

          <p className="text-sm text-hustle-muted">
            {formatDateDisplay(selectedDate)}
            {(() => {
              const hours = getHoursForDay(selectedDate)
              if (hours && hours.open_time && hours.close_time) {
                return ` • Open ${to12Hour(hours.open_time)} - ${to12Hour(hours.close_time)}`
              }
              return ''
            })()}
          </p>

          {timeSlots().length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots().map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTime === slot
                      ? 'bg-hustle-amber text-hustle-dark ring-2 ring-hustle-amber ring-offset-1'
                      : 'bg-gray-50 text-hustle-dark hover:bg-hustle-amber/20'
                  }`}
                >
                  {to12Hour(slot)}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-hustle-muted">No time slots available for this date.</p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-2 text-hustle-blue underline hover:text-hustle-dark"
              >
                Choose another date
              </button>
            </div>
          )}

          {selectedTime && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-hustle-muted">
                Time: <span className="font-semibold text-hustle-dark">{to12Hour(selectedTime)}</span>
              </p>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-hustle-amber text-hustle-dark px-6 py-2.5 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== STEP 3: Customer Details ===== */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-semibold text-hustle-dark">Your Details</h4>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm text-hustle-blue hover:text-hustle-dark transition-colors"
            >
              ← Change time
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-sm text-hustle-muted">
            {selectedDate && formatDateDisplay(selectedDate)} at {selectedTime && to12Hour(selectedTime)}
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-hustle-dark focus:outline-none focus:ring-2 focus:border-transparent ${
                phoneError
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-200 focus:ring-hustle-amber'
              }`}
              placeholder="08012345678"
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">
              Service Needed <span className="text-hustle-muted text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
              placeholder="e.g. Haircut, Consultation, Repair"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hustle-dark mb-1">
              Brief Note <span className="text-hustle-muted text-xs">(optional, max 200 chars)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 200))}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent resize-none"
              placeholder="Any special requests..."
            />
            <p className="text-xs text-hustle-muted text-right mt-1">{notes.length}/200</p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!customerName.trim() || !customerPhone.trim() || !!phoneError}
              onClick={() => setStep(4)}
              className="bg-hustle-amber text-hustle-dark px-6 py-2.5 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Booking →
            </button>
          </div>
        </div>
      )}

      {/* ===== STEP 4: Review & Submit ===== */}
      {step === 4 && selectedDate && selectedTime && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-semibold text-hustle-dark">Review Your Booking</h4>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-sm text-hustle-blue hover:text-hustle-dark transition-colors"
            >
              ← Edit details
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-hustle-muted">Business</span>
              <span className="font-semibold text-hustle-dark">{businessName}</span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-hustle-muted">Date</span>
              <span className="font-semibold text-hustle-dark">{formatDateDisplay(selectedDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-hustle-muted">Time</span>
              <span className="font-semibold text-hustle-dark">{to12Hour(selectedTime)}</span>
            </div>
            {service && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-hustle-muted">Service</span>
                <span className="font-semibold text-hustle-dark">{service}</span>
              </div>
            )}
            <div className="border-t border-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-hustle-muted">Name</span>
              <span className="font-semibold text-hustle-dark">{customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-hustle-muted">Phone</span>
              <span className="font-semibold text-hustle-dark">{customerPhone}</span>
            </div>
            {notes && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-hustle-muted">Note</span>
                <span className="font-medium text-hustle-dark text-right max-w-[60%]">{notes}</span>
              </div>
            )}
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full bg-hustle-amber text-hustle-dark py-3 rounded-lg font-bold text-lg hover:bg-hustle-sunset hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-5 h-5" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
