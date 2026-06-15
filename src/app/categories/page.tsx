import { getSupabase } from '@/lib/supabase'
import CategoryGrid from '@/components/CategoryGrid'
import Breadcrumbs from '@/components/Breadcrumbs'
import JsonLd from '@/components/JsonLd'
import type { Metadata } from 'next'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Browse All Business Categories | MyHustle',
  description:
    'Explore all business categories on MyHustle. Find hair & beauty, food & dining, home services, technology, health, fashion, and more across Nigeria.',
  openGraph: {
    title: 'Browse All Business Categories | MyHustle',
    description:
      'Explore all business categories on MyHustle. Find trusted businesses across Nigeria by category.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse All Business Categories | MyHustle',
    description:
      'Explore all business categories on MyHustle. Find trusted businesses across Nigeria by category.',
  },
  alternates: {
    canonical: 'https://myhustle.space/categories',
  },
}

export default async function CategoriesPage() {
  // Get parent categories
  const { data: parentCategories } = await getSupabase()
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')

  // Get category counts via RPC
  const { data: categoryCounts } = await getSupabase().rpc('get_category_business_counts')

  // Get all categories (including children) for parent-child mapping
  const { data: allCategories } = await getSupabase()
    .from('categories')
    .select('id, parent_id')

  // Build category count map (parent counts include children)
  const catCountMap: Record<string, number> = {}
  if (categoryCounts && allCategories) {
    const childToParent: Record<string, string> = {}
    for (const cat of allCategories) {
      if (cat.parent_id) {
        childToParent[cat.id] = cat.parent_id
      }
    }
    for (const row of categoryCounts) {
      const catId = row.category_id
      const cnt = Number(row.count)
      catCountMap[catId] = (catCountMap[catId] || 0) + cnt
      if (childToParent[catId]) {
        catCountMap[childToParent[catId]] = (catCountMap[childToParent[catId]] || 0) + cnt
      }
    }
  }

  const categoriesWithCounts = (parentCategories || []).map(cat => ({
    ...cat,
    business_count: catCountMap[cat.id] || 0,
  }))

  const totalBusinesses = categoryCounts?.reduce((sum: number, r: any) => sum + Number(r.count), 0) || 0

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myhustle.space' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://myhustle.space/categories' },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={breadcrumbLd} />

      <Breadcrumbs items={[{ label: 'Categories' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-hustle-dark mb-3">
            Browse All Categories
          </h1>
          <p className="text-hustle-muted text-lg max-w-2xl mx-auto">
            Explore {categoriesWithCounts.length} categories with{' '}
            {totalBusinesses.toLocaleString()} businesses across Nigeria
          </p>
        </div>

        {/* Category Grid */}
        <CategoryGrid
          categories={categoriesWithCounts}
          basePath="/category"
          columns={4}
        />

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-heading text-xl font-semibold text-hustle-dark mb-2">
            Don't see your category?
          </h2>
          <p className="text-hustle-muted mb-4">
            We're always adding new categories. List your business and we'll find the right fit.
          </p>
          <a
            href="/list-your-business"
            className="inline-flex items-center gap-2 bg-hustle-amber text-hustle-dark px-6 py-3 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
          >
            List Your Business / Hustle
          </a>
        </div>
      </div>
    </div>
  )
}
