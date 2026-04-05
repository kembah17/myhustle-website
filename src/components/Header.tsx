"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-browser'

interface CityLink {
  slug: string
  name: string
}

const FALLBACK_CITIES: CityLink[] = [
  { slug: 'lagos', name: 'Lagos' },
  { slug: 'abuja', name: 'Abuja' },
  { slug: 'port-harcourt', name: 'Port Harcourt' },
]

let cachedCities: CityLink[] | null = null

export default function Header() {
  const [cities, setCities] = useState<CityLink[]>(cachedCities || FALLBACK_CITIES)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (cachedCities || fetchedRef.current) return
    fetchedRef.current = true

    const supabase = createClient()
    supabase
      .from('cities')
      .select('slug, name')
      .order('name')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped = data.map((c: { slug: string; name: string }) => ({
            slug: c.slug,
            name: c.name,
          }))
          cachedCities = mapped
          setCities(mapped)
        }
      })
  }, [])

  return (
    <header className="bg-hustle-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-white.svg"
              alt="MyHustle - Get Found. Get Booked. Get Paid."
              width={160}
              height={48}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {/* City dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium hover:text-hustle-amber transition-colors flex items-center gap-1">
                Cities
                <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="block px-4 py-2 text-hustle-dark hover:bg-gray-50 text-sm"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/categories" className="text-sm font-medium hover:text-hustle-amber transition-colors">
              Categories
            </Link>
            <Link href="/near-me" className="text-sm font-medium hover:text-hustle-amber transition-colors">
              Nearby
            </Link>
            <Link href="/help" className="text-sm font-medium hover:text-hustle-amber transition-colors">
              Help
            </Link>
            <Link
              href="/list-your-business"
              className="bg-hustle-amber text-hustle-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
            >
              List Your Business
            </Link>
          </nav>
          <button
            className="md:hidden text-white"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" width="24" height="24" style={{width:"24px",height:"24px",maxWidth:"24px",maxHeight:"24px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider px-2 pt-2">Cities</p>
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-sm hover:text-hustle-amber transition-colors"
              >
                {city.name}
              </Link>
            ))}
            <hr className="border-white/20" />
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-sm hover:text-hustle-amber transition-colors">Categories</Link>
            <Link href="/near-me" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-sm hover:text-hustle-amber transition-colors">Nearby</Link>
            <Link href="/help" onClick={() => setMobileMenuOpen(false)} className="block px-2 py-1.5 text-sm hover:text-hustle-amber transition-colors">Help</Link>
            <Link
              href="/list-your-business"
              onClick={() => setMobileMenuOpen(false)}
              className="block bg-hustle-amber text-hustle-dark px-4 py-2 rounded-lg text-sm font-bold text-center mt-2"
            >
              List Your Business
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
