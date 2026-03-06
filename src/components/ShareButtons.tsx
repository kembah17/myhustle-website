'use client'

import { useState, useEffect } from 'react'

interface ShareButtonsProps {
  businessName: string
  businessSlug: string
  categoryName?: string
  areaName?: string
  variant?: 'header' | 'compact'
}

export default function ShareButtons({
  businessName,
  businessSlug,
  categoryName,
  areaName,
  variant = 'header',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [pageUrl, setPageUrl] = useState(`https://myhustle.space/business/${businessSlug}`)

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const locationText = areaName ? ` in ${areaName}` : ''
  const categoryText = categoryName ? ` (${categoryName})` : ''
  const shareText = `Check out ${businessName}${categoryText}${locationText} on MyHustle 🔥\n${pageUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const input = document.createElement('input')
      input.value = pageUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
          title="Share on WhatsApp"
        >
          <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
        <button
          onClick={handleCopyLink}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
            copied
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-500 hover:bg-hustle-blue/10 hover:text-hustle-blue'
          }`}
          title={copied ? 'Link copied!' : 'Copy link'}
        >
          {copied ? (
            <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  // Header variant - used on business detail page
  return (
    <div className="flex items-center gap-2 mt-3">
      <span className="text-blue-200 text-sm mr-1">Share:</span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
      <button
        onClick={handleCopyLink}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          copied
            ? 'bg-green-500/20 text-green-300'
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}
