import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal Information | MyHustle',
  description: 'Legal policies and terms for MyHustle.com — Privacy Policy, Terms of Service, Cookie Policy, Disclaimer, and Acceptable Use Policy.',
}

const LEGAL_PAGES = [
  {
    href: '/legal/privacy-policy',
    label: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal data in compliance with Nigeria\u2019s NDPR/NDPA.',
  },
  {
    href: '/legal/terms-of-service',
    label: 'Terms of Service',
    description: 'The rules and conditions governing your use of the MyHustle platform.',
  },
  {
    href: '/legal/cookie-policy',
    label: 'Cookie Policy',
    description: 'How we use cookies and similar technologies on MyHustle.com.',
  },
  {
    href: '/legal/disclaimer',
    label: 'Disclaimer',
    description: 'Important disclaimers about listing accuracy, business quality, and platform limitations.',
  },
  {
    href: '/legal/acceptable-use',
    label: 'Acceptable Use Policy',
    description: 'What is and isn\u2019t allowed on the MyHustle platform.',
  },
]

export default function LegalIndexPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-hustle-dark mb-2">
        Legal Information
      </h1>
      <p className="text-hustle-muted leading-relaxed mb-8">
        Review our policies and terms that govern the use of MyHustle.com.
      </p>

      <div className="space-y-4">
        {LEGAL_PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="block border border-gray-200 rounded-xl p-5 hover:border-hustle-blue/30 hover:bg-hustle-light transition-colors group"
          >
            <h2 className="font-heading text-lg font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
              {page.label}
            </h2>
            <p className="text-sm text-hustle-muted mt-1">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
