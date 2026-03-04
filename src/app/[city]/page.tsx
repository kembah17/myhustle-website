import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  const supabase = createServiceClient()
  const { data: cities } = await supabase.from('cities').select('slug')
  return (cities || []).map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const supabase = createServiceClient()
  const { data: city } = await supabase
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

export const revalidate = 3600

export default async function CityPage({ params }: PageProps) {
  const { city: citySlug } = await params
  const supabase = createServiceClient()

  const { data: city } = await supabase
    .from('cities').select('*').eq('slug', citySlug).single()

  if (!city) notFound()

  const { data: areas } = await supabase
    .from('areas').select('id, slug, name, description')
    .eq('city_id', city.id)
    .order('name')

  const { data: businesses } = await supabase
    .from('businesses').select('id, area_id')
    .eq('city_id', city.id)
    .eq('active', true)

  const countMap: Record<string, number> = {}
  for (const biz of businesses || []) {
    if (biz.area_id) countMap[biz.area_id] = (countMap[biz.area_id] || 0) + 1
  }

  const areasWithCounts = (areas || []).map(a => ({
    ...a,
    business_count: countMap[a.id] || 0,
  }))

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
    numberOfItems: areasWithCounts.length,
    itemListElement: areasWithCounts.map((a, i) => ({
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
            Browse businesses across {areasWithCounts.length} areas in {city.name}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {areasWithCounts.map((area) => (
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
      </div>
    </div>
  )
}
