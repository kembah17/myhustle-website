import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import DataFreshness from '@/components/DataFreshness'
import type { Metadata } from 'next'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ category: string; city: string }>
}

function qualityScore(b: any): number {
  let score = 0
  if (b.website) score += 40
  if (b.phone) score += 25
  if (b.description && b.description.length > 100) score += 20
  else if (b.description && b.description.length > 50) score += 10
  if (b.address) score += 10
  if (b.hours && b.hours.length > 0) score += 5
  return score
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: catSlug, city: citySlug } = await params
  const supabase = getSupabase()

  const { data: city } = await supabase
    .from('cities')
    .select('id, name')
    .eq('slug', citySlug)
    .single()

  const { data: category } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', catSlug)
    .single()

  if (!city || !category) return { title: 'Not Found' }

  const { count } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('city_id', city.id)
    .eq('category_id', category.id)
    .eq('active', true)

  return {
    title: `Top ${category.name} in ${city.name} — Best ${category.name} Directory | MyHustle`,
    description: `Discover the top ${count || ''} ${category.name.toLowerCase()} businesses in ${city.name}, Nigeria. Compare listings, contact details, and services on MyHustle.`,
    alternates: { canonical: `https://myhustle.space/top/${catSlug}/${citySlug}` },
  }
}

export async function generateStaticParams() {
  // Let ISR generate pages on-demand - avoids complex queries at build time
  return []
}

