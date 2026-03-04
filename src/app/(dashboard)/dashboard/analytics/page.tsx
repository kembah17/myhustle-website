'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-browser'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Types
interface DailyStats {
  date: string
  page_views: number
  whatsapp_clicks: number
  call_clicks: number
  bookings_started: number
  bookings_completed: number
  search_impressions: number
  unique_visitors: number
}

interface KPIs {
  page_views: number
  whatsapp_clicks: number
  call_clicks: number
  bookings_started: number
  bookings_completed: number
  search_impressions: number
  unique_visitors: number
}

interface AnalyticsData {
  period: number
  current: KPIs
  previous: KPIs
  daily: DailyStats[]
  topQueries: { query: string; impressions: number }[]
  deviceSplit: Record<string, number>
  topReferrers: { source: string; count: number }[]
}

type PeriodOption = 7 | 30 | 90

function calcChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

// Loading skeleton
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-20" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-5 bg-gray-200 rounded w-40 mb-6" />
        <div className="flex items-end gap-1 h-48">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-100 rounded-t"
              style={{ height: `${20 + Math.random() * 80}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Empty state
function EmptyState({ businessSlug }: { businessSlug: string | null }) {
  const listingUrl = businessSlug
    ? `https://myhustle.com/business/${businessSlug}`
    : 'https://myhustle.com'
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(listingUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out my business on MyHustle! ${listingUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="text-5xl mb-4">📊</div>
      <h2 className="font-heading text-xl font-bold text-hustle-dark mb-2">
        Your analytics will appear here
      </h2>
      <p className="text-hustle-muted mb-8 max-w-md mx-auto">
        Once customers start finding your business, you&apos;ll see views, clicks,
        and bookings data here. Share your listing to get started!
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-hustle-blue text-white font-bold hover:bg-hustle-dark transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Listing Link
            </>
          )}
        </button>
        <button
          onClick={shareWhatsApp}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share on WhatsApp
        </button>
      </div>
    </div>
  )
}

// KPI Card
function KPICard({
  label,
  value,
  change,
  icon,
}: {
  label: string
  value: number
  change: number
  icon: string
}) {
  const isPositive = change >= 0
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-hustle-muted">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-3xl font-heading font-bold text-hustle-dark mb-1">
        {formatNumber(value)}
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
        <span>{isPositive ? '↑' : '↓'}</span>
        <span>{Math.abs(change)}%</span>
        <span className="text-hustle-muted font-normal">vs prev period</span>
      </div>
    </div>
  )
}

