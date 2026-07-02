import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import DataFreshness from '@/components/DataFreshness'
import type { Metadata } from 'next'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Top Businesses Across Nigeria — MyHustle Rankings',
  description: 'Browse the top-rated businesses across Nigeria by category and city. Compare listings, read reviews, and find the best services on MyHustle.',
  alternates: { canonical: 'https://myhustle.space/top' },
}

interface CityWithCount {
  id: string
  name: string
  slug: string
  count: number
}

interface CategoryWithCount {
  id: string
  name: string
  slug: string
  count: number
}

export default async function TopIndexPage() {
  const supabase = getSupabase()

  // Fetch all cities (only ~39)
  const { data: cities } = await supabase.from('cities').select('id, name, slug')

  // Fetch parent categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .is('parent_id', null)

  // Get counts per city in parallel
  const cityCountPromises = (cities || []).map(async (city): Promise<CityWithCount> => {
    const { count } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id)
      .eq('active', true)
    return { ...city, count: count || 0 }
  })
  const citiesWithCounts = await Promise.all(cityCountPromises)
  const topCities = citiesWithCounts.sort((a, b) => b.count - a.count).slice(0, 12)

  // Get counts per parent category in parallel
  const catCountPromises = (categories || []).map(async (cat): Promise<CategoryWithCount> => {
    const { count } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', cat.id)
      .eq('active', true)
    return { ...cat, count: count || 0 }
  })
  const catsWithCounts = await Promise.all(catCountPromises)
  const topCategories = catsWithCounts.sort((a, b) => b.count - a.count).slice(0, 15)

  const totalBusinesses = citiesWithCounts.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.space' },
          { name: 'Top Businesses', url: 'https://myhustle.space/top' },
        ]}
      />

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Top Businesses' },
        ]}
      />

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-hustle-dark mt-4 mb-3">
        Top Businesses Across Nigeria — MyHustle Rankings
      </h1>

      <p className="text-gray-600 mb-2">
        Explore the best businesses across Nigeria&apos;s major cities. Our rankings highlight
        businesses with the most complete profiles, verified contact details, and customer reviews.
      </p>

      <DataFreshness count={totalBusinesses} label="businesses across Nigeria" />

      {/* Top Cities Section */}
      <section className="mt-10">
        <h2 className="text-xl font-heading font-bold text-hustle-dark mb-4">
          Browse by City
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {topCities.map((city) => (
            <div key={city.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-green-300 transition-all">
              <h3 className="font-semibold text-hustle-dark">{city.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{city.count.toLocaleString()} businesses</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {topCategories.slice(0, 3).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/top/${cat.slug}/${city.slug}`}
                    className="text-xs text-green-600 hover:text-green-800 hover:underline"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="mt-10">
        <h2 className="text-xl font-heading font-bold text-hustle-dark mb-4">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {topCategories.map((cat) => (
            <div key={cat.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-green-300 transition-all">
              <h3 className="font-semibold text-hustle-dark">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.count.toLocaleString()} businesses nationwide</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {topCities.slice(0, 4).map((city) => (
                  <Link
                    key={city.id}
                    href={`/top/${cat.slug}/${city.slug}`}
                    className="inline-block px-2 py-0.5 bg-gray-100 hover:bg-green-100 text-xs text-gray-600 hover:text-green-700 rounded transition-colors"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="mt-10">
        <h2 className="text-xl font-heading font-bold text-hustle-dark mb-4">
          Popular Searches
        </h2>
        <div className="flex flex-wrap gap-2">
          {topCategories.slice(0, 8).flatMap((cat) =>
            topCities.slice(0, 4).map((city) => (
              <Link
                key={`${cat.slug}-${city.slug}`}
                href={`/top/${cat.slug}/${city.slug}`}
                className="inline-block px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-green-50 hover:border-green-300 text-sm text-gray-700 hover:text-green-700 rounded-lg transition-colors"
              >
                Top {cat.name} in {city.name}
              </Link>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <h2 className="text-lg font-heading font-bold text-green-800 mb-2">
          Want your business to rank higher?
        </h2>
        <p className="text-green-700 mb-4">
          Complete your MyHustle profile — add photos, hours, and contact details to improve your ranking.
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
