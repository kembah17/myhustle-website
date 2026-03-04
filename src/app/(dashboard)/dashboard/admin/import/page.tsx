"use client"

import { useState } from 'react'

interface ImportSummary {
  states: { inserted: number; skipped: number }
  cities: { inserted: number; skipped: number }
  areas: { inserted: number; skipped: number }
  landmarks: { inserted: number; skipped: number }
  errors: string[]
}

export default function ImportPage() {
  const [jsonText, setJsonText] = useState('')
  const [preview, setPreview] = useState<Record<string, unknown[]> | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportSummary | null>(null)
  const [error, setError] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setJsonText(text)
      tryPreview(text)
    }
    reader.readAsText(file)
  }

  const tryPreview = (text: string) => {
    try {
      const data = JSON.parse(text)
      setPreview(data)
      setError('')
    } catch {
      setPreview(null)
      setError('Invalid JSON format')
    }
  }

  const handleTextChange = (text: string) => {
    setJsonText(text)
    if (text.trim()) tryPreview(text)
    else { setPreview(null); setError('') }
  }

  const handleImport = async () => {
    if (!preview) return
    setImporting(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonText,
      })
      if (res.ok) {
        setResult(await res.json())
      } else {
        const d = await res.json()
        setError(d.error || 'Import failed')
      }
    } catch {
      setError('Network error during import')
    }
    setImporting(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-hustle-dark">Bulk Import</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-2">Upload JSON File</label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-hustle-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-hustle-blue file:text-white hover:file:bg-hustle-blue/90"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-hustle-dark mb-2">Or Paste JSON</label>
          <textarea
            value={jsonText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
            rows={12}
            placeholder={'{\n  "states": [{"name": "Kano State", "code": "KN", "geo_zone": "North-West"}],\n  "cities": [{"name": "Kano", "state": "Kano State", "lat": 12.0, "lon": 8.52}],\n  "areas": [{"name": "Sabon Gari", "city": "Kano", "lat": 12.01, "lon": 8.53}],\n  "landmarks": [{"name": "Kano City Wall", "city": "Kano", "type": "historical"}]\n}'}
          />
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}

        {/* Preview */}
        {preview && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-hustle-dark">Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['states', 'cities', 'areas', 'landmarks'] as const).map((key) => (
                <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-lg font-bold text-hustle-dark">
                    {Array.isArray(preview[key]) ? preview[key].length : 0}
                  </div>
                  <div className="text-xs text-hustle-muted capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!preview || importing}
          className="bg-hustle-blue text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 disabled:opacity-50 transition-colors"
        >
          {importing ? '📦 Importing...' : '📦 Import Data'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-hustle-dark">Import Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['states', 'cities', 'areas', 'landmarks'] as const).map((key) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-hustle-muted capitalize mb-1">{key}</div>
                <div className="text-sm">
                  <span className="text-green-600 font-medium">✓ {result[key].inserted}</span>
                  {result[key].skipped > 0 && (
                    <span className="text-amber-600 font-medium ml-2">⊘ {result[key].skipped}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {result.errors.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-700 mb-2">Errors ({result.errors.length})</h4>
              <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
