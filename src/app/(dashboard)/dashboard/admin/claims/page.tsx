"use client"

import { useEffect, useState } from 'react'

interface ClaimRow {
  id: string
  business_id: string
  user_id: string
  phone_entered: string | null
  phone_matched: boolean | null
  claim_method: string
  document_url: string | null
  document_type: string | null
  status: string
  reviewed_by: string | null
  reviewed_at: string | null
  notes: string | null
  created_at: string
  business: { name: string; slug: string } | null
}

export default function ClaimsAdminPage() {
  const [claims, setClaims] = useState<ClaimRow[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')
  const [processing, setProcessing] = useState<string | null>(null)
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null)

  const fetchClaims = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    const res = await fetch(`/api/admin/claims?${params}`)
    if (res.ok) {
      const json = await res.json()
      setClaims(json.data || [])
      setTotalCount(json.count || 0)
    }
    setLoading(false)
  }

  useEffect(() => { fetchClaims() }, [statusFilter])

  const pendingCount = claims.filter((c) => c.status === 'pending').length

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id)
    const res = await fetch(`/api/admin/claims/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, notes: rejectNotes[id] || '' }),
    })
    if (res.ok) {
      fetchClaims()
      setShowRejectForm(null)
    } else {
      alert('Failed to process claim')
    }
    setProcessing(null)
  }

  const methodLabel = (m: string) => {
    switch (m) {
      case 'phone_match': return 'Phone Match'
      case 'document_upload': return 'Document Upload'
      case 'dispute': return 'Dispute'
      default: return m
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">
          Claims
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              {pendingCount} pending
            </span>
          )}
        </h2>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hustle-blue/20"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Business</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Claimant</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Method</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Phone Matched</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Document</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Date</th>
                <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
              ) : claims.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-hustle-muted">No claims found</td></tr>
              ) : (
                claims.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-hustle-dark">{c.business?.name || '—'}</td>
                    <td className="px-4 py-3 text-hustle-muted text-xs font-mono">{c.user_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-hustle-muted">{methodLabel(c.claim_method)}</td>
                    <td className="px-4 py-3">
                      {c.phone_matched === null ? '—' : c.phone_matched ? (
                        <span className="text-green-600">✓ Yes</span>
                      ) : (
                        <span className="text-red-600">✗ No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        c.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.document_url ? (
                        <a href={c.document_url} target="_blank" rel="noopener noreferrer" className="text-hustle-blue hover:underline text-xs">
                          View {c.document_type || 'doc'}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {c.status === 'pending' ? (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(c.id, 'approve')}
                              disabled={processing === c.id}
                              className="text-xs px-2 py-1 rounded font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                            >
                              {processing === c.id ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => setShowRejectForm(showRejectForm === c.id ? null : c.id)}
                              className="text-xs px-2 py-1 rounded font-medium text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </div>
                          {showRejectForm === c.id && (
                            <div className="flex gap-1 mt-1">
                              <input
                                type="text"
                                placeholder="Rejection notes..."
                                value={rejectNotes[c.id] || ''}
                                onChange={(e) => setRejectNotes({ ...rejectNotes, [c.id]: e.target.value })}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-40"
                              />
                              <button
                                onClick={() => handleAction(c.id, 'reject')}
                                disabled={processing === c.id}
                                className="text-xs px-2 py-1 rounded font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                Confirm
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-hustle-muted">{c.notes || '—'}</span>
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
