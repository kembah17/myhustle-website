"use client"

import { useEffect, useState } from 'react'

interface FlagRow {
  id: string
  business_id: string
  flag_type: string
  source: string
  reporter_id: string | null
  details: string | null
  status: string
  auto_action_taken: string | null
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
  business: { name: string; slug: string } | null
}

const FLAG_TYPE_COLORS: Record<string, string> = {
  spam: 'bg-red-100 text-red-700',
  incorrect_info: 'bg-amber-100 text-amber-700',
  closed: 'bg-gray-100 text-gray-600',
  inappropriate: 'bg-red-100 text-red-700',
  duplicate: 'bg-purple-100 text-purple-700',
  inactive: 'bg-gray-100 text-gray-600',
  phone_invalid: 'bg-orange-100 text-orange-700',
  quality_concern: 'bg-yellow-100 text-yellow-700',
}

const FLAG_TYPES = [
  'spam', 'incorrect_info', 'closed', 'inappropriate',
  'duplicate', 'inactive', 'phone_invalid', 'quality_concern',
]

export default function FlagsAdminPage() {
  const [flags, setFlags] = useState<FlagRow[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchFlags = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (typeFilter !== 'all') params.set('flag_type', typeFilter)
    const res = await fetch(`/api/admin/flags?${params}`)
    if (res.ok) {
      const json = await res.json()
      setFlags(json.data || [])
      setTotalCount(json.count || 0)
    }
    setLoading(false)
  }

  useEffect(() => { fetchFlags() }, [statusFilter, typeFilter])

  const openCount = flags.filter((f) => f.status === 'open').length

  const handleAction = async (id: string, action: 'resolve' | 'dismiss') => {
    setProcessing(id)
    const res = await fetch(`/api/admin/flags/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      fetchFlags()
    } else {
      alert('Failed to process flag')
    }
    setProcessing(null)
  }

  const sourceLabel = (s: string) => {
    switch (s) {
      case 'user_report': return 'User'
      case 'system_auto': return 'System'
      case 'admin': return 'Admin'
      default: return s
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">
          Flags
          {openCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              {openCount} open
            </span>
          )}
        </h2>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
        >
          <option value="all">All Types</option>
          {FLAG_TYPES.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Business</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Flag Type</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Source</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Reporter</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Auto Action</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Date</th>
                <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
              ) : flags.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-hustle-muted">No flags found</td></tr>
              ) : (
                flags.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-hustle-dark">{f.business?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${FLAG_TYPE_COLORS[f.flag_type] || 'bg-gray-100 text-gray-600'}`}>
                        {f.flag_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hustle-muted">{sourceLabel(f.source)}</td>
                    <td className="px-4 py-3 text-hustle-muted text-xs font-mono">
                      {f.reporter_id ? `${f.reporter_id.slice(0, 8)}...` : '—'}
                    </td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">{f.auto_action_taken || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        f.status === 'open' ? 'bg-red-100 text-red-700' :
                        f.status === 'reviewing' ? 'bg-amber-100 text-amber-700' :
                        f.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">
                      {new Date(f.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {(f.status === 'open' || f.status === 'reviewing') ? (
                        <>
                          <button
                            onClick={() => handleAction(f.id, 'resolve')}
                            disabled={processing === f.id}
                            className="text-xs px-2 py-1 rounded font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                          >
                            {processing === f.id ? '...' : 'Resolve'}
                          </button>
                          <button
                            onClick={() => handleAction(f.id, 'dismiss')}
                            disabled={processing === f.id}
                            className="text-xs px-2 py-1 rounded font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-hustle-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
