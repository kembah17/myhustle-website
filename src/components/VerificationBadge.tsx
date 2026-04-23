'use client'

import { useState } from 'react'

interface VerificationBadgeProps {
  tier: number
  variant?: 'compact' | 'full'
}

const TIER_CONFIG = {
  1: {
    label: 'Phone Verified',
    description: 'This business has verified their phone number via OTP.',
    bgClass: 'bg-hustle-blue',
    textClass: 'text-white',
    bgClassFull: 'bg-hustle-blue/20',
    textClassFull: 'text-blue-100',
    icon: (
      <svg
        className="w-3 h-3"
        width="12"
        height="12"
        style={{ width: '12px', height: '12px', maxWidth: '12px', maxHeight: '12px', flexShrink: 0 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    iconFull: (
      <svg
        className="w-4 h-4"
        width="16"
        height="16"
        style={{ width: '16px', height: '16px', maxWidth: '16px', maxHeight: '16px', flexShrink: 0 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  2: {
    label: 'Verified Business',
    description: 'This business has submitted verified registration documents (CAC, Tax ID).',
    bgClass: 'bg-hustle-amber',
    textClass: 'text-white',
    bgClassFull: 'bg-hustle-amber/20',
    textClassFull: 'text-amber-100',
    icon: (
      <svg
        className="w-3 h-3"
        width="12"
        height="12"
        style={{ width: '12px', height: '12px', maxWidth: '12px', maxHeight: '12px', flexShrink: 0 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    iconFull: (
      <svg
        className="w-4 h-4"
        width="16"
        height="16"
        style={{ width: '16px', height: '16px', maxWidth: '16px', maxHeight: '16px', flexShrink: 0 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  3: {
    label: 'Fully Verified ✓',
    description: 'This business has been remotely verified by the MyHustle team via live video call.',
    bgClass: 'bg-green-500',
    textClass: 'text-white',
    bgClassFull: 'bg-green-500/20',
    textClassFull: 'text-green-100',
    icon: (
      <svg
        className="w-3 h-3"
        width="12"
        height="12"
        style={{ width: '12px', height: '12px', maxWidth: '12px', maxHeight: '12px', flexShrink: 0 }}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconFull: (
      <svg
        className="w-4 h-4"
        width="16"
        height="16"
        style={{ width: '16px', height: '16px', maxWidth: '16px', maxHeight: '16px', flexShrink: 0 }}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
} as const

export default function VerificationBadge({ tier, variant = 'compact' }: VerificationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (tier <= 0 || tier > 3) return null

  const config = TIER_CONFIG[tier as 1 | 2 | 3]

  if (variant === 'compact') {
    return (
      <span
        className={`ml-2 flex-shrink-0 inline-flex items-center gap-1 ${config.bgClass} ${config.textClass} text-xs font-medium px-2 py-1 rounded-full`}
      >
        {config.icon}
        {config.label}
      </span>
    )
  }

  // Full variant - for detail page header (dark background)
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 ${config.bgClassFull} ${config.textClassFull} text-sm font-medium px-3 py-1 rounded-full cursor-help transition-colors hover:opacity-90`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {config.iconFull}
        {config.label}
      </button>
      {showTooltip && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white text-hustle-dark text-sm rounded-lg shadow-lg border border-gray-200 p-3 z-50">
          <p className="font-semibold mb-1">{config.label}</p>
          <p className="text-hustle-muted text-xs">{config.description}</p>
        </div>
      )}
    </div>
  )
}
