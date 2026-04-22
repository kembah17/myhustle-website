import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Find Businesses Near You | MyHustle',
  description:
    'Browse businesses by city and area across Nigeria. Find trusted services near you in Lagos, Abuja, Port Harcourt, and more.',
  openGraph: {
    title: 'Find Businesses Near You | MyHustle',
    description:
      'Browse businesses by city and area across Nigeria. Find trusted services near you.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Businesses Near You | MyHustle',
    description:
      'Browse businesses by city and area across Nigeria. Find trusted services near you.',
  },
  alternates: {
    canonical: 'https://myhustle.com/near-me',
  },
}

interface CityWithAreas {
  id: string
  slug: string
  name: string
  state: string
  business_count: number
  areas: {
    id: string
    slug: string
    name: string
    business_count: number
  }[]
}

export default async function NearMePage() {
  // Get all cities
  const { data: cities } = await getSupabase()
    .from('cities')
    .select('id, slug, name, state')
    .order('name')

  // Get all areas with city_id
  const { data: areas } = await getSupabase()
    .from('areas')
    .select('id, slug, name, city_id')
    .order('name')

  // Get business counts
  const { data: allBusinesses } = await getSupabase()
    .from('businesses')
    .select('id, city_id, area_id')
    .eq('active', true)

  // Build count maps
  const cityCountMap: Record<string, number> = {}
  const areaCountMap: Record<string, number> = {}
  for (const biz of allBusinesses || []) {
    if (biz.city_id) cityCountMap[biz.city_id] = (cityCountMap[biz.city_id] || 0) + 1
    if (biz.area_id) areaCountMap[biz.area_id] = (areaCountMap[biz.area_id] || 0) + 1
  }

  // Group areas by city
  const areasByCity: Record<string, typeof areas> = {}
  for (const area of areas || []) {
    if (!areasByCity[area.city_id]) areasByCity[area.city_id] = []
    areasByCity[area.city_id]!.push(area)
  }

  // Build city data with areas
  const citiesWithAreas: CityWithAreas[] = (cities || []).map(city => ({
    ...city,
    business_count: cityCountMap[city.id] || 0,
    areas: (areasByCity[city.id] || []).map(area => ({
      ...area,
      business_count: areaCountMap[area.id] || 0,
    })).sort((a, b) => b.business_count - a.business_count),
  })).sort((a, b) => b.business_count - a.business_count)

  const totalBusinesses = allBusinesses?.length || 0
  const totalAreas = areas?.length || 0

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myhustle.com' },
      { '@type': 'ListItem', position: 2, name: 'Near Me', item: 'https://myhustle.com/near-me' },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd} />

      <Breadcrumbs items={[{ label: 'Near Me' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-hustle-dark mb-3">
            Find Businesses Near You
          </h1>
          <p className="text-hustle-muted text-lg max-w-2xl mx-auto">
            Browse {totalBusinesses.toLocaleString()} businesses across{' '}
            {citiesWithAreas.length} cities and {totalAreas.toLocaleString()} areas in Nigeria
          </p>
        </div>

        {/* Cities with Areas */}
        <div className="space-y-8">
          {citiesWithAreas.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* City Header */}
              <Link
                href={`/${city.slug}`}
                className="block px-6 py-4 bg-hustle-blue hover:bg-hustle-blue/90 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-white">
                      {city.name}
                    </h2>
                    <p className="text-blue-200 text-sm">{city.state} State</p>
                  </div>
                  <div className="text-right">
                    <span className="text-hustle-amber font-bold text-lg">
                      {city.business_count}
                    </span>
                    <p className="text-blue-200 text-xs">
                      {city.business_count === 1 ? 'business' : 'businesses'}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Areas Grid */}
              {city.areas.length > 0 && (
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {city.areas.map((area) => (
                      <Link
                        key={area.id}
                        href={`/${city.slug}/${area.slug}`}
                        className="group px-3 py-2.5 rounded-lg border border-gray-100 hover:border-hustle-amber hover:bg-hustle-amber/5 transition-all text-center"
                      >
                        <span className="text-sm font-medium text-hustle-dark group-hover:text-hustle-blue transition-colors">
                          {area.name}
                        </span>
                        {area.business_count > 0 && (
                          <span className="block text-xs text-hustle-muted mt-0.5">
                            {area.business_count} {area.business_count === 1 ? 'biz' : 'businesses'}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {city.areas.length === 0 && (
                <div className="p-6 text-center text-hustle-muted text-sm">
                  Areas coming soon for {city.name}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-heading text-xl font-semibold text-hustle-dark mb-2">
            Don&apos;t see your area?
          </h2>
          <p className="text-hustle-muted mb-4">
            We&apos;re expanding across Nigeria. List your business and help us grow your area.
          </p>
          <a
            href="/list-your-business"
            className="inline-flex items-center gap-2 bg-hustle-amber text-hustle-dark px-6 py-3 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
          >
            List Your Business / Hustle
          </a>
        </div>
      </div>
    </div>
  )
}
