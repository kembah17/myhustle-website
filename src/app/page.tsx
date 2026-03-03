import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import BusinessCard from '@/components/BusinessCard'
import JsonLd from '@/components/JsonLd'
import type { Category, Business, Area, Review } from '@/lib/types'

export const revalidate = 3600 // revalidate every hour

async function getHomePageData() {
  const supabase = createServiceClient()

  // Get parent categories
  const { data: parentCategories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')

  // Get all businesses to compute counts
  const { data: allBusinesses } = await supabase
    .from('businesses')
    .select('id, category_id, area_id')
    .eq('active', true)

  // Get all categories (including children) for count mapping
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, parent_id')

  // Build category count map (parent counts include children)
  const catCountMap: Record<string, number> = {}
  if (allBusinesses && allCategories) {
    // Map child category -> parent category
    const childToParent: Record<string, string> = {}
    for (const cat of allCategories) {
      if (cat.parent_id) {
        childToParent[cat.id] = cat.parent_id
      }
    }
    for (const biz of allBusinesses) {
      const catId = biz.category_id
      // Count for the direct category
      catCountMap[catId] = (catCountMap[catId] || 0) + 1
      // Also count for parent
      if (childToParent[catId]) {
        catCountMap[childToParent[catId]] = (catCountMap[childToParent[catId]] || 0) + 1
      }
    }
  }

  // Attach counts to parent categories
  const categoriesWithCounts = (parentCategories || []).map(cat => ({
    ...cat,
    business_count: catCountMap[cat.id] || 0,
  }))

  // Get featured/recent businesses with relations
  const { data: featuredBusinesses } = await supabase
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Get areas with business counts
  const { data: areas } = await supabase
    .from('areas')
    .select('id, slug, name')
    .order('name')

  const areaCountMap: Record<string, number> = {}
  if (allBusinesses) {
    for (const biz of allBusinesses) {
      if (biz.area_id) {
        areaCountMap[biz.area_id] = (areaCountMap[biz.area_id] || 0) + 1
      }
    }
  }

  // Sort areas by business count (most first), take top 12
  const areasWithCounts = (areas || [])
    .map(area => ({ ...area, business_count: areaCountMap[area.id] || 0 }))
    .sort((a, b) => b.business_count - a.business_count)
    .slice(0, 12)

  return {
    categories: categoriesWithCounts,
    businesses: (featuredBusinesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[],
    areas: areasWithCounts,
  }
}

export default async function HomePage() {
  const { categories, businesses, areas } = await getHomePageData()

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyHustle.com',
    url: 'https://myhustle.com',
    description: 'Nigeria\'s #1 SME Directory. Get Found. Get Booked. Get Paid.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://myhustle.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div>
      <JsonLd data={websiteJsonLd} />

      {/* Hero Section */}
      <section className="bg-hustle-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Find &amp; Book Local{' '}
            <span className="text-hustle-amber">Businesses</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Get Found. Get Booked. Get Paid.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-hustle-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            Browse by Category
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            Discover top-rated businesses across Lagos in fashion, beauty, events, photography, and dining.
          </p>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Featured Businesses */}
      {businesses.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-heading text-3xl font-bold">Featured Businesses</h2>
                <p className="text-hustle-muted mt-2">Recently listed and top-rated businesses in Lagos</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Areas */}
      {areas.length > 0 && (
        <section className="py-16 bg-hustle-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-center mb-4">
              Popular Areas in Lagos
            </h2>
            <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
              Browse businesses by location across Lagos
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/lagos/${area.slug}`}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                >
                  <h3 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-sm text-hustle-muted mt-1">
                    {area.business_count} {area.business_count === 1 ? 'business' : 'businesses'}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/lagos"
                className="inline-block text-hustle-blue font-semibold hover:text-hustle-amber transition-colors"
              >
                View all areas →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-hustle-sunset text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Own a Business in Lagos?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerian SMEs already getting discovered on MyHustle.
          </p>
          <Link
            href="/list-business"
            className="inline-block bg-white text-hustle-sunset px-8 py-4 rounded-lg text-lg font-bold hover:bg-hustle-light transition-colors"
          >
            List Your Business — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  )
}
