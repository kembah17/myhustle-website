import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import CategoryGrid from '@/components/CategoryGrid'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import type { Metadata } from 'next'
import type { Category, Business, Area, Review } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = createServiceClient()
  const { data: categories } = await supabase.from('categories').select('slug')
  return (categories || []).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data: category } = await supabase
    .from('categories')
    .select('name, seo_title_template, seo_description_template')
    .eq('slug', slug)
    .single()

  if (!category) return { title: 'Category Not Found' }

  const title = category.seo_title_template
    ? category.seo_title_template.replace('{name}', '').replace('{area}', 'Lagos').trim().replace(/^-\s*/, '')
    : `${category.name} in Lagos | MyHustle`
  const description = category.seo_description_template
    ? category.seo_description_template.replace('{name}', 'top professionals').replace('{area}', 'Lagos')
    : `Looking for ${category.name} in Lagos? Browse verified businesses, read real reviews, and book directly on MyHustle.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export const revalidate = 3600

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createServiceClient()

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const isParent = !category.parent_id

  // If parent, fetch children
  let children: (Category & { business_count?: number })[] = []
  if (isParent) {
    const { data: childCats } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', category.id)
      .order('name')
    children = childCats || []
  }

  // Fetch parent if subcategory
  let parentCategory: Category | null = null
  if (!isParent && category.parent_id) {
    const { data: parent } = await supabase
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

  // Fetch businesses
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .in('category_id', categoryIds)
    .eq('active', true)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })

  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  // Compute child category counts
  if (isParent && children.length > 0) {
    const countMap: Record<string, number> = {}
    for (const biz of bizList) {
      countMap[biz.category_id] = (countMap[biz.category_id] || 0) + 1
    }
    children = children.map(c => ({ ...c, business_count: countMap[c.id] || 0 }))
  }

  // Get areas that have businesses in this category
  const areaMap = new Map<string, { slug: string; name: string; count: number }>()
  for (const biz of bizList) {
    if (biz.area) {
      const existing = areaMap.get(biz.area.id)
      if (existing) {
        existing.count++
      } else {
        areaMap.set(biz.area.id, { slug: biz.area.slug, name: biz.area.name, count: 1 })
      }
    }
  }
  const areasWithCount = Array.from(areaMap.values()).sort((a, b) => b.count - a.count)

  // Schema.org
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} in Lagos`,
    description: `Top ${category.name} businesses in Lagos`,
    numberOfItems: bizList.length,
    itemListElement: bizList.slice(0, 20).map((biz, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: biz.name,
        url: `https://myhustle.com/business/${biz.slug}`,
        ...(biz.address ? { address: biz.address } : {}),
      },
    })),
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
          { name: 'Home', url: 'https://myhustle.com' },
          ...(parentCategory
            ? [{ name: parentCategory.name, url: `https://myhustle.com/category/${parentCategory.slug}` }]
            : []),
          { name: category.name, url: `https://myhustle.com/category/${slug}` },
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
                <span className="text-hustle-amber"> in Lagos</span>
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
                  href={`/lagos/${area.slug}/${slug}`}
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
            <span className="text-hustle-muted text-lg font-normal ml-2">({bizList.length})</span>
          </h2>
          <BusinessGrid
            businesses={bizList}
            emptyTitle={`No ${category.name} businesses yet`}
            emptyMessage={`Know a great ${category.name} business? Tell them about MyHustle!`}
          />
        </div>

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
      </div>
    </div>
  )
}
