import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Browse Nigerian Cities | MyHustle',
  description:
    'Explore businesses across all Nigerian cities. Find trusted services in Lagos, Abuja, Port Harcourt, Ibadan, Kano, and more.',
  openGraph: {
    title: 'Browse Nigerian Cities | MyHustle',
    description:
      'Explore businesses across all Nigerian cities. Find trusted services in Lagos, Abuja, Port Harcourt, and more.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://myhustle.space/cities',
  },
}

interface CityWithCount {
  id: string
  slug: string
  name: string
  state: string
  business_count: number
}

async function getCitiesData() {
  const supabase = getSupabase()

  const { data: cities } = await supabase
    .from('cities')
    .select('id, slug, name, state')
    .order('name')

  // Get business counts
  const { data: allBusinesses } = await supabase
    .from('businesses')
    .select('id, city_id')
    .eq('active', true)

  const cityCountMap: Record<string, number> = {}
  if (allBusinesses) {
    for (const biz of allBusinesses) {
      if (biz.city_id) {
        cityCountMap[biz.city_id] = (cityCountMap[biz.city_id] || 0) + 1
      }
    }
  }

  const citiesWithCounts: CityWithCount[] = (cities || []).map((city) => ({
    ...city,
    business_count: cityCountMap[city.id] || 0,
  }))

  // Group by state
  const grouped: Record<string, CityWithCount[]> = {}
  for (const city of citiesWithCounts) {
    const state = city.state || 'Other'
    if (!grouped[state]) grouped[state] = []
    grouped[state].push(city)
  }

  // Sort states alphabetically
  const sortedStates = Object.keys(grouped).sort()

  return { grouped, sortedStates, totalCities: citiesWithCounts.length }
}

export default async function CitiesPage() {
  const { grouped, sortedStates, totalCities } = await getCitiesData()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://myhustle.space',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cities',
        item: 'https://myhustle.space/cities',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-hustle-light">
      <JsonLd data={breadcrumbJsonLd} />

      {/* Header */}
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Cities</span>
          </nav>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            Browse Nigerian Cities
          </h1>
          <p className="text-blue-200 mt-2 text-lg">
            {totalCities} cities across Nigeria — find businesses near you
          </p>
        </div>
      </section>

      {/* Cities grouped by state */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {sortedStates.map((state) => (
              <div key={state}>
                <h2 className="font-heading text-xl font-bold text-hustle-dark mb-4 border-b border-gray-200 pb-2">
                  {state}
                  <span className="text-sm font-normal text-hustle-muted ml-2">
                    ({grouped[state].length} {grouped[state].length === 1 ? 'city' : 'cities'})
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {grouped[state]
                    .sort((a, b) => (b.business_count || 0) - (a.business_count || 0))
                    .map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}`}
                        className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                      >
                        <h3 className="font-heading text-sm font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-xs text-hustle-muted mt-0.5">
                          {city.business_count} {city.business_count === 1 ? 'business' : 'businesses'}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-hustle-dark mb-3">
            Don&apos;t see your city?
          </h2>
          <p className="text-hustle-muted mb-6">
            We&apos;re expanding across Nigeria. List your business and we&apos;ll add your city.
          </p>
          <Link
            href="/list-your-business"
            className="inline-block bg-hustle-amber text-hustle-dark px-6 py-3 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
          >
            List Your Business
          </Link>
        </div>
      </section>
    </div>
  )
}
