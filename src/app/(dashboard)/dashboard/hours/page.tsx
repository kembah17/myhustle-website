'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import type { BusinessHour } from '@/lib/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface HourForm {
  day: number
  open_time: string
  close_time: string
  closed: boolean
  id?: string
}

export default function HoursPage() {
  const { user, loading: authLoading } = useAuth()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [hours, setHours] = useState<HourForm[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data: biz } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!biz) {
      router.push('/onboarding')
      return
    }

    setBusinessId(biz.id)

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

  const handleSave = async () => {
    if (!businessId) return
    setSaving(true)

    try {
      // Delete existing hours
      await supabase
        .from('business_hours')
        .delete()
        .eq('business_id', businessId)

      // Insert updated hours
      const hoursData = hours.map(h => ({
        business_id: businessId,
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
      setSaving(false)
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
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">Business Hours</h1>
          <p className="text-hustle-muted">Set when your business is open</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-hustle-blue text-white hover:bg-hustle-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <><LoadingSpinner size="sm" /> Saving...</> : 'Save Hours'}
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
