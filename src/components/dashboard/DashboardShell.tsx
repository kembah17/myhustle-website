'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { href: '/dashboard/bookings', label: 'Bookings', icon: '📅' },
  { href: '/dashboard/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/dashboard/edit', label: 'Edit Profile', icon: '✏️' },
  { href: '/dashboard/hours', label: 'Business Hours', icon: '🕒' },
  { href: '/dashboard/verification', label: 'Verification', icon: '🛡️' },
  { href: '/dashboard/admin', label: 'Admin', icon: '⚙️' },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [businessSlug, setBusinessSlug] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSlug() {
      if (!user) return
      const { data } = await supabase
        .from('businesses')
        .select('slug')
        .eq('user_id', user.id)
        .maybeSingle()
      if (data?.slug) setBusinessSlug(data.slug)
    }
    fetchSlug()
  }, [user, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hustle-light">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const sidebarContent = (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === item.href
              ? 'bg-hustle-blue text-white'
              : 'text-hustle-dark hover:bg-hustle-light'
          }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
      <hr className="my-2 border-gray-200" />
      {businessSlug && (
        <Link
          href={`/business/${businessSlug}`}
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-hustle-muted hover:bg-hustle-light transition-colors"
        >
          <span>👁️</span>
          View My Listing
        </Link>
      )}
      <Link
        href="/"
        onClick={() => setMobileMenuOpen(false)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-hustle-muted hover:bg-hustle-light transition-colors"
      >
        <span>🌐</span>
        View Public Site
      </Link>
      <button
        onClick={() => {
          setMobileMenuOpen(false)
          signOut()
        }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
      >
        <span>🚪</span>
        Logout
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-hustle-light">
      {/* Top bar */}
      <header className="bg-hustle-blue text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white"
              >
                <svg className="w-6 h-6" width="24" height="24" style={{width:"24px",height:"24px",maxWidth:"24px",maxHeight:"24px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="flex items-center">
                <span className="font-heading text-2xl font-bold">
                  My<span className="text-hustle-amber">Hustle</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/70 hidden sm:block">{user?.email}</span>
              <button
                onClick={signOut}
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="bg-white rounded-xl border border-gray-200 p-3 space-y-1 sticky top-24">
              {sidebarContent}
            </nav>
          </aside>

          {/* Mobile sidebar overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
              <div className="fixed left-0 top-0 bottom-0 w-64 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading text-xl font-bold text-hustle-dark">
                    My<span className="text-hustle-amber">Hustle</span>
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-hustle-muted">
                    ✕
                  </button>
                </div>
                <nav className="space-y-1">
                  {sidebarContent}
                </nav>
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
