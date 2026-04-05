import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { template: '%s | MyHustle Legal', default: 'Legal | MyHustle' },
  description: 'Legal information, policies, and terms for MyHustle.com — Nigeria\'s trusted business directory.',
}

const LEGAL_PAGES = [
  { href: '/legal/privacy-policy', label: 'Privacy Policy' },
  { href: '/legal/terms-of-service', label: 'Terms of Service' },
  { href: '/legal/cookie-policy', label: 'Cookie Policy' },
  { href: '/legal/disclaimer', label: 'Disclaimer' },
  { href: '/legal/acceptable-use', label: 'Acceptable Use Policy' },
]

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Mobile navigation - horizontal scroll */}
          <nav className="lg:hidden mb-8 -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {LEGAL_PAGES.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="whitespace-nowrap text-sm font-medium text-hustle-muted hover:text-hustle-blue bg-hustle-light hover:bg-hustle-blue/5 px-3 py-2 rounded-lg transition-colors"
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Desktop sidebar navigation */}
          <aside className="hidden lg:block">
            <nav className="sticky top-8">
              <h2 className="font-heading text-sm font-semibold text-hustle-dark uppercase tracking-wider mb-4">
                Legal
              </h2>
              <ul className="space-y-1">
                {LEGAL_PAGES.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="block text-sm text-hustle-muted hover:text-hustle-blue hover:bg-hustle-light px-3 py-2 rounded-lg transition-colors"
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="max-w-4xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
