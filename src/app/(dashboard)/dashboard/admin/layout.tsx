"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'

const adminNav = [
  { href: '/dashboard/admin', label: 'Overview', icon: '📊' },
  { href: '/dashboard/admin/businesses', label: 'Businesses', icon: '🏢' },
  { href: '/dashboard/admin/claims', label: 'Claims', icon: '📋' },
  { href: '/dashboard/admin/flags', label: 'Flags', icon: '🚩' },
  { href: '/dashboard/admin/users', label: 'Users', icon: '👥' },
  { href: '/dashboard/admin/suggestions', label: 'Suggestions', icon: '💡' },
  { href: '/dashboard/admin/states', label: 'States', icon: '🗺️' },
  { href: '/dashboard/admin/cities', label: 'Cities', icon: '🏙️' },
  { href: '/dashboard/admin/areas', label: 'Areas', icon: '📍' },
  { href: '/dashboard/admin/landmarks', label: 'Landmarks', icon: '🏛️' },
  { href: '/dashboard/admin/categories', label: 'Categories', icon: '📂' },
  { href: '/dashboard/admin/import', label: 'Bulk Import', icon: '📦' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-hustle-dark">Admin Panel</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-hustle-blue text-white'
                  : 'bg-white text-hustle-dark border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </DashboardShell>
  )
}