export default async function TopCategoryCityPage({ params }: PageProps) {
  const { category: catSlug, city: citySlug } = await params
  const supabase = getSupabase()

  // Fetch city
  const { data: city } = await supabase
    .from('cities')
    .select('id, name, slug')
    .eq('slug', citySlug)
    .single()

  if (!city) notFound()

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', catSlug)
    .single()

  if (!category) notFound()

  // Get total count
  const { count: totalCount } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('city_id', city.id)
    .eq('category_id', category.id)
    .eq('active', true)

  const total = totalCount || 0

  // Return 404 for thin content
  if (total < 5) notFound()

  // Fetch businesses for ranking
  const { data: rawBusinesses } = await supabase
    .from('businesses')
    .select('id, slug, name, description, phone, website, address, area:areas(name, slug), hours:business_hours(id)')
    .eq('city_id', city.id)
    .eq('category_id', category.id)
    .eq('active', true)
    .limit(50)

  // Sort by quality score and take top 20
  const businesses = (rawBusinesses || [])
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, 20)

  // Fetch areas that have businesses in this category for "Browse by Area" section
  const { data: areasWithBusinesses } = await supabase
    .from('businesses')
    .select('area:areas(name, slug)')
    .eq('city_id', city.id)
    .eq('category_id', category.id)
    .eq('active', true)
    .not('area_id', 'is', null)
    .limit(200)

  // Deduplicate areas
  const areaMap = new Map<string, { name: string; slug: string }>()
  for (const b of areasWithBusinesses || []) {
    const area = b.area as any
    if (area?.slug && area?.name) {
      areaMap.set(area.slug, { name: area.name, slug: area.slug })
    }
  }
  const uniqueAreas = Array.from(areaMap.values()).sort((a, b) => a.name.localeCompare(b.name))

  const now = new Date()
  const monthYear = now.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
  const currentYear = now.getFullYear()

  // JSON-LD schemas
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top ${category.name} in ${city.name}, Nigeria`,
    description: `Directory of the best ${category.name} businesses in ${city.name}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      url: `https://myhustle.space/business/${b.slug}`,
    })),
  }

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${category.name} Businesses in ${city.name}, Nigeria`,
    description: `A curated dataset of ${total} ${category.name} businesses operating in ${city.name}, Nigeria`,
    url: `https://myhustle.space/top/${category.slug}/${city.slug}`,
    creator: { '@type': 'Organization', name: 'MyHustle', url: 'https://myhustle.space' },
    dateModified: new Date().toISOString().split('T')[0],
    spatialCoverage: { '@type': 'Place', name: `${city.name}, Nigeria` },
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://myhustle.space' },
    { name: city.name, url: `https://myhustle.space/${city.slug}` },
    { name: category.name, url: `https://myhustle.space/category/${category.slug}` },
    { name: `Top ${category.name}`, url: `https://myhustle.space/top/${category.slug}/${city.slug}` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={datasetJsonLd} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: city.name, href: `/${city.slug}` },
          { label: category.name, href: `/category/${category.slug}` },
          { label: `Top ${category.name}` },
        ]}
      />

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-hustle-dark mt-4 mb-3">
        Top {category.name} in {city.name}, Nigeria — {currentYear} Directory
      </h1>

      <p className="text-gray-600 mb-2">
        MyHustle lists <strong>{total.toLocaleString()}</strong> {category.name.toLowerCase()} businesses in {city.name}.
        Here are the top-rated and most complete listings as of {monthYear}.
      </p>

      <DataFreshness count={total} label={`${category.name.toLowerCase()} businesses in ${city.name}`} />

      {/* Ranked Business List */}
      <div className="mt-8 space-y-4">
        {businesses.map((biz, index) => {
          const area = biz.area as any
          const hasWebsite = !!biz.website
          const hasPhone = !!biz.phone
          const hasHours = biz.hours && (biz.hours as any[]).length > 0
          const descriptionText = biz.description && biz.description.length > 0
            ? biz.description.slice(0, 150) + (biz.description.length > 150 ? '…' : '')
            : null

          return (
            <div key={biz.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/business/${biz.slug}`}
                    className="text-lg font-semibold text-hustle-dark hover:text-green-600 transition-colors"
                  >
                    {biz.name}
                  </Link>

                  {area?.name && (
                    <p className="text-sm text-gray-500 mt-0.5">📍 {area.name}{biz.address ? ` · ${biz.address}` : ''}</p>
                  )}
                  {!area?.name && biz.address && (
                    <p className="text-sm text-gray-500 mt-0.5">📍 {biz.address}</p>
                  )}

                  {hasPhone && (
                    <p className="text-sm text-gray-600 mt-1">📞 {biz.phone}</p>
                  )}

                  {descriptionText ? (
                    <p className="text-sm text-gray-600 mt-2">{descriptionText}</p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2 italic">No description yet</p>
                  )}

                  {hasWebsite && biz.website && (
                    <a
                      href={biz.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-blue-600 hover:text-blue-800 mt-1"
                    >
                      🌐 Visit Website →
                    </a>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {hasWebsite && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Has Website
                      </span>
                    )}
                    {hasPhone && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Has Phone
                      </span>
                    )}
                    {hasHours && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Has Hours
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* About Section */}
      <section className="mt-12">
        <h2 className="text-xl font-heading font-bold text-hustle-dark mb-4">
          About {category.name} Services in {city.name}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
          <p>
            {city.name} is home to a thriving {category.name.toLowerCase()} sector, with {total.toLocaleString()} businesses
            listed on MyHustle. Whether you&apos;re looking for established companies or new entrants,
            our directory helps you compare options and find the right fit for your needs.
          </p>
          <p>
            Each listing on MyHustle includes contact details, business hours, customer reviews, and
            location information. Businesses with more complete profiles rank higher in our directory,
            ensuring you see the most reliable options first.
          </p>
          <p>
            Looking for {category.name.toLowerCase()} in a specific area of {city.name}? Browse by
            neighbourhood below, or use our search to find businesses near your exact location.
          </p>
        </div>
      </section>

      {/* Browse by Area */}
      {uniqueAreas.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-heading font-bold text-hustle-dark mb-4">
            Browse {category.name} by Area in {city.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {uniqueAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/${city.slug}/${area.slug}/${category.slug}`}
                className="inline-block px-3 py-1.5 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-lg text-sm transition-colors"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <h2 className="text-lg font-heading font-bold text-green-800 mb-2">
          Own a {category.name.toLowerCase()} business in {city.name}?
        </h2>
        <p className="text-green-700 mb-4">
          List it free on MyHustle and get discovered by customers searching for your services.
        </p>
        <Link
          href="/list-your-business"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          List Your Business Free →
        </Link>
      </section>
    </div>
  )
}
