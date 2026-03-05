import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import type { Metadata } from 'next'
import type { Business, Category, Area, Review } from '@/lib/types'

interface PageProps {
  params: Promise<{ landmark: string; category: string }>
}

export async function generateStaticParams() {
  const { data: landmarks } = await supabase.from('landmarks').select('slug')
  const { data: categories } = await supabase
    .from('categories').select('slug, parent_id').is('parent_id', null)

  const params: { landmark: string; category: string }[] = []
  for (const lm of landmarks || []) {
    for (const cat of categories || []) {
      params.push({ landmark: lm.slug, category: cat.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { landmark: lmSlug, category: catSlug } = await params

  const { data: landmark } = await supabase
    .from('landmarks').select('name').eq('slug', lmSlug).single()
  const { data: category } = await supabase
    .from('categories').select('name').eq('slug', catSlug).single()

  if (!landmark || !category) return { title: 'Not Found' }

  const title = `Best ${category.name} Near ${landmark.name} | MyHustle`
  const description = `Find the best ${category.name} services near ${landmark.name} in Nigeria. Read reviews and book appointments on MyHustle.`
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.com/near/${lmSlug}/${catSlug}`,
    },
  }
}

export const revalidate = 3600
export const dynamicParams = true

export default async function LandmarkCategoryPage({ params }: PageProps) {
  const { landmark: lmSlug, category: catSlug } = await params

  const { data: landmark } = await supabase
    .from('landmarks').select('*, area:areas(*, city:cities(*))').eq('slug', lmSlug).single()
  const { data: category } = await supabase
    .from('categories').select('*').eq('slug', catSlug).single()

  if (!landmark || !category) notFound()

  const isParent = !category.parent_id
  let categoryIds = [category.id]
  if (isParent) {
    const { data: children } = await supabase
      .from('categories').select('id').eq('parent_id', category.id)
    if (children) categoryIds = [category.id, ...children.map(c => c.id)]
  }

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*, category:categories(*), area:areas(*, city:cities(*)), reviews(*)')
    .eq('area_id', landmark.area_id)
    .in('category_id', categoryIds)
    .eq('active', true)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })

  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Near ${landmark.name}`,
    numberOfItems: bizList.length,
    itemListElement: bizList.map((biz, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: biz.name,
        url: `https://myhustle.com/business/${biz.slug}`,
      },
    })),
  }

  return (
    <div>
      <JsonLd data={itemListJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.com' },
          { name: `Near ${landmark.name}`, url: `https://myhustle.com/near/${lmSlug}` },
          { name: category.name, url: `https://myhustle.com/near/${lmSlug}/${catSlug}` },
        ]}
      />

      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: `Near ${landmark.name}`, href: `/near/${lmSlug}` },
              { label: category.name },
            ]}
          />
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-4">
            Best <span className="text-hustle-amber">{category.name}</span> Near {landmark.name}
          </h1>
          <p className="text-blue-200 text-lg mt-3">
            {landmark.area?.name && `${landmark.area.name}${(landmark.area as any)?.city?.name ? `, ${(landmark.area as any).city.name}` : ''}`}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-6">
            {category.name} Near {landmark.name}
            <span className="text-hustle-muted text-lg font-normal ml-2">({bizList.length})</span>
          </h2>
          <BusinessGrid
            businesses={bizList}
            emptyTitle={`No ${category.name} businesses near ${landmark.name} yet`}
            emptyMessage={`Be the first to list your ${category.name} business near ${landmark.name}!`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-hustle-light rounded-xl p-6">
            <h3 className="font-heading font-semibold text-lg mb-3">More near {landmark.name}</h3>
            <Link
              href={`/near/${lmSlug}`}
              className="text-hustle-blue hover:text-hustle-amber transition-colors"
            >
              View all businesses near {landmark.name} →
            </Link>
          </div>
          <div className="bg-hustle-light rounded-xl p-6">
            <h3 className="font-heading font-semibold text-lg mb-3">More {category.name}</h3>
            <Link
              href={`/category/${catSlug}`}
              className="text-hustle-blue hover:text-hustle-amber transition-colors"
            >
              View all {category.name} in {(landmark.area as any)?.city?.name || 'this area'} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
