import { createServiceClient } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import SearchBar from '@/components/SearchBar'
import type { Metadata } from 'next'
import type { Business, Category, Area, Review } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q, category } = await searchParams
  const parts = ['Search']
  if (q) parts.push(q)
  if (category) parts.push(category)
  const title = `${parts.join(' — ')} | MyHustle`
  return { title, robots: { index: false } }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', category: catSlug = '' } = await searchParams
  const supabase = createServiceClient()

  let query = supabase
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('active', true)

  // Filter by category if provided
  if (catSlug) {
    const { data: cat } = await supabase
      .from('categories').select('id, parent_id').eq('slug', catSlug).single()
    if (cat) {
      const isParent = !cat.parent_id
      if (isParent) {
        const { data: children } = await supabase
          .from('categories').select('id').eq('parent_id', cat.id)
        const ids = [cat.id, ...(children || []).map(c => c.id)]
        query = query.in('category_id', ids)
      } else {
        query = query.eq('category_id', cat.id)
      }
    }
  }

  // Text search
  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`)
  }

  query = query.order('verified', { ascending: false }).order('created_at', { ascending: false }).limit(50)

  const { data: businesses } = await query
  const bizList = (businesses || []) as (Business & { category: Category; area: Area; reviews: Review[] })[]

  return (
    <div>
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search Results' }]} />
          <h1 className="font-heading text-3xl md:text-4xl font-bold mt-4">
            {q ? `Results for "${q}"` : 'Search Businesses'}
          </h1>
          <div className="mt-6">
            <SearchBar initialQuery={q} initialCategory={catSlug} variant="compact" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-hustle-muted mb-6">{bizList.length} result{bizList.length !== 1 ? 's' : ''} found</p>
        <BusinessGrid
          businesses={bizList}
          emptyTitle="No results found"
          emptyMessage="Try a different search term or browse by category."
        />
      </div>
    </div>
  )
}