// Daily Views Bar Chart (pure CSS)
function DailyChart({ daily, period }: { daily: DailyStats[]; period: number }) {
  if (daily.length === 0) return null
  const maxViews = Math.max(...daily.map((d) => d.page_views), 1)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Fill in missing dates
  const filledDays: DailyStats[] = []
  const now = new Date()
  for (let i = period - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const existing = daily.find((dd) => dd.date === dateStr)
    filledDays.push(
      existing || {
        date: dateStr,
        page_views: 0,
        whatsapp_clicks: 0,
        call_clicks: 0,
        bookings_started: 0,
        bookings_completed: 0,
        search_impressions: 0,
        unique_visitors: 0,
      }
    )
  }

  // For 90 days, show weekly aggregates
  const displayDays = period > 30
    ? filledDays.reduce<DailyStats[]>((acc, day, i) => {
        if (i % 7 === 0) {
          acc.push({ ...day })
        } else if (acc.length > 0) {
          const last = acc[acc.length - 1]
          last.page_views += day.page_views
        }
        return acc
      }, [])
    : filledDays

  const displayMax = Math.max(...displayDays.map((d) => d.page_views), 1)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-heading text-lg font-bold text-hustle-dark mb-6">
        {period > 30 ? 'Weekly Views' : 'Daily Views'}
      </h3>
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-hustle-muted">
          <span>{displayMax}</span>
          <span>{Math.round(displayMax / 2)}</span>
          <span>0</span>
        </div>
        {/* Chart area */}
        <div className="ml-10">
          <div
            className="flex items-end gap-[2px] sm:gap-1"
            style={{ height: '200px' }}
            role="img"
            aria-label={`Bar chart showing ${period > 30 ? 'weekly' : 'daily'} page views`}
          >
            {displayDays.map((day, i) => {
              const heightPct = displayMax > 0 ? (day.page_views / displayMax) * 100 : 0
              const isHovered = hoveredIdx === i
              return (
                <div
                  key={day.date}
                  className="flex-1 relative group cursor-pointer"
                  style={{ height: '100%' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t transition-all duration-200 ${
                      isHovered ? 'bg-hustle-amber' : 'bg-hustle-blue'
                    }`}
                    style={{
                      height: `${Math.max(heightPct, day.page_views > 0 ? 2 : 0)}%`,
                      minHeight: day.page_views > 0 ? '2px' : '0',
                    }}
                  />
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-hustle-dark text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-lg">
                      <div className="font-bold">{day.page_views} views</div>
                      <div className="text-white/70">
                        {new Date(day.date + 'T00:00:00').toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-hustle-dark" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {/* X-axis labels */}
          <div className="flex gap-[2px] sm:gap-1 mt-2">
            {displayDays.map((day, i) => {
              // Show label every few bars depending on count
              const showLabel = period <= 7 || (period <= 30 ? i % 3 === 0 : true)
              return (
                <div key={day.date} className="flex-1 text-center">
                  {showLabel && (
                    <span className="text-[9px] sm:text-[10px] text-hustle-muted">
                      {new Date(day.date + 'T00:00:00').toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Action Breakdown horizontal bars
function ActionBreakdown({ current }: { current: KPIs }) {
  const actions = [
    { label: 'WhatsApp Taps', value: current.whatsapp_clicks, color: 'bg-green-500' },
    { label: 'Phone Calls', value: current.call_clicks, color: 'bg-hustle-blue' },
    { label: 'Bookings Started', value: current.bookings_started, color: 'bg-hustle-amber' },
    { label: 'Bookings Completed', value: current.bookings_completed, color: 'bg-hustle-sunset' },
  ]
  const maxVal = Math.max(...actions.map((a) => a.value), 1)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-heading text-lg font-bold text-hustle-dark mb-6">
        Action Breakdown
      </h3>
      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-hustle-dark">{action.label}</span>
              <span className="text-sm font-bold text-hustle-dark">{action.value}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${action.color}`}
                style={{ width: `${maxVal > 0 ? (action.value / maxVal) * 100 : 0}%`, minWidth: action.value > 0 ? '8px' : '0' }}
                role="progressbar"
                aria-valuenow={action.value}
                aria-valuemin={0}
                aria-valuemax={maxVal}
                aria-label={`${action.label}: ${action.value}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Top Search Queries table
function TopQueries({ queries }: { queries: { query: string; impressions: number }[] }) {
  if (queries.length === 0) return null
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-heading text-lg font-bold text-hustle-dark mb-4">
        Top Search Queries
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 pr-4 font-medium text-hustle-muted">#</th>
              <th className="text-left py-2 pr-4 font-medium text-hustle-muted">Search Term</th>
              <th className="text-right py-2 font-medium text-hustle-muted">Impressions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q, i) => (
              <tr key={q.query} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 pr-4 text-hustle-muted">{i + 1}</td>
                <td className="py-2.5 pr-4 font-medium text-hustle-dark">{q.query}</td>
                <td className="py-2.5 text-right text-hustle-dark">{q.impressions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Visitor Insights
function VisitorInsights({
  uniqueVisitors,
  deviceSplit,
  topReferrers,
}: {
  uniqueVisitors: number
  deviceSplit: Record<string, number>
  topReferrers: { source: string; count: number }[]
}) {
  const totalDevices = Object.values(deviceSplit).reduce((a, b) => a + b, 0) || 1
  const deviceEntries = Object.entries(deviceSplit).sort((a, b) => b[1] - a[1])
  const deviceIcons: Record<string, string> = { mobile: '📱', desktop: '💻', tablet: '📟' }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-heading text-lg font-bold text-hustle-dark mb-4">
        Visitor Insights
      </h3>
      <div className="space-y-6">
        {/* Unique visitors */}
        <div>
          <div className="text-sm text-hustle-muted mb-1">Unique Visitors</div>
          <div className="text-2xl font-heading font-bold text-hustle-dark">
            {formatNumber(uniqueVisitors)}
          </div>
        </div>

        {/* Device split */}
        {deviceEntries.length > 0 && (
          <div>
            <div className="text-sm font-medium text-hustle-muted mb-3">Device Split</div>
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-100 mb-2">
              {deviceEntries.map(([device, count], i) => {
                const colors = ['bg-hustle-blue', 'bg-hustle-amber', 'bg-hustle-sunset']
                return (
                  <div
                    key={device}
                    className={`${colors[i % colors.length]} transition-all duration-500`}
                    style={{ width: `${(count / totalDevices) * 100}%` }}
                    title={`${device}: ${count}`}
                  />
                )
              })}
            </div>
            <div className="flex flex-wrap gap-4">
              {deviceEntries.map(([device, count], i) => {
                const colors = ['text-hustle-blue', 'text-hustle-amber', 'text-hustle-sunset']
                const dotColors = ['bg-hustle-blue', 'bg-hustle-amber', 'bg-hustle-sunset']
                return (
                  <div key={device} className="flex items-center gap-2 text-sm">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColors[i % dotColors.length]}`} />
                    <span className="text-hustle-muted">
                      {deviceIcons[device] || '🖥️'} {device}
                    </span>
                    <span className={`font-bold ${colors[i % colors.length]}`}>
                      {Math.round((count / totalDevices) * 100)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Top referrers */}
        {topReferrers.length > 0 && (
          <div>
            <div className="text-sm font-medium text-hustle-muted mb-3">Top Referrers</div>
            <div className="space-y-2">
              {topReferrers.map((ref) => (
                <div key={ref.source} className="flex items-center justify-between text-sm">
                  <span className="text-hustle-dark">{ref.source}</span>
                  <span className="font-medium text-hustle-muted">{ref.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Analytics Page
export default function AnalyticsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [period, setPeriod] = useState<PeriodOption>(30)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [businessSlug, setBusinessSlug] = useState<string | null>(null)

  // Fetch business ID
  useEffect(() => {
    async function fetchBusiness() {
      if (!user) return
      const { data: biz } = await supabase
        .from('businesses')
        .select('id, slug')
        .eq('user_id', user.id)
        .maybeSingle()
      if (biz) {
        setBusinessId(biz.id)
        setBusinessSlug(biz.slug)
      }
    }
    fetchBusiness()
  }, [user, supabase])

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!businessId || !user) return
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('Please sign in to view analytics')
        return
      }

      const res = await fetch(
        `/api/analytics?business_id=${businessId}&period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to fetch analytics')
      }

      const analyticsData = await res.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [businessId, period, user, supabase])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // No business yet
  if (!loading && !businessId) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📊</div>
        <h1 className="font-heading text-2xl font-bold text-hustle-dark mb-2">
          No Business Found
        </h1>
        <p className="text-hustle-muted">
          Create your business listing first to see analytics.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-hustle-dark">
            Your Business Analytics
          </h1>
          <p className="text-hustle-muted text-sm mt-1">
            Track how customers find and interact with your listing
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {([7, 30, 90] as PeriodOption[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-hustle-blue text-white'
                  : 'bg-white border border-gray-200 text-hustle-muted hover:border-hustle-blue hover:text-hustle-blue'
              }`}
            >
              {p === 7 ? 'Last 7 days' : p === 30 ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && <AnalyticsSkeleton />}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-3 text-hustle-blue underline hover:text-hustle-dark"
          >
            Try again
          </button>
        </div>
      )}

      {/* Data loaded */}
      {!loading && !error && data && (
        <>
          {/* Check if there's any data */}
          {data.current.page_views === 0 &&
           data.current.whatsapp_clicks === 0 &&
           data.current.search_impressions === 0 &&
           data.current.bookings_completed === 0 ? (
            <EmptyState businessSlug={businessSlug} />
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  label="Profile Views"
                  value={data.current.page_views}
                  change={calcChange(data.current.page_views, data.previous.page_views)}
                  icon="👁️"
                />
                <KPICard
                  label="WhatsApp Taps"
                  value={data.current.whatsapp_clicks}
                  change={calcChange(data.current.whatsapp_clicks, data.previous.whatsapp_clicks)}
                  icon="💬"
                />
                <KPICard
                  label="Bookings"
                  value={data.current.bookings_completed}
                  change={calcChange(data.current.bookings_completed, data.previous.bookings_completed)}
                  icon="📅"
                />
                <KPICard
                  label="Search Appearances"
                  value={data.current.search_impressions}
                  change={calcChange(data.current.search_impressions, data.previous.search_impressions)}
                  icon="🔍"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DailyChart daily={data.daily} period={period} />
                <ActionBreakdown current={data.current} />
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopQueries queries={data.topQueries} />
                <VisitorInsights
                  uniqueVisitors={data.current.unique_visitors}
                  deviceSplit={data.deviceSplit}
                  topReferrers={data.topReferrers}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
