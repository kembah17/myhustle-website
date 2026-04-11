"use client"

import { useEffect, useState } from 'react'

interface SuggestionRow {
  id: string
  business_name: string
  category: string
  area: string
  city: string
  phone_number: string | null
  suggester_name: string | null
  suggester_phone: string | null
  status: string
  priority: number
  created_at: string
}

export default function SuggestionsAdminPage() {
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchSuggestions = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    const res = await fetch(`/api/admin/suggestions?${params}`)
    if (res.ok) {
      const json = await res.json()
      setSuggestions(json.data || [])
      setTotalCount(json.count || 0)
    }
    setLoading(false)
  }

  useEffect(() => { fetchSuggestions() }, [statusFilter])

  const pendingCount = suggestions.filter((s) => s.status === 'pending').length

  const handleStatusUpdate = async (id: string, status: string) => {
    setProcessing(id)
    const res = await fetch(`/api/admin/suggestions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      fetchSuggestions()
    } else {
      alert('Failed to update suggestion')
    }
    setProcessing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">
          Suggestions
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
          <option value="contacted">Contacted</option>
          <option value="listed">Listed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Business Name</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Category</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Area</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">City</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Suggester</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Date</th>
                <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
              ) : suggestions.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-hustle-muted">No suggestions found</td></tr>
              ) : (
                suggestions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-hustle-dark">{s.business_name}</td>
                    <td className="px-4 py-3 text-hustle-muted">{s.category}</td>
                    <td className="px-4 py-3 text-hustle-muted">{s.area}</td>
                    <td className="px-4 py-3 text-hustle-muted">{s.city}</td>
                    <td className="px-4 py-3">
                      {s.priority > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          🔥 {s.priority}
                        </span>
                      ) : (
                        <span className="text-hustle-muted">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">
                      {s.suggester_name || '—'}
                      {s.suggester_phone && <div className="text-hustle-muted">{s.suggester_phone}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        s.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        s.status === 'listed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                      {s.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(s.id, 'contacted')}
                            disabled={processing === s.id}
                            className="text-xs px-2 py-1 rounded font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                          >
                            Contacted
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(s.id, 'listed')}
                            disabled={processing === s.id}
                            className="text-xs px-2 py-1 rounded font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                          >
                            Listed
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(s.id, 'rejected')}
                            disabled={processing === s.id}
                            className="text-xs px-2 py-1 rounded font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {s.status === 'contacted' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(s.id, 'listed')}
                            disabled={processing === s.id}
                            className="text-xs px-2 py-1 rounded font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                          >
                            Listed
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(s.id, 'rejected')}
                            disabled={processing === s.id}
                            className="text-xs px-2 py-1 rounded font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(s.status === 'listed' || s.status === 'rejected') && (
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
