'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WHATSAPP_URL, WhatsAppIcon } from '@/components/WhatsAppCTA'

export default function WhatsAppFloatingButton() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide on dashboard and onboarding pages
  const hiddenPaths = ['/dashboard', '/onboarding']
  const shouldHide = hiddenPaths.some(p => pathname.startsWith(p))

  if (!mounted || shouldHide) return null

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-gentle"
      aria-label="List your business free on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8" />
      <span className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-hustle-dark text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
        List your business free
        <span className="absolute top-full right-4 -mt-1 w-2 h-2 bg-hustle-dark rotate-45" />
      </span>
    </a>
  )
}
