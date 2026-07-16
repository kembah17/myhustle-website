import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import JsonLd from '@/components/JsonLd'
import SpeakableJsonLd from '@/components/SpeakableJsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import type { Metadata } from 'next'
import type { Area, Business, Category, Review, Landmark } from '@/lib/types'
import SuggestWhatsApp from '@/components/SuggestWhatsApp'
import DataFreshness from '@/components/DataFreshness'
import { WHATSAPP_URL } from '@/components/WhatsAppCTA'

export const revalidate = 86400


interface PageProps {
  params: Promise<{ city: string; area: string }>
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, area: areaSlug } = await params
  const { data: city } = await getSupabase()
    .from('cities').select('name').eq('slug', citySlug).single()
  const { data: area } = await getSupabase()
    .from('areas').select('name').eq('slug', areaSlug).single()

  if (!city || !area) return { title: 'Not Found' }

  const title = `Best Businesses in ${area.name}, ${city.name} | MyHustle`
  const description = `Discover businesses in ${area.name}, ${city.name}. Browse local services, read reviews, and book appointments on MyHustle.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.space/${citySlug}/${areaSlug}`,
    },
  }
}


export default async function AreaPage({ params }: PageProps) {
  const { city: citySlug, area: areaSlug } = await params

  // Fetch city
  const { data: city } = await getSupabase()
    .from('cities').select('*').eq('slug', citySlug).single()
  if (!city) notFound()

  // Fetch area under this city
  const { data: area } = await getSupabase()
    .from('areas').select('*').eq('slug', areaSlug).eq('city_id', city.id).single()

  if (!area) {
    // Area not found under this city - check if it exists under a different city
    // This handles misrouted URLs (e.g., /lagos/gra-phase-1 when area belongs to port-harcourt)
    const { data: areaElsewhere } = await getSupabase()
      .from('areas')
      .select('slug, city:cities!inner(slug)')
      .eq('slug', areaSlug)
      .limit(1)
      .single()

    if (areaElsewhere && (areaElsewhere.city as any)?.slug) {
      const correctCitySlug = (areaElsewhere.city as any).slug
      redirect(`/${correctCitySlug}/${areaSlug}`)
    }

    notFound()
  }

  // Lightweight query: fetch only fields needed for counts (category_id, verified)
  const { data: allBizMeta } = await getSupabase()
    .from('businesses')
    .select('category_id, verified')
    .eq('area_id', area.id)
    .eq('active', true)

  const bizMeta = allBizMeta || []
  const totalCount = bizMeta.length
  const verifiedCount = bizMeta.filter(b => b.verified).length

  // Display query: fetch full data for first 20 businesses only
  const { data: businesses } = await getSupabase()
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('area_id', area.id)
    .eq('active', true)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  // Get categories with counts for this area (using lightweight meta data)
  const { data: allCategories } = await getSupabase()
    .from('categories')
    .select('id, slug, name, icon, parent_id')
    .is('parent_id', null)
    .order('name')

  const catCountMap: Record<string, number> = {}
  const { data: allCats } = await getSupabase().from('categories').select('id, parent_id')
  const childToParent: Record<string, string> = {}
  if (allCats) {
    for (const c of allCats) {
      if (c.parent_id) childToParent[c.id] = c.parent_id
    }
  }
  for (const biz of bizMeta) {
    const cid = biz.category_id
    catCountMap[cid] = (catCountMap[cid] || 0) + 1
    if (childToParent[cid]) {
      catCountMap[childToParent[cid]] = (catCountMap[childToParent[cid]] || 0) + 1
    }
  }

  const categoriesWithCounts = (allCategories || []).map(cat => ({
    ...cat,
    business_count: catCountMap[cat.id] || 0,
  }))

  // Fetch landmarks in this area
  const { data: landmarks } = await getSupabase()
    .from('landmarks')
    .select('slug, name, type')
    .eq('area_id', area.id)
    .order('name')

  // Fetch nearby businesses from other areas in the same city (for empty state)
  let nearbyBusinesses: (Business & { category: Category; area: Area; reviews: Review[] })[] = []
  if (totalCount === 0) {
    const { data: nearby } = await getSupabase()
      .from('businesses')
      .select('*, category:categories(*), area:areas(*), reviews(*)')
      .eq('city_id', city.id)
      .neq('area_id', area.id)
      .eq('active', true)
      .order('verified', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6)

    nearbyBusinesses = (nearby || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]
  }

  // Fetch nearby areas with business counts for the normal state
  let nearbyAreas: { id: string; name: string; slug: string; seo_description: string | null; business_count: number }[] = []
  if (totalCount > 0) {
    // Try RPC for area business counts
    const { data: cityAreaCounts } = await getSupabase()
      .rpc('get_area_business_counts', { target_city_id: city.id })

    const { data: nearbyAreasRaw } = await getSupabase()
      .from('areas')
      .select('id, name, slug, seo_description')
      .eq('city_id', city.id)
      .neq('id', area.id)
      .order('name')

    if (cityAreaCounts && nearbyAreasRaw) {
      const areaCountMap = new Map((cityAreaCounts as any[]).map((r: any) => [r.area_id, Number(r.count)]))
      nearbyAreas = nearbyAreasRaw
        .map((a: any) => ({ ...a, business_count: areaCountMap.get(a.id) || 0 }))
        .filter((a: any) => a.business_count > 0)
        .sort((a: any, b: any) => b.business_count - a.business_count)
        .slice(0, 6)
    } else if (nearbyAreasRaw) {
      // Fallback: count businesses per area from bizList city
      const { data: cityBiz } = await getSupabase()
        .from('businesses')
        .select('area_id')
        .eq('city_id', city.id)
        .eq('active', true)

      const fallbackCounts: Record<string, number> = {}
      if (cityBiz) {
        for (const b of cityBiz) {
          if (b.area_id) fallbackCounts[b.area_id] = (fallbackCounts[b.area_id] || 0) + 1
        }
      }
      nearbyAreas = nearbyAreasRaw
        .map((a: any) => ({ ...a, business_count: fallbackCounts[a.id] || 0 }))
        .filter((a: any) => a.business_count > 0)
        .sort((a: any, b: any) => b.business_count - a.business_count)
        .slice(0, 6)
    }
  }

  const isEmpty = totalCount === 0

  // Schema.org ItemList - cap to first 20 businesses (already limited by query)
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Businesses in ${area.name}, ${city.name}`,
    description: `Top-rated businesses in ${area.name}, ${city.name}`,
    numberOfItems: totalCount,
    itemListElement: bizList.slice(0, 20).map((biz, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: biz.name,
        url: `https://myhustle.space/business/${biz.slug}`,
        ...(biz.address ? { address: biz.address } : {}),
        ...(biz.phone ? { telephone: biz.phone } : {}),
      },
    })),
  }

  const areaPlaceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${area.name}, ${city.name}`,
    url: `https://myhustle.space/${citySlug}/${areaSlug}`,
    description: area.seo_description || `Businesses in ${area.name}, ${city.name}`,
    containedInPlace: {
      '@type': 'City',
      name: city.name,
      url: `https://myhustle.space/${citySlug}`,
    },
    ...(area.lat && area.lon ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: area.lat,
        longitude: area.lon,
      },
    } : {}),
  }

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Businesses in ${area.name}, ${city.name} - MyHustle Directory`,
    description: `Directory of ${totalCount} businesses in ${area.name}, ${city.name}, Nigeria. Updated daily.`,
    url: `https://myhustle.space/${citySlug}/${areaSlug}`,
    license: 'https://myhustle.space/legal/terms-of-service',
    creator: { '@type': 'Organization', name: 'MyHustle', url: 'https://myhustle.space' },
    dateModified: new Date().toISOString().split('T')[0],
    spatialCoverage: { '@type': 'Place', name: `${area.name}, ${city.name}, Nigeria` },
    variableMeasured: 'Number of business listings',
  }

  return (
    <div>
      <SpeakableJsonLd name={`Businesses in ${area.name}, ${city.name} — MyHustle`} url={`https://myhustle.space/${city.slug}/${area.slug}`} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={areaPlaceJsonLd} />
      <JsonLd data={datasetJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.space' },
          { name: city.name, url: `https://myhustle.space/${citySlug}` },
          { name: area.name, url: `https://myhustle.space/${citySlug}/${areaSlug}` },
        ]}
      />

      {/* Header */}
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: city.name, href: `/${citySlug}` },
              { label: area.name },
            ]}
          />
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-4">
            Businesses in <span className="text-hustle-amber">{area.name}</span>
          </h1>
          <p className="text-blue-200 text-lg mt-3">
            See what{"'"}{"s"} happening in {area.name}
          </p>
          <DataFreshness count={totalCount} label="businesses" />
          {(area.seo_description || area.description) && (
            <p className="text-blue-300 mt-2 max-w-3xl">{area.seo_description || area.description}</p>
          )}
          <p className="text-blue-100 mt-2 text-sm">
            {totalCount > 0
              ? `${area.name} has ${totalCount.toLocaleString()} registered businesses on MyHustle, serving the ${city.name} area.`
              : `We're building our directory in ${area.name}, ${city.name}.`
            }
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isEmpty ? (
          /* ===== ENRICHED EMPTY STATE ===== */
          <>
            {/* Area Context */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-hustle-blue/5 to-hustle-amber/5 rounded-xl p-6 border border-gray-100">
                <h2 className="font-heading text-2xl font-bold text-hustle-dark mb-3">
                  About {area.name}
                </h2>
                <p className="text-hustle-muted leading-relaxed">
                  {area.seo_description || `${area.name} is a neighborhood in ${city.name}${city.state ? `, ${city.state}` : ''}. MyHustle is actively building our business directory here to help you discover local services, shops, and professionals. As businesses join, you'll find reviews, contact details, and booking options all in one place.`}
                </p>
              </div>
            </div>

            {/* CTA: Be the first business */}
            <div className="mb-12">
              <div className="bg-gradient-to-br from-hustle-amber/10 via-white to-hustle-sunset/5 rounded-2xl p-8 border-2 border-hustle-amber/30 text-center">
                <div className="w-16 h-16 bg-hustle-amber/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-hustle-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-hustle-dark mb-3">
                  Be the First Business in {area.name}
                </h2>
                <p className="text-hustle-muted max-w-lg mx-auto mb-6">
                  No businesses are listed in {area.name} yet. Get a head start — list your
                  business now and be the first result when customers search this area.
                </p>
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg hover:shadow-xl text-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  List Your Business / Hustle Free
                </Link>
              </div>
            </div>

            {/* Nearby Businesses from other areas */}
            {nearbyBusinesses.length > 0 && (
              <div className="mb-12">
                <h2 className="font-heading text-2xl font-bold mb-2">
                  Businesses Near {area.name}
                </h2>
                <p className="text-hustle-muted mb-6">
                  While {area.name} is growing, check out these businesses in nearby areas of {city.name}.
                </p>
                <BusinessGrid businesses={nearbyBusinesses} />
              </div>
            )}

            {/* Browse Categories */}
            {(allCategories || []).length > 0 && (
              <div className="mb-12">
                <h2 className="font-heading text-2xl font-bold mb-2">
                  Browse Categories in {area.name}
                </h2>
                <p className="text-hustle-muted mb-6">
                  Explore what types of businesses you can find — or be the first to list in a category.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {(allCategories || []).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/${citySlug}/${areaSlug}/${cat.slug}`}
                      className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                    >
                      <span className="text-2xl mb-2 block">{cat.icon || '📁'}</span>
                      <h3 className="font-heading text-sm font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                        {cat.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Landmarks */}
            {landmarks && landmarks.length > 0 && (
              <div className="mb-12">
                <h2 className="font-heading text-2xl font-bold mb-6">Nearby Landmarks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {landmarks.map((lm) => (
                    <Link
                      key={lm.slug}
                      href={`/near/${lm.slug}`}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                    >
                      <span className="text-sm text-hustle-muted capitalize">{lm.type}</span>
                      <h3 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors mt-1">
                        {lm.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Suggest WhatsApp */}
            <section className="mt-4 max-w-lg mx-auto">
              <SuggestWhatsApp type="area" context={city.name} />
            </section>
          </>
        ) : (
          /* ===== NORMAL STATE (has businesses) ===== */
          <>
            {/* Area Description */}
            {area.seo_description && (
              <div className="mb-10">
                <div className="bg-gradient-to-r from-hustle-blue/5 to-hustle-amber/5 rounded-xl p-6 border border-gray-100">
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-3">
                    About {area.name}, {city.name}
                  </h2>
                  <p className="text-hustle-muted leading-relaxed">
                    {area.seo_description}
                  </p>
                </div>
              </div>
            )}

            {/* Categories filter */}
            {categoriesWithCounts.some(c => c.business_count > 0) && (
              <div className="mb-12">
                <h2 className="font-heading text-2xl font-bold mb-6">What are you looking for?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categoriesWithCounts.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/${citySlug}/${areaSlug}/${cat.slug}`}
                      className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                    >
                      <span className="text-2xl mb-2 block">{cat.icon || '📁'}</span>
                      <h3 className="font-heading text-sm font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-hustle-muted mt-1">
                        {cat.business_count} listed
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ===== Section A: Business Landscape ===== */}
            {totalCount > 0 && (
              <div className="mb-12">
                <div className="bg-gradient-to-r from-hustle-blue/5 to-hustle-amber/5 rounded-xl p-6 md:p-8 border border-gray-100">
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-4">
                    Business Directory for {area.name}, {city.name}
                  </h2>
                  <div className="text-hustle-muted leading-relaxed space-y-3">
                    <p>
                      MyHustle has discovered <strong>{totalCount} {totalCount === 1 ? 'business' : 'businesses'}</strong> in {area.name} so far,
                      spanning {categoriesWithCounts.filter(c => c.business_count > 0).length} different categories.
                      {city.state ? ` Located in ${city.name}, ${city.state}, ` : ` In ${city.name}, `}
                      {area.name} is home to a {totalCount > 100 ? 'thriving' : totalCount > 30 ? 'growing' : 'developing'} business community
                      that continues to expand as more local entrepreneurs and service providers join the platform.
                    </p>
                    <p>
                      {(() => {
                        const topCats = categoriesWithCounts
                          .filter(c => c.business_count > 0)
                          .sort((a, b) => b.business_count - a.business_count)
                          .slice(0, 3)
                        if (topCats.length === 0) return null
                        const catPhrases = topCats.map(c => `${c.icon || ''} ${c.name} (${c.business_count} ${c.business_count === 1 ? 'listing' : 'listings'})`)
                        return `The most represented industries found to date include ${catPhrases.join(', ')}. These numbers reflect businesses currently listed on MyHustle and are updated automatically as new businesses register and existing listings are verified.`
                      })()}
                    </p>
                    <p>
                      Whether you{"'"}re searching for a trusted service provider, comparing options before making a decision,
                      or looking to support local businesses in {area.name}, this directory gives you direct access to
                      contact details, customer reviews, and booking options — all in one place.
                      {verifiedCount > 0 &&
                        ` ${verifiedCount} of these businesses have been verified by the MyHustle team, meaning their contact information and operating details have been independently confirmed.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ===== Section B: Popular Services ===== */}
            {(() => {
              const topServices = categoriesWithCounts
                .filter(c => c.business_count > 0)
                .sort((a, b) => b.business_count - a.business_count)
                .slice(0, 8)
              if (topServices.length === 0) return null
              return (
                <div className="mb-12">
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-2">
                    Most Popular Services in {area.name}
                  </h2>
                  <p className="text-hustle-muted mb-6">
                    Based on the number of listings found so far, these are the most sought-after business categories in {area.name}.
                    This ranking updates dynamically as new businesses are added to the directory.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {topServices.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/${citySlug}/${areaSlug}/${cat.slug}`}
                        className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                      >
                        <span className="text-2xl flex-shrink-0">{cat.icon || '📁'}</span>
                        <div>
                          <h3 className="font-heading text-sm font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-hustle-muted mt-0.5">
                            {cat.business_count} {cat.business_count === 1 ? 'business' : 'businesses'} found
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* ===== Section C: Area Insights ===== */}
            {totalCount > 5 && (
              <div className="mb-12">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-4">
                  {area.name} at a Glance
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <p className="text-2xl md:text-3xl font-bold text-hustle-blue">{totalCount}</p>
                    <p className="text-xs text-hustle-muted mt-1">Businesses Found</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <p className="text-2xl md:text-3xl font-bold text-hustle-amber">{categoriesWithCounts.filter(c => c.business_count > 0).length}</p>
                    <p className="text-xs text-hustle-muted mt-1">Categories</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <p className="text-2xl md:text-3xl font-bold text-green-600">{verifiedCount}</p>
                    <p className="text-xs text-hustle-muted mt-1">Verified</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                    <p className="text-2xl md:text-3xl font-bold text-purple-600">{(landmarks || []).length}</p>
                    <p className="text-xs text-hustle-muted mt-1">Landmarks</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <p className="text-hustle-muted leading-relaxed">
                    {area.name} currently features {totalCount} businesses across {categoriesWithCounts.filter(c => c.business_count > 0).length} categories
                    in the MyHustle directory.
                    {verifiedCount > 0
                      ? ` Of these, ${verifiedCount} have been verified — meaning our team has confirmed their contact details, location, and operating status. `
                      : ' '
                    }
                    {(landmarks || []).length > 0
                      ? `The area is home to ${(landmarks || []).length} notable landmarks including ${(landmarks || []).slice(0, 3).map((l: any) => l.name).join(', ')}${(landmarks || []).length > 3 ? ' and more' : ''}, making it easy to find businesses near familiar locations. `
                      : ''
                    }
                    This directory is a living resource — as businesses in {area.name} claim their listings, add descriptions,
                    upload photos, and collect customer reviews, each profile becomes richer and more useful.
                    New businesses are added regularly, so check back often or search for specific services above.
                  </p>
                </div>
              </div>
            )}

            {/* Business Listings */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6">
                All Businesses in {area.name}
                <span className="text-hustle-muted text-lg font-normal ml-2">({totalCount})</span>
              </h2>
              <BusinessGrid businesses={bizList} />
              {totalCount > 20 && (
                <p className="mt-6 text-center text-hustle-muted text-sm">
                  Showing 20 of {totalCount} businesses in {area.name}.
                  Browse by category above to find specific services.
                </p>
              )}
            </div>

            {/* ===== Section D: Nearby Areas ===== */}
            {nearbyAreas && nearbyAreas.length > 0 && (
              <div className="mb-12">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-2">
                  Explore More of {city.name}
                </h2>
                <p className="text-hustle-muted mb-6">
                  Looking beyond {area.name}? These nearby areas in {city.name} also have active business listings on MyHustle.
                  Each area has its own mix of services and local businesses waiting to be discovered.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyAreas.map((na) => (
                    <Link
                      key={na.id}
                      href={`/${citySlug}/${na.slug}`}
                      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-blue group"
                    >
                      <h3 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                        {na.name}
                      </h3>
                      <p className="text-sm text-hustle-amber font-medium mt-1">
                        {na.business_count} {na.business_count === 1 ? 'business' : 'businesses'} listed
                      </p>
                      {na.seo_description && (
                        <p className="text-xs text-hustle-muted mt-2 line-clamp-2">
                          {na.seo_description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-hustle-muted mt-4">
                  Business counts shown reflect listings found so far and update as new businesses join MyHustle.
                </p>
              </div>
            )}

            {/* Nearby Landmarks */}
            {landmarks && landmarks.length > 0 && (
              <div className="mb-12">
                <h2 className="font-heading text-2xl font-bold mb-6">Nearby Landmarks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {landmarks.map((lm) => (
                    <Link
                      key={lm.slug}
                      href={`/near/${lm.slug}`}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                    >
                      <span className="text-sm text-hustle-muted capitalize">{lm.type}</span>
                      <h3 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors mt-1">
                        {lm.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <section className="mt-4 max-w-lg mx-auto">
              <SuggestWhatsApp type="area" context={city.name} />
            </section>
          </>
        )}
      </div>
    </div>
  )
}