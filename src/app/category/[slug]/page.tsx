import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import CategoryGrid from '@/components/CategoryGrid'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import type { Metadata } from 'next'
import type { Category, Business, Area, Review } from '@/lib/types'
import SuggestWhatsApp from '@/components/SuggestWhatsApp'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: category } = await getSupabase()
    .from('categories')
    .select('name, seo_title_template, seo_description_template')
    .eq('slug', slug)
    .single()

  if (!category) return { title: 'Category Not Found' }

  const title = category.seo_title_template
    ? category.seo_title_template
        .replace('{name}', category.name)
        .replace('{area}', 'Nigeria')
        .replace(/,\s*Lagos/gi, '')
        .replace(/Lagos,?\s*/gi, '')
        .trim()
        .replace(/^-\s*/, '')
    : `${category.name} in Nigeria | MyHustle`
  const description = category.seo_description_template
    ? category.seo_description_template
        .replace('{name}', 'top professionals')
        .replace('{area}', 'Nigeria')
        .replace(/,\s*Lagos/gi, '')
        .replace(/Lagos,?\s*/gi, '')
    : `Looking for ${category.name} in Nigeria? Browse verified businesses, read real reviews, and book directly on MyHustle.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.space/category/${slug}`,
    },
  }
}


export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch category
  const { data: category } = await getSupabase()
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const isParent = !category.parent_id

  // If parent, fetch children
  let children: (Category & { business_count?: number })[] = []
  if (isParent) {
    const { data: childCats } = await getSupabase()
      .from('categories')
      .select('*')
      .eq('parent_id', category.id)
      .order('name')
    children = childCats || []
  }

  // Fetch parent if subcategory
  let parentCategory: Category | null = null
  if (!isParent && category.parent_id) {
    const { data: parent } = await getSupabase()
      .from('categories')
      .select('*')
      .eq('id', category.parent_id)
      .single()
    parentCategory = parent
  }

  // Build category IDs to query (parent includes all children)
  const categoryIds = isParent
    ? [category.id, ...children.map(c => c.id)]
    : [category.id]

  // Lightweight query: get area_id for all businesses in this category (for area distribution + total count)
  const { data: bizMeta, count: totalCount } = await getSupabase()
    .from('businesses')
    .select('area_id, area:areas!inner(id, slug, name, city:cities!inner(slug, name))', { count: 'exact' })
    .in('category_id', categoryIds)
    .eq('active', true)

  const allBizMeta = bizMeta || []

  // Display query: fetch full data for first 20 businesses only
  const { data: businesses } = await getSupabase()
    .from('businesses')
    .select('*, category:categories(*), area:areas(*, city:cities(slug, name)), reviews(*)')
    .in('category_id', categoryIds)
    .eq('active', true)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  // Get accurate subcategory counts via RPC (efficient single query)
  if (isParent && children.length > 0) {
    const { data: categoryCounts } = await getSupabase().rpc('get_category_business_counts')
    const countMap: Record<string, number> = {}
    if (categoryCounts) {
      for (const row of categoryCounts) {
        countMap[row.category_id] = Number(row.count)
      }
    }
    children = children.map(c => ({ ...c, business_count: countMap[c.id] || 0 }))
  }

  // Get areas that have businesses in this category (from lightweight meta query)
  const areaMap = new Map<string, { slug: string; name: string; count: number; citySlug: string }>()
  for (const biz of allBizMeta) {
    const bizArea = biz.area as any
    if (bizArea) {
      const existing = areaMap.get(bizArea.id)
      if (existing) {
        existing.count++
      } else {
        areaMap.set(bizArea.id, { slug: bizArea.slug, name: bizArea.name, count: 1, citySlug: bizArea.city?.slug || 'lagos' })
      }
    }
  }
  const areasWithCount = Array.from(areaMap.values()).sort((a, b) => b.count - a.count)

  // Collect city names for content sections (from lightweight meta query)
  const cityNamesSet = new Set<string>()
  allBizMeta.forEach(b => {
    const cn = (b.area as any)?.city?.name
    if (cn) cityNamesSet.add(cn)
  })

  const displayTotal = totalCount ?? allBizMeta.length

  // Schema.org - Enhanced ItemList
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} in Nigeria`,
    description: `Top ${category.name} businesses across Nigeria on MyHustle`,
    url: `https://myhustle.space/category/${slug}`,
    numberOfItems: displayTotal,
    itemListElement: bizList.slice(0, 20).map((biz, index) => {
      const bizReviews = biz.reviews || []
      const bizAvgRating = bizReviews.length > 0
        ? bizReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / bizReviews.length
        : 0
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LocalBusiness',
          name: biz.name,
          url: `https://myhustle.space/business/${biz.slug}`,
          ...(biz.cover_photo_url ? { image: biz.cover_photo_url } : {}),
          ...(biz.address ? {
            address: {
              '@type': 'PostalAddress',
              streetAddress: biz.address,
              addressLocality: biz.area?.name || '',
              addressRegion: (biz.area as any)?.city?.name || '',
              addressCountry: 'NG',
            }
          } : {}),
          ...(biz.phone ? { telephone: biz.phone } : {}),
          ...(bizReviews.length > 0 ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: bizAvgRating.toFixed(1),
              reviewCount: bizReviews.length,
              bestRating: 5,
              worstRating: 1,
            }
          } : {}),
        },
      }
    }),
  }

  // Breadcrumbs
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(parentCategory
      ? [{ label: parentCategory.name, href: `/category/${parentCategory.slug}` }]
      : []),
    { label: category.name },
  ]

  return (
    <div>
      <JsonLd data={itemListJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.space' },
          ...(parentCategory
            ? [{ name: parentCategory.name, url: `https://myhustle.space/category/${parentCategory.slug}` }]
            : []),
          { name: category.name, url: `https://myhustle.space/category/${slug}` },
        ]}
      />

      {/* Header */}
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center gap-3 mt-4">
            {category.icon && <span className="text-5xl">{category.icon}</span>}
            <div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold">
                {category.name}
                <span className="text-hustle-amber"> in Nigeria</span>
              </h1>
              {category.description && (
                <p className="text-blue-200 text-lg mt-2">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subcategories grid (for parent categories) */}
        {isParent && children.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-6">Subcategories</h2>
            <CategoryGrid categories={children} columns={4} />
          </div>
        )}

        {/* Browse by area */}
        {areasWithCount.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-6">
              Find {category.name} Near You
            </h2>
            <div className="flex flex-wrap gap-3">
              {areasWithCount.map((area) => (
                <Link
                  key={area.slug}
                  href={`/${area.citySlug}/${area.slug}/${slug}`}
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm hover:border-hustle-amber hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-hustle-dark">{area.name}</span>
                  <span className="text-hustle-muted">({area.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Business Listings */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-6">
            {isParent ? `All ${category.name} Businesses` : category.name}
            <span className="text-hustle-muted text-lg font-normal ml-2">({displayTotal})</span>
          </h2>
          <BusinessGrid businesses={bizList} />
          {displayTotal > 20 && (
            <p className="mt-6 text-center text-hustle-muted text-sm">
              Showing 20 of {displayTotal.toLocaleString()} businesses.
              Browse by area above to find {category.name.toLowerCase()} near you.
            </p>
          )}
        </div>

        {/* Category Overview */}
        {displayTotal > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-hustle-blue/5 to-hustle-amber/5 rounded-xl p-6 md:p-8 border border-gray-100">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-4">
                {category.name} Businesses Across Nigeria
              </h2>
              <div className="text-hustle-muted leading-relaxed space-y-3">
                <p>
                  MyHustle has discovered <strong>{displayTotal.toLocaleString()} {category.name.toLowerCase()} {displayTotal === 1 ? 'business' : 'businesses'}</strong> across Nigeria so far,
                  spanning {areasWithCount.length} different {areasWithCount.length === 1 ? 'area' : 'areas'}
                  {cityNamesSet.size > 0 ? ` in ${cityNamesSet.size} ${cityNamesSet.size === 1 ? 'city' : 'cities'}` : ''}.
                  This directory is updated as new {category.name.toLowerCase()} businesses register on the platform.
                </p>
                {areasWithCount.length > 0 && (
                  <p>
                    {(() => {
                      const topAreas = areasWithCount.slice(0, 5)
                      const areaPhrases = topAreas.map(a => `${a.name} (${a.count})`)
                      return `The highest concentration of ${category.name.toLowerCase()} businesses found to date is in ${areaPhrases.join(', ')}. These numbers reflect current listings and change as new businesses join MyHustle.`
                    })()}
                  </p>
                )}
                {isParent && children.length > 0 && (
                  <p>
                    {(() => {
                      const activeSubs = children.filter(c => (c.business_count || 0) > 0)
                      if (activeSubs.length === 0) return `This category includes ${children.length} subcategories. As more businesses are listed, you'll find increasingly specific options to match your needs.`
                      const subPhrases = activeSubs.slice(0, 4).map(c => `${c.name} (${c.business_count} listed)`)
                      return `Within ${category.name}, the most active subcategories discovered so far include ${subPhrases.join(', ')}. Browse subcategories above to narrow your search.`
                    })()}
                  </p>
                )}
                <p>
                  Every listing includes contact details and location information, with many also featuring customer reviews
                  and booking options. As business owners claim their profiles, listings are enriched with descriptions,
                  photos, and verified operating details — making it easier for you to find and compare
                  {' '}{category.name.toLowerCase()} services near you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Geographic Distribution */}
        {areasWithCount.length > 5 && (
          <div className="mb-12">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-hustle-dark mb-2">
              Where to Find {category.name} in Nigeria
            </h2>
            <p className="text-hustle-muted mb-4">
              {category.name} businesses on MyHustle are spread across {areasWithCount.length} areas in
              {cityNamesSet.size > 0 ? ` ${cityNamesSet.size} Nigerian ${cityNamesSet.size === 1 ? 'city' : 'cities'}` : ' Nigeria'}.
              This geographic breakdown updates as new listings are added to the directory.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-hustle-blue">{displayTotal.toLocaleString()}</p>
                <p className="text-xs text-hustle-muted mt-1">Total Found</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-hustle-amber">{areasWithCount.length}</p>
                <p className="text-xs text-hustle-muted mt-1">Areas Covered</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-green-600">{cityNamesSet.size}</p>
                <p className="text-xs text-hustle-muted mt-1">{cityNamesSet.size === 1 ? 'City' : 'Cities'}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <p className="text-2xl font-bold text-purple-600">{isParent ? children.length : 0}</p>
                <p className="text-xs text-hustle-muted mt-1">Subcategories</p>
              </div>
            </div>
          </div>
        )}

        {/* Back to parent link */}
        {parentCategory && (
          <div className="text-center">
            <Link
              href={`/category/${parentCategory.slug}`}
              className="text-hustle-blue font-semibold hover:text-hustle-amber transition-colors"
            >
              ← Back to {parentCategory.name}
            </Link>
          </div>
        )}

        <section className="mt-12 max-w-lg mx-auto">
          <SuggestWhatsApp type="category" />
        </section>
      </div>
    </div>
  )
}