import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import type { Metadata } from 'next'
import type { Area, Business, Category, Review, Landmark } from '@/lib/types'

interface PageProps {
  params: Promise<{ city: string; area: string }>
}

export async function generateStaticParams() {
  const { data: areas } = await supabase
    .from('areas')
    .select('slug, city:cities(slug)')
  return (areas || []).map((a) => ({
    city: (a.city as any)?.slug || 'lagos',
    area: a.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, area: areaSlug } = await params
  const { data: city } = await supabase
    .from('cities').select('name').eq('slug', citySlug).single()
  const { data: area } = await supabase
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
      canonical: `https://myhustle.com/${citySlug}/${areaSlug}`,
    },
  }
}

export const revalidate = 3600

export default async function AreaPage({ params }: PageProps) {
  const { city: citySlug, area: areaSlug } = await params

  // Fetch city
  const { data: city } = await supabase
    .from('cities').select('*').eq('slug', citySlug).single()
  if (!city) notFound()

  // Fetch area
  const { data: area } = await supabase
    .from('areas').select('*').eq('slug', areaSlug).eq('city_id', city.id).single()
  if (!area) notFound()

  // Fetch businesses in this area with relations
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('area_id', area.id)
    .eq('active', true)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })

  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  // Get categories with counts for this area
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, slug, name, icon, parent_id')
    .is('parent_id', null)
    .order('name')

  const catCountMap: Record<string, number> = {}
  const { data: allCats } = await supabase.from('categories').select('id, parent_id')
  const childToParent: Record<string, string> = {}
  if (allCats) {
    for (const c of allCats) {
      if (c.parent_id) childToParent[c.id] = c.parent_id
    }
  }
  for (const biz of bizList) {
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
  const { data: landmarks } = await supabase
    .from('landmarks')
    .select('slug, name, type')
    .eq('area_id', area.id)
    .order('name')

  // Schema.org ItemList
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Businesses in ${area.name}, ${city.name}`,
    description: `Top-rated businesses in ${area.name}, ${city.name}`,
    numberOfItems: bizList.length,
    itemListElement: bizList.map((biz, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: biz.name,
        url: `https://myhustle.com/business/${biz.slug}`,
        ...(biz.address ? { address: biz.address } : {}),
        ...(biz.phone ? { telephone: biz.phone } : {}),
      },
    })),
  }

  return (
    <div>
      <JsonLd data={itemListJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.com' },
          { name: city.name, url: `https://myhustle.com/${citySlug}` },
          { name: area.name, url: `https://myhustle.com/${citySlug}/${areaSlug}` },
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
            See what&apos;s happening in {area.name}
          </p>
          {area.description && (
            <p className="text-blue-300 mt-2 max-w-3xl">{area.description}</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Business Listings */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-6">
            All Businesses in {area.name}
            <span className="text-hustle-muted text-lg font-normal ml-2">({bizList.length})</span>
          </h2>
          <BusinessGrid
            businesses={bizList}
            emptyTitle={`${area.name} is waiting for you`}
            emptyMessage={`No businesses listed here yet. Be the first to put ${area.name} on the map!`}
          />
        </div>

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
      </div>
    </div>
  )
}
