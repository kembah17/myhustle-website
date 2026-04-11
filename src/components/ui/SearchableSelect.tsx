'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

export interface SelectOption {
  value: string
  label: string
  group?: string
  searchTerms?: string
}

interface SearchableSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  error?: boolean
  grouped?: boolean
  disabled?: boolean
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Search...',
  error = false,
  grouped = false,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selectedOption = useMemo(
    () => options.find(o => o.value === value),
    [options, value]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter(o => {
      const haystack = (o.searchTerms || o.label).toLowerCase()
      return haystack.includes(q)
    })
  }, [options, search])

  // Group options if grouped prop is set
  const groupedOptions = useMemo(() => {
    if (!grouped) return null
    const groups: Record<string, SelectOption[]> = {}
    for (const opt of filtered) {
      const g = opt.group || 'Other'
      if (!groups[g]) groups[g] = []
      groups[g].push(opt)
    }
    return groups
  }, [filtered, grouped])

  // Flat list for keyboard navigation
  const flatFiltered = useMemo(() => {
    if (!grouped || !groupedOptions) return filtered
    const flat: SelectOption[] = []
    for (const key of Object.keys(groupedOptions).sort()) {
      flat.push(...groupedOptions[key])
    }
    return flat
  }, [filtered, grouped, groupedOptions])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
        onBlur?.()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onBlur])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option]')
      items[highlightIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex(prev => Math.min(prev + 1, flatFiltered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightIndex >= 0 && highlightIndex < flatFiltered.length) {
          handleSelect(flatFiltered[highlightIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearch('')
        break
    }
  }, [isOpen, highlightIndex, flatFiltered])

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
    setSearch('')
    setHighlightIndex(-1)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearch('')
    setIsOpen(false)
  }

  const handleOpen = () => {
    if (disabled) return
    setIsOpen(true)
    setHighlightIndex(-1)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const renderOptions = () => {
    if (flatFiltered.length === 0) {
      return (
        <div className="px-4 py-3 text-sm text-gray-500">
          No results found
        </div>
      )
    }

    if (grouped && groupedOptions) {
      let globalIndex = 0
      return Object.keys(groupedOptions).sort().map(groupName => (
        <div key={groupName}>
          <div className="px-3 py-1.5 text-xs font-semibold text-hustle-muted bg-gray-50 sticky top-0">
            {groupName}
          </div>
          {groupedOptions[groupName].map(opt => {
            const idx = globalIndex++
            return (
              <div
                key={opt.value}
                data-option
                onClick={() => handleSelect(opt.value)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                  idx === highlightIndex
                    ? 'bg-hustle-blue/10 text-hustle-blue'
                    : opt.value === value
                    ? 'bg-hustle-light text-hustle-dark font-medium'
                    : 'text-hustle-dark hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </div>
            )
          })}
        </div>
      ))
    }

    return filtered.map((opt, idx) => (
      <div
        key={opt.value}
        data-option
        onClick={() => handleSelect(opt.value)}
        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
          idx === highlightIndex
            ? 'bg-hustle-blue/10 text-hustle-blue'
            : opt.value === value
            ? 'bg-hustle-light text-hustle-dark font-medium'
            : 'text-hustle-dark hover:bg-gray-50'
        }`}
      >
        {opt.label}
      </div>
    ))
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Selected value display / trigger */}
      {!isOpen && (
        <div
          onClick={handleOpen}
          className={`w-full px-4 py-2.5 rounded-lg border text-sm cursor-pointer flex items-center justify-between ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className={selectedOption ? 'text-hustle-dark' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {selectedOption && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-0.5"
                aria-label="Clear selection"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Search input (shown when open) */}
      {isOpen && (
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setHighlightIndex(0)
          }}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2.5 rounded-lg border border-hustle-blue text-sm text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
          placeholder={placeholder}
          autoComplete="off"
        />
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {renderOptions()}
        </div>
      )}
    </div>
  )
}