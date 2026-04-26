import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us — MyHustle',
  description:
    "Learn about MyHustle.com — Nigeria's trusted business directory connecting 41.5 million MSMEs with customers who need them.",
  openGraph: {
    title: 'About Us — MyHustle',
    description: "Connecting Nigeria's businesses and hustles with customers who need them.",
    url: 'https://myhustle.com/about',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-hustle-blue text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            About MyHustle
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Connecting Nigeria&apos;s businesses and hustles with customers who need them.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-hustle-dark mb-4">Our Mission</h2>
            <div className="w-16 h-1 bg-hustle-amber mx-auto rounded-full" />
          </div>
          <p className="text-lg text-hustle-muted leading-relaxed text-center max-w-3xl mx-auto">
            MyHustle exists to make every Nigerian business discoverable online. From the tailor in
            Surulere to the mechanic in Wuse, from the caterer in Lekki to the hairdresser in
            Enugu — we believe every hustle deserves to be found.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 bg-hustle-light">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-hustle-dark mb-4">Our Story</h2>
            <div className="w-16 h-1 bg-hustle-amber mx-auto rounded-full" />
          </div>
          <div className="space-y-6 text-hustle-muted leading-relaxed text-lg">
            <p>
              Nigeria is home to over <strong className="text-hustle-dark">41.5 million micro, small, and medium
              enterprises (MSMEs)</strong> — the backbone of our economy. Yet more than 80% of these
              businesses operate without any online presence. When customers search for services
              near them, millions of hardworking business owners remain invisible.
            </p>
            <p>
              MyHustle was founded to change that. We&apos;re building the most comprehensive directory
              of Nigerian businesses — a platform where every entrepreneur, artisan, and service
              provider can be discovered by the customers who need them most.
            </p>
            <p>
              We understand that for most Nigerian businesses, a full website or social media
              strategy isn&apos;t practical. That&apos;s why MyHustle gives every business a professional
              online presence in minutes — no technical skills required, no cost to get started.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-hustle-dark mb-4">The Problem We Solve</h2>
            <div className="w-16 h-1 bg-hustle-amber mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-hustle-light rounded-xl p-6">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">For Customers</h3>
              <p className="text-hustle-muted">
                Finding trusted local businesses in Nigeria is frustrating. Search results are
                dominated by outdated listings, dead phone numbers, and businesses that no longer
                exist. MyHustle provides verified, up-to-date business information you can rely on.
              </p>
            </div>
            <div className="bg-hustle-light rounded-xl p-6">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">For Businesses</h3>
              <p className="text-hustle-muted">
                Most Nigerian SMEs can&apos;t afford websites or digital marketing. MyHustle gives
                every business a professional listing page, customer reviews, booking capabilities,
                and visibility in local search — all from a simple phone verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-20 bg-hustle-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold text-hustle-dark mb-4">Our Vision</h2>
            <div className="w-16 h-1 bg-hustle-amber mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-hustle-blue mb-2">100K+</div>
              <p className="text-hustle-muted">Business listings across Nigeria</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-hustle-blue mb-2">774</div>
              <p className="text-hustle-muted">LGAs covered nationwide</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-hustle-blue mb-2">36 + 1</div>
              <p className="text-hustle-muted">States plus FCT represented</p>
            </div>
          </div>
          <p className="text-lg text-hustle-muted mt-10 max-w-2xl mx-auto">
            Our goal is to have a verified listing for every business in every local government
            area in Nigeria — making the informal economy visible and accessible to all.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-hustle-dark mb-4">Our Values</h2>
            <div className="w-16 h-1 bg-hustle-amber mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-hustle-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-hustle-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">Accessibility</h3>
              <p className="text-hustle-muted text-sm">
                Every business deserves an online presence, regardless of size, budget, or
                technical ability. We keep it simple and free to start.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-hustle-amber/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-hustle-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">Authenticity</h3>
              <p className="text-hustle-muted text-sm">
                Real businesses, verified listings, genuine reviews. We fight fake listings
                and ensure customers can trust what they find on MyHustle.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-hustle-sunset/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-hustle-sunset" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">Community</h3>
              <p className="text-hustle-muted text-sm">
                We&apos;re building more than a directory — we&apos;re building a community where
                businesses support each other and customers find exactly what they need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-hustle-light">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-hustle-dark mb-4">How It Works</h2>
            <div className="w-16 h-1 bg-hustle-amber mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-hustle-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">List</h3>
              <p className="text-hustle-muted text-sm">
                Add your business in minutes. Just your name, category, location, and phone
                number. Verify with a quick phone call and you&apos;re live.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-hustle-amber text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">Get Found</h3>
              <p className="text-hustle-muted text-sm">
                Your business appears in search results, category pages, and location listings.
                Customers find you when they search for services you offer.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-hustle-sunset text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">Grow</h3>
              <p className="text-hustle-muted text-sm">
                Receive bookings, collect reviews, and build your reputation. Upgrade for
                premium features like priority placement and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-hustle-blue text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Get Your Hustle Online?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerian businesses already growing with MyHustle.
            It&apos;s free to list and takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/list-your-business"
              className="inline-flex items-center justify-center px-8 py-3 bg-hustle-amber text-hustle-dark font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              List Your Business — Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
