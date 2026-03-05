import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import CategoryGrid from '@/components/CategoryGrid'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import type { Metadata } from 'next'
import type { Business, Category, Area, Review } from '@/lib/types'

interface PageProps {
  params: Promise<{ landmark: string }>
}

export async function generateStaticParams() {
  const { data: landmarks } = await supabase.from('landmarks').select('slug')
  return (landmarks || []).map((l) => ({ landmark: l.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { landmark: slug } = await params
  const { data: landmark } = await supabase
    .from('landmarks').select('name, area:areas(city:cities(name))').eq('slug', slug).single()

  if (!landmark) return { title: 'Landmark Not Found' }

  const cityName = (landmark.area as any)?.city?.name || 'Nigeria'
  const title = `Businesses Near ${landmark.name}, ${cityName} | MyHustle`
  const description = `Businesses near ${landmark.name}, ${cityName}. Find local services, read reviews, and book appointments on MyHustle.`
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.com/near/${slug}`,
    },
  }
}

export const revalidate = 3600
export const dynamicParams = true

export default async function LandmarkPage({ params }: PageProps) {
  const { landmark: slug } = await params

  const { data: landmark } = await supabase
    .from('landmarks').select('*, area:areas(*, city:cities(*))').eq('slug', slug).single()

  if (!landmark) notFound()

  // Fetch businesses in the same area as the landmark
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('area_id', landmark.area_id)
    .eq('active', true)
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })

  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  // Get parent categories for filter links
  const { data: parentCats } = await supabase
    .from('categories')
    .select('id, slug, name, icon, parent_id')
    .is('parent_id', null)
    .order('name')

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Businesses Near ${landmark.name}`,
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

  const landmarkTypeEmoji: Record<string, string> = {
    mall: '🏬', market: '🏪', hotel: '🏨', hospital: '🏥',
    university: '🎓', airport: '✈️', church: '⛪', mosque: '🕌',
    stadium: '🏟️', park: '🌳',
  }

  return (
    <div>
      <JsonLd data={itemListJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.com' },
          { name: 'Near', url: 'https://myhustle.com' },
          { name: landmark.name, url: `https://myhustle.com/near/${slug}` },
        ]}
      />

      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Near', href: '#' },
              { label: landmark.name },
            ]}
          />
          <div className="flex items-center gap-3 mt-4">
            <span className="text-5xl">{landmarkTypeEmoji[landmark.type] || '📍'}</span>
            <div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold">
                Businesses Near <span className="text-hustle-amber">{landmark.name}</span>
              </h1>
              <p className="text-blue-200 text-lg mt-2">
                {landmark.area?.name && `${landmark.area.name}${(landmark.area as any)?.city?.name ? `, ${(landmark.area as any).city.name}` : ''}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter */}
        {parentCats && parentCats.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              {parentCats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/near/${slug}/${cat.slug}`}
                  className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm hover:border-hustle-amber hover:shadow-sm transition-all"
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  <span className="font-medium text-hustle-dark">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold mb-6">
            All Businesses Near {landmark.name}
            <span className="text-hustle-muted text-lg font-normal ml-2">({bizList.length})</span>
          </h2>
          <BusinessGrid
            businesses={bizList}
            emptyTitle={`Nothing near ${landmark.name} yet`}
            emptyMessage={`Know a business near ${landmark.name}? Tell them to list on MyHustle!`}
          />
        </div>

        {landmark.area && (
          <div className="bg-hustle-light rounded-xl p-6 text-center">
            <p className="text-hustle-muted mb-2">Explore more in this area</p>
            <Link
              href={`/${(landmark.area as any)?.city?.slug || 'lagos'}/${landmark.area.slug}`}
              className="text-hustle-blue font-semibold hover:text-hustle-amber transition-colors"
            >
              View all businesses in {landmark.area.name} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
