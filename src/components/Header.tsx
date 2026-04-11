"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

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
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const fetchedRef = useRef(false)
  const supabase = createClient()

  // Fetch cities
  useEffect(() => {
    if (cachedCities || fetchedRef.current) return
    fetchedRef.current = true

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

  // Auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setMobileMenuOpen(false)
  }

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
              List Your Business / Hustle
            </Link>

            {/* Auth buttons */}
            {!authLoading && (
              user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium hover:text-hustle-amber transition-colors">
                    <div className="w-8 h-8 rounded-full bg-hustle-amber/20 flex items-center justify-center text-hustle-amber font-bold text-xs">
                      {user.user_metadata?.owner_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',maxWidth:'16px',maxHeight:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full right-0 bg-white shadow-lg rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-hustle-dark truncate">{user.user_metadata?.owner_name || 'My Account'}</p>
                      <p className="text-xs text-hustle-muted truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-hustle-dark hover:bg-gray-50 text-sm">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium hover:text-hustle-amber transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-white text-hustle-blue px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </nav>
          {/* Mobile: auth buttons + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {!authLoading && !user && (
              <>
                <Link
                  href="/login"
                  className="text-xs font-medium text-white/90 hover:text-hustle-amber transition-colors px-2 py-1"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-hustle-blue px-3 py-1.5 rounded-md text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            {!authLoading && user && (
              <Link
                href="/dashboard"
                className="w-7 h-7 rounded-full bg-hustle-amber/20 flex items-center justify-center text-hustle-amber font-bold text-xs"
              >
                {user.user_metadata?.owner_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
              </Link>
            )}
            <button
              className="text-white"
              aria-label="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" width="24" height="24" style={{width:"24px",height:"24px",maxWidth:"24px",maxHeight:"24px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
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
              List Your Business / Hustle
            </Link>

            {/* Mobile auth */}
            <hr className="border-white/20" />
            {!authLoading && (
              user ? (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-hustle-amber">{user.user_metadata?.owner_name || 'My Account'}</p>
                    <p className="text-xs text-white/60">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2 py-1.5 text-sm hover:text-hustle-amber transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-2 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-white text-hustle-blue px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </header>
  )
}
