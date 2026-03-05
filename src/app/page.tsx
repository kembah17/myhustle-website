import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import BusinessCard from '@/components/BusinessCard'
import JsonLd from '@/components/JsonLd'
import WhatsAppCTA from '@/components/WhatsAppCTA'
import type { Category, Business, Area, Review } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyHustle.com \u2014 Find & Book Trusted Businesses Across Nigeria',
  description:
    'Discover trusted businesses across Nigeria. Browse by city, area, category, or landmark. Read real reviews and book appointments directly.',
  openGraph: {
    title: 'MyHustle.com \u2014 Find & Book Trusted Businesses Across Nigeria',
    description:
      'Discover trusted businesses across Nigeria. Browse by city, area, category, or landmark.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyHustle.com \u2014 Find & Book Trusted Businesses Across Nigeria',
    description:
      'Discover trusted businesses across Nigeria. Browse by city, area, category, or landmark.',
  },
  alternates: {
    canonical: 'https://myhustle.com',
  },
}

export const revalidate = 3600

async function getHomePageData() {

  // Get cities
  const { data: cities } = await supabase
    .from('cities')
    .select('id, slug, name, state')
    .order('name')

  // Get parent categories
  const { data: parentCategories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')

  // Get all businesses to compute counts
  const { data: allBusinesses } = await supabase
    .from('businesses')
    .select('id, category_id, area_id, city_id')
    .eq('active', true)

  // Get all categories (including children) for count mapping
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, parent_id')

  // Build category count map (parent counts include children)
  const catCountMap: Record<string, number> = {}
  if (allBusinesses && allCategories) {
    const childToParent: Record<string, string> = {}
    for (const cat of allCategories) {
      if (cat.parent_id) {
        childToParent[cat.id] = cat.parent_id
      }
    }
    for (const biz of allBusinesses) {
      const catId = biz.category_id
      catCountMap[catId] = (catCountMap[catId] || 0) + 1
      if (childToParent[catId]) {
        catCountMap[childToParent[catId]] = (catCountMap[childToParent[catId]] || 0) + 1
      }
    }
  }

  const categoriesWithCounts = (parentCategories || []).map(cat => ({
    ...cat,
    business_count: catCountMap[cat.id] || 0,
  }))

  // Business counts per city
  const cityCountMap: Record<string, number> = {}
  if (allBusinesses) {
    for (const biz of allBusinesses) {
      if (biz.city_id) {
        cityCountMap[biz.city_id] = (cityCountMap[biz.city_id] || 0) + 1
      }
    }
  }

  const citiesWithCounts = (cities || []).map(city => ({
    ...city,
    business_count: cityCountMap[city.id] || 0,
  }))

  // Get featured/recent businesses with relations
  const { data: featuredBusinesses } = await supabase
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Get areas with business counts and city info
  const { data: areas } = await supabase
    .from('areas')
    .select('id, slug, name, city:cities(slug, name)')
    .order('name')

  const areaCountMap: Record<string, number> = {}
  if (allBusinesses) {
    for (const biz of allBusinesses) {
      if (biz.area_id) {
        areaCountMap[biz.area_id] = (areaCountMap[biz.area_id] || 0) + 1
      }
    }
  }

  const areasWithCounts = (areas || [])
    .map(area => ({
      ...area,
      business_count: areaCountMap[area.id] || 0,
      citySlug: (area.city as any)?.slug || 'lagos',
      cityName: (area.city as any)?.name || 'Lagos',
    }))
    .sort((a, b) => b.business_count - a.business_count)
    .slice(0, 12)

  return {
    cities: citiesWithCounts,
    categories: categoriesWithCounts,
    businesses: (featuredBusinesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[],
    areas: areasWithCounts,
  }
}

export default async function HomePage() {
  const { cities, categories, businesses, areas } = await getHomePageData()

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyHustle.com',
    url: 'https://myhustle.com',
    description: "Nigeria's trusted SME directory. Find and book businesses across Nigeria.",
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://myhustle.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyHustle.com',
    url: 'https://myhustle.com',
    logo: 'https://myhustle.com/logo-dark.png',
    description: "Nigeria's trusted SME directory",
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
  }

  return (
    <div>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />

      {/* Hero Section */}
      <section className="bg-hustle-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Find the Right Business in{' '}
            <span className="text-hustle-amber">Nigeria</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Get Found. Get Booked. Get Paid.
          </p>
          <SearchBar />
          <div className="mt-8">
            <WhatsAppCTA variant="hero" />
          </div>
        </div>
      </section>

      {/* City Selector */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-8">Explore by City</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cities.map(city => (
              <Link key={city.slug} href={`/${city.slug}`}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow text-center group">
                <h3 className="font-heading text-2xl font-bold text-hustle-blue group-hover:text-hustle-amber transition-colors">{city.name}</h3>
                <p className="text-hustle-muted mt-1 text-sm">{city.state}</p>
                <p className="text-hustle-muted mt-2">{city.business_count} {city.business_count === 1 ? 'business' : 'businesses'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - WhatsApp Onboarding */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            List Your Business in 3 Easy Steps
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            No forms, no stress. Just send us a WhatsApp message and we handle the rest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" width="32" height="32" style={{width:'32px',height:'32px',maxWidth:'32px',maxHeight:'32px',flexShrink:0}} viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="font-heading text-lg font-bold text-hustle-dark mb-2">1. Send a WhatsApp Message</div>
              <p className="text-hustle-muted text-sm">
                Tap the button below and tell us your business name. That&apos;s it — we&apos;ll take it from there.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-hustle-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" width="32" height="32" style={{width:'32px',height:'32px',maxWidth:'32px',maxHeight:'32px',flexShrink:0}} fill="none" stroke="#F59E0B" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <div className="font-heading text-lg font-bold text-hustle-dark mb-2">2. We Set Up Your Listing</div>
              <p className="text-hustle-muted text-sm">
                Our team creates your professional business page with all the details customers need to find you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-hustle-sunset/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" width="32" height="32" style={{width:'32px',height:'32px',maxWidth:'32px',maxHeight:'32px',flexShrink:0}} fill="none" stroke="#EA580C" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div className="font-heading text-lg font-bold text-hustle-dark mb-2">3. Start Getting Customers</div>
              <p className="text-hustle-muted text-sm">
                Your business shows up when people search. Get found, get booked, get paid — simple as that.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <WhatsAppCTA variant="inline" />
            <p className="text-hustle-muted text-sm mt-3">
              Or <Link href="/list-your-business" className="text-hustle-blue font-semibold hover:text-hustle-amber transition-colors underline">use our web form</Link> if you prefer
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-hustle-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            Browse by Category
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            Whatever you need, someone in Nigeria does it. Find them here.
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
                <p className="text-hustle-muted mt-2">Fresh on MyHustle — check them out</p>
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
              Popular Areas Across Nigeria
            </h2>
            <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
              Every area, every hustle. Pick your neighbourhood.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/${area.citySlug}/${area.slug}`}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
                >
                  <h3 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-xs text-hustle-muted mt-0.5">{area.cityName}</p>
                  <p className="text-sm text-hustle-muted mt-1">
                    {area.business_count} {area.business_count === 1 ? 'business' : 'businesses'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-hustle-sunset text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Own a Business in Nigeria?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your customers are searching for businesses like yours. Make sure they find you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WhatsAppCTA variant="inline" className="!bg-[#25D366] !hover:bg-[#1da851]" />
            <Link
              href="/list-your-business"
              className="inline-block bg-white text-hustle-sunset px-8 py-3 rounded-lg font-bold hover:bg-hustle-light transition-colors"
            >
              Use Web Form Instead
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
