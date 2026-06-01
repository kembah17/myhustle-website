import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Registration Available in Nigeria Only — MyHustle',
  description:
    'MyHustle business registration is currently available in Nigeria only. You can still browse all 73,000+ businesses from anywhere in the world!',
  robots: { index: false, follow: false },
}

export default function NigeriaOnlyPage() {
  return (
    <main className="min-h-screen bg-hustle-light flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
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
            Registration is Available in Nigeria Only
          </h1>
          <p className="font-body text-lg text-hustle-muted leading-relaxed">
            MyHustle is Nigeria&apos;s trusted business directory — built by Nigerians, for Nigerian businesses.
            Account registration and business listing are currently limited to users within Nigeria.
          </p>
        </div>

        {/* What You CAN Do */}
        <div className="rounded-xl bg-white border border-green-200 p-6 text-left space-y-4">
          <h2 className="font-heading text-xl font-bold text-green-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            What You Can Still Do From Anywhere
          </h2>
          <ul className="space-y-3 font-body text-hustle-dark">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Browse all 73,000+ businesses</strong> across 39 Nigerian cities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Search and discover</strong> businesses by category, city, or area</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>View business details</strong> including contact info, services, and reviews</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Contact businesses directly</strong> via phone or WhatsApp</span>
            </li>
          </ul>
        </div>

        {/* Why Restricted */}
        <div className="rounded-xl bg-hustle-blue/5 border border-hustle-blue/10 p-6 text-left space-y-3">
          <h2 className="font-heading text-lg font-bold text-hustle-dark flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hustle-blue" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Why is registration restricted?
          </h2>
          <p className="font-body text-hustle-muted leading-relaxed">
            To maintain the quality and authenticity of our directory, we verify that listed businesses
            operate in Nigeria. This ensures every listing is genuine and useful for people searching
            for Nigerian businesses and services.
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
              <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            Browse All Businesses
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-hustle-blue/20 px-6 py-2.5 font-heading font-semibold text-hustle-blue transition-colors hover:bg-hustle-blue/5 focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:ring-offset-2"
            >
              Explore Categories
            </Link>
            <Link
              href="/cities"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-hustle-blue/20 px-6 py-2.5 font-heading font-semibold text-hustle-blue transition-colors hover:bg-hustle-blue/5 focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:ring-offset-2"
            >
              Browse by City
            </Link>
          </div>
        </div>

        {/* Diaspora & Expansion Note */}
        <div className="rounded-xl bg-hustle-amber/5 border border-hustle-amber/20 p-5 space-y-3">
          <p className="font-heading font-semibold text-hustle-dark">
            🌍 Nigerian in the Diaspora?
          </p>
          <p className="font-body text-sm text-hustle-muted leading-relaxed">
            We&apos;re working on solutions for Nigerian business owners abroad.
            Want to list your Nigeria-based business? Reach out to us directly:
          </p>
          <a
            href="https://wa.me/2349131300136?text=Hi%20MyHustle%20team%2C%20I%27m%20a%20Nigerian%20business%20owner%20based%20abroad%20and%20I%27d%20like%20to%20list%20my%20business."
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-heading font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat With Us on WhatsApp
          </a>
        </div>

        {/* VPN Note */}
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <p className="font-body text-sm text-hustle-muted">
            🔒 <strong>In Nigeria but seeing this page?</strong> You may have a VPN or proxy enabled
            that makes it appear you&apos;re browsing from another country. Try disabling it and refreshing.
          </p>
        </div>
      </div>
    </main>
  )
}
