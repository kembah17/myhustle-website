'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import type { Booking } from '@/lib/types'

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

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

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false })

    setBookings(data || [])
    setLoading(false)
  }, [user, supabase, router])

  useEffect(() => {
    if (!authLoading) fetchData()
  }, [authLoading, fetchData])

  const updateStatus = async (bookingId: string, status: string) => {
    setUpdating(bookingId)
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ))
      setToast({ message: `Booking ${status}!`, type: 'success' })
    }
    setUpdating(null)
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter)

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
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
          <h1 className="font-heading text-2xl font-bold text-hustle-dark">Bookings</h1>
          <p className="text-hustle-muted">Manage customer booking requests</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-hustle-blue text-white'
                  : 'bg-white text-hustle-muted border border-gray-200 hover:bg-hustle-light'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-1 text-xs">
                  ({bookings.filter(b => b.status === f).length})
                </span>
              )}
              {f === 'all' && (
                <span className="ml-1 text-xs">({bookings.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-hustle-muted font-medium">No {filter === 'all' ? '' : filter + ' '}bookings yet.</p>
            <p className="text-sm text-hustle-muted mt-1">
              {filter === 'all'
                ? 'Bookings will appear here when customers book your services.'
                : `You have no ${filter} bookings at the moment.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-hustle-light border-b border-gray-200">
                    <th className="w-10 py-3 px-2"></th>
                    <th className="text-left py-3 px-4 text-hustle-muted font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-hustle-muted font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-hustle-muted font-medium">Service</th>
                    <th className="text-left py-3 px-4 text-hustle-muted font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-hustle-muted font-medium hidden lg:table-cell">Time</th>
                    <th className="text-left py-3 px-4 text-hustle-muted font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-hustle-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(booking => {
                    const isExpanded = expandedRows.has(booking.id)
                    return (
                      <>
                        <tr
                          key={booking.id}
                          onClick={() => toggleRow(booking.id)}
                          className={`border-b border-gray-50 hover:bg-hustle-light/50 cursor-pointer ${
                            isExpanded ? 'bg-hustle-light/30' : ''
                          }`}
                        >
                          <td className="py-3 px-2 text-center">
                            <svg
                              width="16"
                              height="16"
                              style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}}
                              className={`w-4 h-4 text-hustle-muted transition-transform duration-200 inline-block ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-hustle-dark">{booking.customer_name}</p>
                            {booking.customer_email && (
                              <p className="text-xs text-hustle-muted">{booking.customer_email}</p>
                            )}
                          </td>
                          <td className="py-3 px-4 text-hustle-muted">
                            {booking.customer_phone || '\u2014'}
                          </td>
                          <td className="py-3 px-4 text-hustle-muted">
                            {booking.service || '\u2014'}
                          </td>
                          <td className="py-3 px-4 text-hustle-dark">{booking.date}</td>
                          <td className="py-3 px-4 text-hustle-muted hidden lg:table-cell">
                            {booking.time || '\u2014'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex gap-1 justify-end">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                    disabled={updating === booking.id}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                  >
                                    {updating === booking.id ? '...' : 'Confirm'}
                                  </button>
                                  <button
                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                    disabled={updating === booking.id}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => updateStatus(booking.id, 'completed')}
                                  disabled={updating === booking.id}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                  {updating === booking.id ? '...' : 'Complete'}
                                </button>
                              )}
                              {(booking.status === 'completed' || booking.status === 'cancelled') && (
                                <span className="text-xs text-hustle-muted italic">No actions</span>
                              )}
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${booking.id}-detail`} className="bg-hustle-light/40">
                            <td colSpan={8} className="px-4 py-4">
                              <div className="ml-8 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-hustle-muted font-medium mb-1">Email</p>
                                  <p className="text-hustle-dark">{booking.customer_email || '\u2014'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-hustle-muted font-medium mb-1">Service</p>
                                  <p className="text-hustle-dark">{booking.service || '\u2014'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-hustle-muted font-medium mb-1">Time</p>
                                  <p className="text-hustle-dark">{booking.time || '\u2014'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-hustle-muted font-medium mb-1">Created</p>
                                  <p className="text-hustle-dark">
                                    {new Date(booking.created_at).toLocaleDateString('en-NG', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                                {booking.notes && (
                                  <div className="col-span-2 lg:col-span-4">
                                    <p className="text-xs text-hustle-muted font-medium mb-1">Notes</p>
                                    <p className="text-hustle-dark bg-white rounded-lg p-3 border border-gray-100">
                                      {booking.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map(booking => {
                const isExpanded = expandedRows.has(booking.id)
                return (
                  <div key={booking.id} className="p-4">
                    <button
                      onClick={() => toggleRow(booking.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <svg
                            width="16"
                            height="16"
                            style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}}
                            className={`w-4 h-4 text-hustle-muted transition-transform duration-200 mt-0.5 ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="font-medium text-hustle-dark">{booking.customer_name}</p>
                            <p className="text-xs text-hustle-muted mt-0.5">
                              {booking.date}{booking.time ? ` at ${booking.time}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 ml-6 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-hustle-muted font-medium">Phone</p>
                            <p className="text-hustle-dark">{booking.customer_phone || '\u2014'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-hustle-muted font-medium">Email</p>
                            <p className="text-hustle-dark text-xs break-all">{booking.customer_email || '\u2014'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-hustle-muted font-medium">Service</p>
                            <p className="text-hustle-dark">{booking.service || '\u2014'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-hustle-muted font-medium">Created</p>
                            <p className="text-hustle-dark text-xs">
                              {new Date(booking.created_at).toLocaleDateString('en-NG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        {booking.notes && (
                          <div>
                            <p className="text-xs text-hustle-muted font-medium mb-1">Notes</p>
                            <p className="text-sm text-hustle-dark bg-hustle-light rounded-lg p-3">
                              {booking.notes}
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                disabled={updating === booking.id}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {updating === booking.id ? '...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                disabled={updating === booking.id}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateStatus(booking.id, 'completed')}
                              disabled={updating === booking.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {updating === booking.id ? '...' : 'Complete'}
                            </button>
                          )}
                          {(booking.status === 'completed' || booking.status === 'cancelled') && (
                            <span className="text-xs text-hustle-muted italic">No actions available</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Notes section */}
        {filtered.some(b => b.notes) && (
          <div className="bg-hustle-light rounded-xl p-4">
            <p className="text-xs text-hustle-muted">💡 Click on a booking row to expand and see full details including notes.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
