import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Available in Nigeria Only — MyHustle',
  description:
    'MyHustle.com is currently available in Nigeria only. We are expanding soon!',
  robots: { index: false, follow: false },
}

export default function NigeriaOnlyPage() {
  return (
    <main className="min-h-screen bg-hustle-light flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo-dark.svg"
            alt="MyHustle"
            width={180}
            height={48}
            priority
          />
        </div>

        {/* Flag & Heading */}
        <div className="space-y-4">
          <span className="text-6xl" role="img" aria-label="Nigerian flag">
            🇳🇬
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-hustle-dark">
            MyHustle is Currently Available in Nigeria Only
          </h1>
          <p className="font-body text-lg text-hustle-muted leading-relaxed">
            We're building Nigeria's most trusted business directory.
            We're expanding to other countries soon!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-hustle-blue px-8 py-3 font-heading font-semibold text-white transition-colors hover:bg-hustle-blue/90 focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Browse Businesses
          </Link>

          <div className="pt-2">
            <a
              href="mailto:hello@myhustle.com?subject=Notify%20me%20when%20MyHustle%20expands&body=Hi%20MyHustle%20team%2C%0A%0APlease%20notify%20me%20when%20MyHustle%20becomes%20available%20in%20my%20country.%0A%0ACountry%3A%20%0A%0AThanks!"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-hustle-amber px-8 py-3 font-heading font-semibold text-hustle-amber transition-colors hover:bg-hustle-amber hover:text-white focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Notify Me When We Expand
            </a>
          </div>
        </div>

        {/* VPN Note */}
        <div className="rounded-lg bg-hustle-blue/5 border border-hustle-blue/10 p-4">
          <p className="font-body text-sm text-hustle-muted">
            🔒 If you're in Nigeria and seeing this page, please try
            disabling your VPN or proxy service.
          </p>
        </div>
      </div>
    </main>
  )
}
