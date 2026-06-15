import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'
import SuggestWhatsApp from '@/components/SuggestWhatsApp'
import { getCityIntro } from '@/lib/city-intros'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ city: string }>
}

interface AreaWithCount {
  id: string
  name: string
  slug: string
  area_type: string | null
  business_count: number
}

async function getCityData(citySlug: string) {
  const supabase = getSupabase()

  const { data: city } = await supabase
    .from('cities').select('*').eq('slug', citySlug).single()

  if (!city) return null

  const { data: areas } = await supabase
    .from('areas')
    .select('id, name, slug, area_type')
    .eq('city_id', city.id)
    .order('name')

  // Exact total count - no limit
  const { count: totalBusinessCount } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('city_id', city.id)

  // Area-level counts via RPC
  const { data: areaCounts } = await supabase
    .rpc('get_area_business_counts', { target_city_id: city.id })

  const countMap = new Map<string, number>()
  for (const row of (areaCounts || [])) {
    countMap.set(row.area_id, Number(row.count))
  }

  const areasWithCounts: AreaWithCount[] = (areas || [])
    .map(a => ({
      ...a,
      business_count: countMap.get(a.id) || 0,
    }))
    .filter(a => a.business_count > 0)
    .sort((a, b) => b.business_count - a.business_count)

  return {
    city,
    areas: areasWithCounts,
    totalBusinesses: totalBusinessCount || 0,
    totalAreas: areasWithCounts.length,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const data = await getCityData(citySlug)

  if (!data) return { title: 'City Not Found' }

  const { city, totalBusinesses, totalAreas, areas } = data
  const topAreas = areas.slice(0, 2).map(a => a.name)
  const areaText = topAreas.length === 2
    ? `from ${topAreas[0]} to ${topAreas[1]}`
    : topAreas.length === 1
    ? `including ${topAreas[0]}`
    : ''

  const title = `${totalBusinesses.toLocaleString()} Businesses in ${city.name} | MyHustle Directory`
  const description = totalBusinesses > 0
    ? `Find ${totalBusinesses.toLocaleString()} businesses in ${city.name} across ${totalAreas} areas ${areaText}. Salons, mechanics, restaurants and more. Search free on MyHustle.`
    : `Discover businesses in ${city.name}, Nigeria. Browse local services, shops, and professionals on MyHustle.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.space/${citySlug}`,
    },
  }
}


