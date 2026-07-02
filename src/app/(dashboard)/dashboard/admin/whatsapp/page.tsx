"use client"

import { useState, useEffect, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'

type TabId = 'overview' | 'config' | 'messages' | 'flows' | 'templates'

interface MessageRow {
  id: string
  direction: string
  phone: string
  message_type: string
  template_name: string | null
  content: string | null
  status: string
  flow_type: string | null
  cost_ngn: number | null
  created_at: string
}

interface FlowRow {
  id: string
  flow_type: string
  status: string
  step: number
  business_id: string | null
  created_at: string
  updated_at: string
  businesses?: { name: string; slug: string } | null
}

interface TemplateRow {
  id: string
  name: string
  category: string
  language: string
  status: string
  flow_type: string | null
  updated_at: string
}

interface ConfigData {
  id?: string
  phone_number_id?: string
  waba_id?: string
  display_phone?: string
  business_name?: string
  is_active?: boolean
  verify_token?: string
}

interface Stats {
  totalMessages: number
  sentToday: number
  activeFlows: number
  totalCostNgn: number
}

export default function WhatsAppAdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ totalMessages: 0, sentToday: 0, activeFlows: 0, totalCostNgn: 0 })
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [flows, setFlows] = useState<FlowRow[]>([])
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [hasEnvFallback, setHasEnvFallback] = useState(false)

  // Config form state
  const [configForm, setConfigForm] = useState({
    phone_number_id: '',
    waba_id: '',
    access_token: '',
    verify_token: 'myhustle_webhook_verify',
    business_name: 'MyHustle',
  })
  const [configSaving, setConfigSaving] = useState(false)
  const [configError, setConfigError] = useState('')

  const getAuthHeaders = useCallback(async () => {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return null
    return { Authorization: `Bearer ${session.access_token}` }
  }, [])

  const loadStats = useCallback(async () => {
    const supabase = getSupabase()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [msgResult, todayResult, flowResult, costResult] = await Promise.all([
      supabase.from('whatsapp_messages').select('id', { count: 'exact', head: true }),
      supabase.from('whatsapp_messages').select('id', { count: 'exact', head: true })
        .eq('direction', 'outbound').gte('created_at', today.toISOString()),
      supabase.from('whatsapp_flows').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('whatsapp_messages').select('cost_ngn').eq('direction', 'outbound'),
    ])

    const totalCost = (costResult.data || []).reduce((sum, r) => sum + (Number(r.cost_ngn) || 0), 0)

    setStats({
      totalMessages: msgResult.count || 0,
      sentToday: todayResult.count || 0,
      activeFlows: flowResult.count || 0,
      totalCostNgn: totalCost,
    })
  }, [])

  const loadMessages = useCallback(async () => {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('whatsapp_messages')
      .select('id, direction, phone, message_type, template_name, content, status, flow_type, cost_ngn, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    setMessages((data as MessageRow[]) || [])
  }, [])

  const loadFlows = useCallback(async () => {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('whatsapp_flows')
      .select('id, flow_type, status, step, business_id, created_at, updated_at, businesses(name, slug)')
      .order('created_at', { ascending: false })
      .limit(50)
    setFlows((data as unknown as FlowRow[]) || [])
  }, [])

  const loadTemplates = useCallback(async () => {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('whatsapp_templates')
      .select('id, name, category, language, status, flow_type, updated_at')
      .order('name')
    setTemplates((data as TemplateRow[]) || [])
  }, [])

  const loadConfig = useCallback(async () => {
    const headers = await getAuthHeaders()
    if (!headers) return
    try {
      const res = await fetch('/api/whatsapp/config', { headers })
      const data = await res.json()
      setConfig(data.config)
      setHasEnvFallback(data.hasEnvFallback)
      if (data.config) {
        setConfigForm({
          phone_number_id: data.config.phone_number_id || '',
          waba_id: data.config.waba_id || '',
          access_token: '',
          verify_token: data.config.verify_token || 'myhustle_webhook_verify',
          business_name: data.config.business_name || 'MyHustle',
        })
      }
    } catch {
      // Config table may not exist yet
    }
  }, [getAuthHeaders])

  useEffect(() => {
    async function init() {
      setLoading(true)
      await Promise.all([loadStats(), loadConfig()])
      setLoading(false)
    }
    init()
  }, [loadStats, loadConfig])

  useEffect(() => {
    if (activeTab === 'messages') loadMessages()
    if (activeTab === 'flows') loadFlows()
    if (activeTab === 'templates') loadTemplates()
  }, [activeTab, loadMessages, loadFlows, loadTemplates])

  const saveConfig = async () => {
    setConfigSaving(true)
    setConfigError('')
    const headers = await getAuthHeaders()
    if (!headers) { setConfigError('Not authenticated'); setConfigSaving(false); return }
    try {
      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setConfig(data.config)
      await loadStats()
    } catch (err) {
      setConfigError(err instanceof Error ? err.message : 'Save failed')
    }
    setConfigSaving(false)
  }

  const syncTemplates = async () => {
    const headers = await getAuthHeaders()
    if (!headers) return
    try {
      const res = await fetch('/api/whatsapp/templates', {
        method: 'POST',
        headers,
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Synced ${data.synced} of ${data.total} templates`)
        loadTemplates()
      } else {
        alert(data.error || 'Sync failed')
      }
    } catch {
      alert('Sync failed')
    }
  }

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'flows', label: 'Flows', icon: '🔄' },
    { id: 'templates', label: 'Templates', icon: '📝' },
  ]

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading WhatsApp dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-hustle-dark">WhatsApp Messaging</h2>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          config?.is_active ? 'bg-green-100 text-green-800' :
          hasEnvFallback ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {config?.is_active ? '✅ Connected' : hasEnvFallback ? '⚠️ Env Fallback' : '❌ Not Configured'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-hustle-blue text-hustle-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Messages" value={stats.totalMessages.toLocaleString()} icon="💬" />
          <StatCard label="Sent Today" value={stats.sentToday.toLocaleString()} icon="📤" />
          <StatCard label="Active Flows" value={stats.activeFlows.toLocaleString()} icon="🔄" />
          <StatCard label="Total Cost" value={`₦${stats.totalCostNgn.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon="💰" />
        </div>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 max-w-xl">
          <h3 className="font-semibold text-hustle-dark">WhatsApp Cloud API Configuration</h3>
          {config?.display_phone && (
            <p className="text-sm text-gray-600">Connected: <strong>{config.display_phone}</strong></p>
          )}
          <div className="space-y-3">
            <FormField label="Phone Number ID" value={configForm.phone_number_id}
              onChange={(v) => setConfigForm({ ...configForm, phone_number_id: v })} />
            <FormField label="WABA ID" value={configForm.waba_id}
              onChange={(v) => setConfigForm({ ...configForm, waba_id: v })} />
            <FormField label="Access Token" value={configForm.access_token}
              onChange={(v) => setConfigForm({ ...configForm, access_token: v })} type="password"
              placeholder={config ? '(unchanged — enter new to update)' : ''} />
            <FormField label="Verify Token" value={configForm.verify_token}
              onChange={(v) => setConfigForm({ ...configForm, verify_token: v })} />
            <FormField label="Business Name" value={configForm.business_name}
              onChange={(v) => setConfigForm({ ...configForm, business_name: v })} />
          </div>
          {configError && <p className="text-sm text-red-600">{configError}</p>}
          <button onClick={saveConfig} disabled={configSaving}
            className="px-4 py-2 bg-hustle-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {configSaving ? 'Saving...' : 'Save & Verify'}
          </button>
          <p className="text-xs text-gray-400">
            Webhook URL: <code className="bg-gray-100 px-1 rounded">https://myhustle.space/api/whatsapp/webhook</code>
          </p>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">Direction</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Phone</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Type</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Content</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Flow</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Cost</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No messages yet</td></tr>
                ) : messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
                        msg.direction === 'inbound' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>{msg.direction === 'inbound' ? '📥 In' : '📤 Out'}</span>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{msg.phone}</td>
                    <td className="px-4 py-2">{msg.template_name || msg.message_type}</td>
                    <td className="px-4 py-2 max-w-[200px] truncate" title={msg.content || ''}>{msg.content || '—'}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={msg.status} />
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">{msg.flow_type || '—'}</td>
                    <td className="px-4 py-2 text-xs">{msg.cost_ngn ? `₦${msg.cost_ngn}` : '—'}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flows Tab */}
      {activeTab === 'flows' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">Type</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Business</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Step</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Created</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {flows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No flows yet</td></tr>
                ) : flows.map((flow) => (
                  <tr key={flow.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{flow.flow_type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2 text-sm">{flow.businesses?.name || flow.business_id || '—'}</td>
                    <td className="px-4 py-2"><StatusBadge status={flow.status} /></td>
                    <td className="px-4 py-2 text-center">{flow.step}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(flow.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(flow.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={syncTemplates}
              className="px-4 py-2 bg-hustle-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              🔄 Sync from Meta
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Category</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Language</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Flow</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {templates.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No templates — click Sync to import from Meta</td></tr>
                  ) : templates.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-xs">{t.name}</td>
                      <td className="px-4 py-2">{t.category}</td>
                      <td className="px-4 py-2">{t.language}</td>
                      <td className="px-4 py-2"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-2 text-xs text-gray-500">{t.flow_type || '—'}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{new Date(t.updated_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        <span>{icon}</span> {label}
      </div>
      <div className="text-2xl font-bold text-hustle-dark">{value}</div>
    </div>
  )
}

function FormField({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
      />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    sent: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    read: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-gray-100 text-gray-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
