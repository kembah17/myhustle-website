import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'
import PaginatedNearMe from '@/components/PaginatedNearMe'

export const revalidate = 86400

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
    canonical: 'https://myhustle.space/near-me',
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

  // Get counts via RPC (no .eq('active', true) needed)
  const { data: cityCounts } = await getSupabase().rpc('get_city_business_counts')
  const { data: areaCounts } = await getSupabase().rpc('get_area_business_counts')

  // Build count maps
  const cityCountMap: Record<string, number> = {}
  for (const row of cityCounts || []) {
    cityCountMap[row.city_id] = Number(row.count)
  }

  const areaCountMap: Record<string, number> = {}
  for (const row of areaCounts || []) {
    areaCountMap[row.area_id] = Number(row.count)
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

  const totalBusinesses = (cityCounts || []).reduce((sum: number, r: any) => sum + Number(r.count), 0)
  const totalAreas = areas?.length || 0

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myhustle.space' },
      { '@type': 'ListItem', position: 2, name: 'Near Me', item: 'https://myhustle.space/near-me' },
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

        {/* Cities with Areas - paginated */}
        <PaginatedNearMe
          cities={citiesWithAreas}
          initialCityCount={10}
          initialAreaCount={8}
        />

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-heading text-xl font-semibold text-hustle-dark mb-2">
            Don't see your area?
          </h2>
          <p className="text-hustle-muted mb-4">
            We're expanding across Nigeria. List your business and help us grow your area.
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
