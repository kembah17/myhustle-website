import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Areas in Lagos | MyHustle',
  description: 'Browse businesses across all areas in Lagos. Find top-rated services in Lekki, Victoria Island, Ikeja, Surulere, and more.',
}

export const revalidate = 3600

export default async function LagosPage() {
  const supabase = createServiceClient()

  const { data: areas } = await supabase
    .from('areas').select('id, slug, name, description').order('name')

  const { data: businesses } = await supabase
    .from('businesses').select('id, area_id').eq('active', true)

  const countMap: Record<string, number> = {}
  for (const biz of businesses || []) {
    if (biz.area_id) countMap[biz.area_id] = (countMap[biz.area_id] || 0) + 1
  }

  const areasWithCounts = (areas || []).map(a => ({
    ...a,
    business_count: countMap[a.id] || 0,
  }))

  // Separate LGAs and popular sub-areas
  const lgaAreas = areasWithCounts.filter(a => !a.description?.includes('sub-area'))
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Areas in Lagos',
    numberOfItems: areasWithCounts.length,
    itemListElement: areasWithCounts.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Place',
        name: `${a.name}, Lagos`,
        url: `https://myhustle.com/lagos/${a.slug}`,
      },
    })),
  }

  return (
    <div>
      <JsonLd data={jsonLd} />

      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Lagos' }]} />
          <h1 className="font-heading text-3xl md:text-5xl font-bold mt-4">
            All Areas in <span className="text-hustle-amber">Lagos</span>
          </h1>
          <p className="text-blue-200 text-lg mt-3">
            Browse businesses across {areasWithCounts.length} areas in Lagos
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {areasWithCounts.map((area) => (
            <Link
              key={area.id}
              href={`/lagos/${area.slug}`}
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