export default async function CityPage({ params }: PageProps) {
  const { city: citySlug } = await params
  const data = await getCityData(citySlug)

  if (!data) notFound()

  const { city, areas, totalBusinesses, totalAreas } = data
  const cityIntro = city.seo_description || getCityIntro(city.name)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myhustle.space' },
      { '@type': 'ListItem', position: 2, name: city.name, item: `https://myhustle.space/${citySlug}` },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Businesses in ${city.name}`,
    numberOfItems: totalBusinesses,
    itemListElement: areas.slice(0, 20).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Place',
        name: `${a.name}, ${city.name}`,
        url: `https://myhustle.space/${citySlug}/${a.slug}`,
      },
    })),
  }

  return (
    <div>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={itemListLd} />

      {/* Hero Section */}
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: city.name }]} />
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-4">
            Businesses in <span className="text-hustle-amber">{city.name}</span>
          </h1>
          <p className="text-blue-200 text-lg mt-3">
            {totalBusinesses > 0
              ? `${totalBusinesses.toLocaleString()} businesses across ${totalAreas} areas in ${city.name}`
              : `We\u2019re building our directory in ${city.name}`
            }
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* City Introduction - unique SEO content */}
        <section className="mb-10">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-3">
              About Business in {city.name}
            </h2>
            <p className="text-hustle-muted leading-relaxed">
              {cityIntro}
            </p>

            {/* Key Stats */}
            {totalBusinesses > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-hustle-blue/5 rounded-lg p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-hustle-blue">
                    {totalBusinesses.toLocaleString()}
                  </p>
                  <p className="text-sm text-hustle-muted mt-1">Businesses Listed</p>
                </div>
                <div className="bg-hustle-amber/5 rounded-lg p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-hustle-amber">
                    {totalAreas}
                  </p>
                  <p className="text-sm text-hustle-muted mt-1">Areas Covered</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center col-span-2 md:col-span-1">
                  <p className="text-2xl md:text-3xl font-bold text-green-600">
                    Free
                  </p>
                  <p className="text-sm text-hustle-muted mt-1">To List & Search</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Area Cards Grid */}
        {areas.length > 0 ? (
          <section>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-6">
              Browse by Area in {city.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/${citySlug}/${area.slug}`}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber block group"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-hustle-dark text-base md:text-lg group-hover:text-hustle-blue transition-colors">
                      {area.name}
                    </h3>
                    <span className="bg-hustle-blue/10 text-hustle-blue text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {area.business_count.toLocaleString()}
                    </span>
                  </div>

                  {area.area_type && (
                    <p className="text-xs text-hustle-muted mt-2 capitalize">
                      {area.area_type} area
                    </p>
                  )}

                  <p className="text-xs text-hustle-blue mt-3 group-hover:text-hustle-amber transition-colors">
                    View all businesses &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-hustle-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-hustle-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-hustle-dark mb-3">
              We&apos;re building our directory in {city.name}
            </h2>
            <p className="text-hustle-muted max-w-md mx-auto mb-8">
              We&apos;re actively adding businesses in {city.name}.
              Know a great business? Help us grow!
            </p>
          </div>
        )}

        {/* City Business Ecosystem */}
        {areas.length > 0 && (
          <section className="mt-12 mb-8">
            <div className="bg-gradient-to-r from-hustle-blue/5 to-hustle-amber/5 rounded-xl p-6 md:p-8 border border-gray-100">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-4">
                The Business Landscape of {city.name}
              </h2>
              <div className="text-hustle-muted leading-relaxed space-y-3">
                <p>
                  MyHustle has mapped <strong>{totalBusinesses.toLocaleString()} businesses</strong> across <strong>{totalAreas} areas</strong> in {city.name} so far.
                  {city.state ? ` As the ${city.name === city.state ? 'capital' : 'a major city in ' + city.state + ' State'}, ` : ' '}
                  the local business community continues to grow as more entrepreneurs and service providers join the directory.
                </p>
                <p>
                  {(() => {
                    const topAreas = areas.slice(0, 5)
                    if (topAreas.length === 0) return null
                    const areaPhrases = topAreas.map(a => `${a.name} (${a.business_count.toLocaleString()} businesses)`)
                    return `The most commercially active areas discovered to date include ${areaPhrases.join(', ')}. These figures reflect businesses currently listed on MyHustle and update automatically as new listings are added and verified.`
                  })()}
                </p>
                <p>
                  Every business listing on MyHustle includes contact details, location information, and customer reviews where available.
                  As business owners in {city.name} claim their profiles and add descriptions, photos, and service details,
                  each listing becomes a more complete and useful resource for customers searching for local services.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Discovery Stats */}
        {totalBusinesses > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-4">
              {city.name} Directory at a Glance
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-hustle-muted leading-relaxed">
                The MyHustle directory for {city.name} currently covers {totalAreas} distinct areas,
                with {totalBusinesses.toLocaleString()} business listings found so far.
                {areas.length > 10
                  ? ` From established commercial districts to emerging neighbourhoods, the directory captures the full breadth of ${city.name}'s business activity. `
                  : ` The directory is actively expanding to cover more of ${city.name}'s business landscape. `
                }
                Listings are free for all businesses, and the directory is updated regularly as new businesses register
                and existing profiles are enriched with reviews, photos, and verified contact information.
                {areas.filter(a => a.business_count >= 50).length > 0
                  ? ` ${areas.filter(a => a.business_count >= 50).length} areas already have 50 or more listed businesses, indicating strong commercial activity in those neighbourhoods.`
                  : ''
                }
              </p>
            </div>
          </section>
        )}

        <section className="mt-12 max-w-lg mx-auto">
          <SuggestWhatsApp type="area" context={city.name} />
        </section>
      </div>
    </div>
  )
}
