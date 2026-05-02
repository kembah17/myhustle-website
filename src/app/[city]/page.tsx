import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'
import SuggestWhatsApp from '@/components/SuggestWhatsApp'
import { generateCityFAQs } from '@/lib/faq-generator'
import FAQSection from '@/components/FAQSection'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ city: string }>
}

interface BusinessRow {
  id: string
  slug: string
  name: string
  phone: string | null
  area_id: string | null
  category: { name: string } | null
  area: { id: string; slug: string; name: string } | null
}

interface AreaGroup {
  id: string
  slug: string
  name: string
  businesses: BusinessRow[]
  totalCount: number
}

const BUSINESSES_PER_AREA = 50

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const { data: city } = await getSupabase()
    .from('cities').select('name').eq('slug', citySlug).single()

  if (!city) return { title: 'City Not Found' }

  const title = `Businesses in ${city.name} | MyHustle`
  const description = `Browse businesses across all areas in ${city.name}. Find top-rated services on MyHustle.`

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

  const { data: city } = await getSupabase()
    .from('cities').select('*').eq('slug', citySlug).single()

  if (!city) notFound()

  // Fetch businesses with area and category info (only those with area assignments)
  const { data: businesses, count: totalBizCount } = await getSupabase()
    .from('businesses')
    .select('id, slug, name, phone, area_id, category:categories(name), area:areas(id, slug, name)', { count: 'exact' })
    .eq('city_id', city.id)
    .eq('active', true)
    .not('area_id', 'is', null)
    .order('name')
    .limit(1000)

  const bizList = (businesses || []) as unknown as BusinessRow[]

  // Group businesses by area
  const areaMap = new Map<string, AreaGroup>()

  for (const biz of bizList) {
    if (!biz.area || !biz.area_id) continue

    const areaId = biz.area_id

    if (!areaMap.has(areaId)) {
      areaMap.set(areaId, {
        id: biz.area.id,
        slug: biz.area.slug,
        name: biz.area.name,
        businesses: [],
        totalCount: 0,
      })
    }

    const group = areaMap.get(areaId)!
    group.totalCount++
    if (group.businesses.length < BUSINESSES_PER_AREA) {
      group.businesses.push(biz)
    }
  }

  // Sort areas alphabetically, filter out empty ones
  const areaGroups = Array.from(areaMap.values())
    .filter(g => g.totalCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  const totalBusinesses = totalBizCount ?? bizList.length
  const totalAreas = areaGroups.length

  const cityFaqs = generateCityFAQs({
    cityName: city.name,
    areaCount: totalAreas,
    businessCount: totalBusinesses,
    areaNames: areaGroups.slice(0, 8).map(a => a.name),
    topCategories: [],
  })

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
    itemListElement: areaGroups.map((a, i) => ({
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

      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: city.name }]} />
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-4">
            Businesses in <span className="text-hustle-amber">{city.name}</span>
          </h1>
          <p className="text-blue-200 text-lg mt-3">
            {totalBusinesses > 0
              ? totalAreas > 0
                ? `${totalBusinesses} ${totalBusinesses === 1 ? 'business' : 'businesses'} across ${totalAreas} ${totalAreas === 1 ? 'area' : 'areas'} in ${city.name}`
                : `${totalBusinesses} ${totalBusinesses === 1 ? 'business' : 'businesses'} in ${city.name}`
              : `We're building our directory in ${city.name}`
            }
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {areaGroups.length > 0 ? (
          <div className="space-y-12">
            {areaGroups.map((areaGroup) => (
              <section key={areaGroup.id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark">
                    <Link
                      href={`/${citySlug}/${areaGroup.slug}`}
                      className="hover:text-hustle-blue transition-colors"
                    >
                      {areaGroup.name}
                    </Link>
                    <span className="text-sm font-normal text-hustle-muted ml-2">
                      ({areaGroup.totalCount} {areaGroup.totalCount === 1 ? 'business' : 'businesses'})
                    </span>
                  </h2>
                  <Link
                    href={`/${citySlug}/${areaGroup.slug}`}
                    className="text-sm text-hustle-blue hover:text-hustle-amber font-medium transition-colors"
                  >
                    View all &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {areaGroup.businesses.map((biz) => (
                    <Link
                      key={biz.id}
                      href={`/business/${biz.slug}`}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber block"
                    >
                      <h3 className="font-semibold text-hustle-dark text-sm md:text-base truncate">
                        {biz.name}
                      </h3>
                      {biz.category?.name && (
                        <p className="text-xs text-hustle-blue mt-1">
                          {biz.category.name}
                        </p>
                      )}
                      {biz.phone && (
                        <p className="text-xs text-hustle-muted mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {biz.phone}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>

                {areaGroup.totalCount > BUSINESSES_PER_AREA && (
                  <div className="mt-3 text-center">
                    <Link
                      href={`/${citySlug}/${areaGroup.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-hustle-blue hover:text-hustle-amber font-medium transition-colors"
                    >
                      View all {areaGroup.totalCount} businesses in {areaGroup.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          /* No businesses yet */
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
              We{"'re"} actively adding businesses in {city.name}.
              Know a great business? Help us grow!
            </p>
          </div>
        )}

        <section className="mt-12 max-w-lg mx-auto">
          <SuggestWhatsApp type="area" context={city.name} />
        </section>

        <FAQSection faqs={cityFaqs} />
      </div>
    </div>
  )
}
