'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const EXCLUDED_PATHS = ['/pricing', '/list-your-business', '/dashboard', '/login', '/signup', '/forgot-password', '/onboarding']

export default function SmartPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const pathname = usePathname()

  const isExcluded = EXCLUDED_PATHS.some(p => pathname.startsWith(p))

  useEffect(() => {
    if (isExcluded) return
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('popup_dismissed')) {
      setDismissed(true)
      return
    }

    let triggered = false
    const trigger = () => {
      if (!triggered) {
        triggered = true
        setShow(true)
      }
    }

    const timer = setTimeout(trigger, 30000)

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const scrollPercent = (window.scrollY / docHeight) * 100
        if (scrollPercent > 50) trigger()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isExcluded])

  if (!show || dismissed || isExcluded) return null

  const dismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('popup_dismissed', 'true')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={dismiss}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={dismiss} className="float-right text-gray-400 hover:text-gray-600 text-xl leading-none" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Own a Business in Nigeria?</h3>
        <p className="text-gray-600 mb-4">List your business for FREE on MyHustle and get discovered by thousands of customers searching for your services.</p>
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> Free forever listing</div>
          <div className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> Appear in Google &amp; AI search</div>
          <div className="flex items-center gap-2"><span className="text-green-500 font-bold">&#10003;</span> Get customer reviews &amp; bookings</div>
        </div>
        <div className="flex gap-2">
          <Link href="/list-your-business" className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            List My Business Free
          </Link>
          <a
            href="https://wa.me/2349160763078?text=Hi!%20I%20want%20to%20list%20my%20business%20on%20MyHustle"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-100 text-green-700 px-4 py-3 rounded-lg font-semibold hover:bg-green-200 transition flex items-center"
            aria-label="Contact via WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}
