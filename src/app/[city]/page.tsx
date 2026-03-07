import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'
import SuggestWhatsApp from '@/components/SuggestWhatsApp'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ city: string }>
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const { data: city } = await getSupabase()
    .from('cities').select('name').eq('slug', citySlug).single()

  if (!city) return { title: 'City Not Found' }

  const title = `All Areas in ${city.name} | MyHustle`
  const description = `Browse businesses across all areas in ${city.name}. Find top-rated services on MyHustle.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.com/${citySlug}`,
    },
  }
}


export default async function CityPage({ params }: PageProps) {
  const { city: citySlug } = await params

  const { data: city } = await getSupabase()
    .from('cities').select('*').eq('slug', citySlug).single()

  if (!city) notFound()

  const { data: areas } = await getSupabase()
    .from('areas').select('id, slug, name, description')
    .eq('city_id', city.id)
    .order('name')

  const { data: businesses } = await getSupabase()
    .from('businesses').select('id, area_id')
    .eq('city_id', city.id)
    .eq('active', true)

  const countMap: Record<string, number> = {}
  for (const biz of businesses || []) {
    if (biz.area_id) countMap[biz.area_id] = (countMap[biz.area_id] || 0) + 1
  }

  const allAreasWithCounts = (areas || []).map(a => ({
    ...a,
    business_count: countMap[a.id] || 0,
  }))

  // Only show areas that have at least 1 business
  const areasWithBusinesses = allAreasWithCounts.filter(a => a.business_count > 0)
  const totalAreas = allAreasWithCounts.length

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myhustle.com' },
      { '@type': 'ListItem', position: 2, name: city.name, item: `https://myhustle.com/${citySlug}` },
    ],
  }

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Areas in ${city.name}`,
    numberOfItems: areasWithBusinesses.length,
    itemListElement: areasWithBusinesses.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Place',
        name: `${a.name}, ${city.name}`,
        url: `https://myhustle.com/${citySlug}/${a.slug}`,
      },
    })),
  }

  return (
    <div>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={itemListLd} />

      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: city.name }]} />
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-4">
            All Areas in <span className="text-hustle-amber">{city.name}</span>
          </h1>
          <p className="text-blue-200 text-lg mt-3">
            {areasWithBusinesses.length > 0
              ? `Browse businesses across ${areasWithBusinesses.length} areas in ${city.name}`
              : `We're building our directory in ${city.name}`
            }
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {areasWithBusinesses.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {areasWithBusinesses.map((area) => (
                <Link
                  key={area.id}
                  href={`/${citySlug}/${area.slug}`}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                >
                  <h2 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                    {area.name}
                  </h2>
                  <p className="text-sm text-hustle-muted mt-1">
                    {area.business_count} {area.business_count === 1 ? 'business' : 'businesses'}
                  </p>
                </Link>
              ))}
            </div>

            {/* Note about more areas coming */}
            <div className="mt-10 text-center">
              <p className="text-hustle-muted text-sm">
                Showing {areasWithBusinesses.length} of {totalAreas} areas in {city.name}.{' '}
                More areas coming soon!
              </p>
            </div>
          </>
        ) : (
          /* All areas have 0 businesses */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-hustle-amber/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-hustle-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-hustle-dark mb-3">
              We{"'re"} building our directory in {city.name}
            </h2>
            <p className="text-hustle-muted max-w-md mx-auto mb-8">
              We{"'re"} actively adding businesses across {totalAreas} areas in {city.name}.
              Know a great business? Help us grow!
            </p>
          </div>
        )}

        <section className="mt-12 max-w-lg mx-auto">
          <SuggestWhatsApp type="area" context={city.name} />
        </section>
      </div>
    </div>
  )
}
