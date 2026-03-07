import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import type { Metadata } from 'next'
import type { Business, Category, Area, Review } from '@/lib/types'
import { generateAreaCategoryFAQs } from '@/lib/faq-generator'
import FAQSection from '@/components/FAQSection'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ city: string; area: string; category: string }>
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, area: areaSlug, category: catSlug } = await params

  const { data: city } = await getSupabase()
    .from('cities').select('name').eq('slug', citySlug).single()
  const { data: area } = await getSupabase()
    .from('areas').select('name').eq('slug', areaSlug).single()
  const { data: category } = await getSupabase()
    .from('categories').select('name').eq('slug', catSlug).single()

  if (!city || !area || !category) return { title: 'Not Found' }

  const title = `Best ${category.name} in ${area.name}, ${city.name} | MyHustle`
  const description = `Find the best ${category.name} services in ${area.name}, ${city.name}. Read reviews, compare prices, and book appointments on MyHustle.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.com/${citySlug}/${areaSlug}/${catSlug}`,
    },
  }
}


export default async function AreaCategoryPage({ params }: PageProps) {
  const { city: citySlug, area: areaSlug, category: catSlug } = await params

  // Fetch city
  const { data: city } = await getSupabase()
    .from('cities').select('*').eq('slug', citySlug).single()
  if (!city) notFound()

  // Fetch area and category
  const { data: area } = await getSupabase()
    .from('areas').select('*').eq('slug', areaSlug).eq('city_id', city.id).single()
  const { data: category } = await getSupabase()
    .from('categories').select('*').eq('slug', catSlug).single()

  if (!area || !category) notFound()

  const isParent = !category.parent_id

  // Build category IDs (include children if parent)
  let categoryIds = [category.id]
  if (isParent) {
    const { data: children } = await getSupabase()
      .from('categories')
      .select('id')
      .eq('parent_id', category.id)
    if (children) categoryIds = [category.id, ...children.map(c => c.id)]
  }

  // Fetch businesses matching area + category
  const { data: businesses } = await getSupabase()
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('area_id', area.id)
    .in('category_id', categoryIds)
    .eq('active', true)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })

  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  // Get subcategories if parent
  let subcategories: Category[] = []
  if (isParent) {
    const { data: subs } = await getSupabase()
      .from('categories')
      .select('*')
      .eq('parent_id', category.id)
      .order('name')
    subcategories = subs || []
  }

  // Schema.org
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} in ${area.name}, ${city.name}`,
    description: `Best ${category.name} businesses in ${area.name}, ${city.name}`,
    numberOfItems: bizList.length,
    itemListElement: bizList.map((biz, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: biz.name,
        url: `https://myhustle.com/business/${biz.slug}`,
      },
    })),
  }

  const areaCatFaqs = generateAreaCategoryFAQs({
    areaName: area.name,
    cityName: city.name,
    categoryName: category.name,
    businessCount: bizList.length,
    businessNames: bizList.slice(0, 5).map(b => b.name),
  })

  return (
    <div>
      <JsonLd data={itemListJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.com' },
          { name: city.name, url: `https://myhustle.com/${citySlug}` },
          { name: area.name, url: `https://myhustle.com/${citySlug}/${areaSlug}` },
          { name: category.name, url: `https://myhustle.com/${citySlug}/${areaSlug}/${catSlug}` },
        ]}
      />

      {/* Header */}
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: city.name, href: `/${citySlug}` },
              { label: area.name, href: `/${citySlug}/${areaSlug}` },
              { label: category.name },
            ]}
          />
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-4">
            Best <span className="text-hustle-amber">{category.name}</span> in {area.name}
          </h1>
          <p className="text-blue-200 text-lg mt-3">
            Find and book top-rated {category.name.toLowerCase()} services in {area.name}, {city.name}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subcategory filter pills */}
        {isParent && subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-4">Filter by Subcategory</h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${citySlug}/${areaSlug}/${sub.slug}`}
                  className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm hover:border-hustle-amber hover:shadow-sm transition-all"
                >
                  {sub.icon && <span>{sub.icon}</span>}
                  <span className="font-medium text-hustle-dark">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Business Listings */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-6">
            {category.name} in {area.name}
            <span className="text-hustle-muted text-lg font-normal ml-2">({bizList.length})</span>
          </h2>
          <BusinessGrid
            businesses={bizList}
            emptyTitle={`No ${category.name} businesses in ${area.name} yet`}
            emptyMessage={`Be the first to list your ${category.name} business in ${area.name}, ${city.name}!`}
          />
        </div>

        {/* Related links */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-hustle-light rounded-xl p-6">
            <h3 className="font-heading font-semibold text-lg mb-3">More in {area.name}</h3>
            <Link
              href={`/${citySlug}/${areaSlug}`}
              className="text-hustle-blue hover:text-hustle-amber transition-colors"
            >
              View all businesses in {area.name} &rarr;
            </Link>
          </div>
          <div className="bg-hustle-light rounded-xl p-6">
            <h3 className="font-heading font-semibold text-lg mb-3">More {category.name}</h3>
            <Link
              href={`/category/${catSlug}`}
              className="text-hustle-blue hover:text-hustle-amber transition-colors"
            >
              View all {category.name} across Nigeria &rarr;
            </Link>
          </div>
        </div>

        <FAQSection faqs={areaCatFaqs} />
      </div>
    </div>
  )
}
