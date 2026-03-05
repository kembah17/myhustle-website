import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Business, Category, Area, Review } from '@/lib/types'
import SearchImpressionTracker from '@/components/analytics/SearchImpressionTracker'

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; area?: string; sort?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q, category, area } = await searchParams
  const parts = ['Search']
  if (q) parts.push(q)
  if (category) parts.push(category)
  if (area) parts.push(area)
  const title = `${parts.join(' — ')} | MyHustle`
  const description = q
    ? `Search results for "${q}" on MyHustle. Find businesses across Nigeria.`
    : 'Search for businesses across Nigeria on MyHustle.'
  return {
    title,
    robots: { index: false },
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
  }
}

type BizWithRelations = Business & { category: Category; area: Area; reviews: Review[] }

export default async function SearchPage({ searchParams }: PageProps) {
  const {
    q = '',
    category: catSlug = '',
    area: areaSlug = '',
    sort = 'relevant',
  } = await searchParams

  let query = getSupabase()
    .from('businesses')
    .select('*, category:categories(*), area:areas(*), reviews(*)')
    .eq('active', true)

  // Filter by category
  let activeCategoryName = ''
  if (catSlug) {
    const { data: cat } = await getSupabase()
      .from('categories')
      .select('id, name, parent_id')
      .eq('slug', catSlug)
      .single()
    if (cat) {
      activeCategoryName = cat.name
      const isParent = !cat.parent_id
      if (isParent) {
        const { data: children } = await getSupabase()
          .from('categories')
          .select('id')
          .eq('parent_id', cat.id)
        const ids = [cat.id, ...(children || []).map((c) => c.id)]
        query = query.in('category_id', ids)
      } else {
        query = query.eq('category_id', cat.id)
      }
    }
  }

  // Filter by area
  let activeAreaName = ''
  if (areaSlug) {
    const { data: areaRow } = await getSupabase()
      .from('areas')
      .select('id, name')
      .eq('slug', areaSlug)
      .single()
    if (areaRow) {
      activeAreaName = areaRow.name
      query = query.eq('area_id', areaRow.id)
    }
  }

  // Text search
  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`)
  }

  // Apply sorting
  switch (sort) {
    case 'rating':
      // We'll sort client-side for rating since it's computed from reviews
      query = query.limit(100)
      break
    case 'newest':
      query = query.order('created_at', { ascending: false }).limit(50)
      break
    case 'az':
      query = query.order('name', { ascending: true }).limit(50)
      break
    case 'relevant':
    default:
      query = query
        .order('verified', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50)
      break
  }

  const { data: businesses } = await query
  let bizList = (businesses || []) as BizWithRelations[]

  // Client-side sort by average rating if needed
  if (sort === 'rating') {
    bizList = bizList
      .map((b) => {
        const reviews = b.reviews || []
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0
        return { ...b, _avgRating: avgRating }
      })
      .sort((a, b) => (b as typeof a & { _avgRating: number })._avgRating - (a as typeof a & { _avgRating: number })._avgRating)
      .slice(0, 50)
  }

  // Build active filters for pills
  const activeFilters: { label: string; removeUrl: string }[] = []
  const buildUrl = (overrides: Record<string, string>) => {
    const params = new URLSearchParams()
    const vals = { q, category: catSlug, area: areaSlug, sort, ...overrides }
    if (vals.q) params.set('q', vals.q)
    if (vals.category) params.set('category', vals.category)
    if (vals.area) params.set('area', vals.area)
    if (vals.sort && vals.sort !== 'relevant') params.set('sort', vals.sort)
    return `/search?${params.toString()}`
  }

  if (q) {
    activeFilters.push({ label: `"${q}"`, removeUrl: buildUrl({ q: '' }) })
  }
  if (catSlug && activeCategoryName) {
    activeFilters.push({
      label: activeCategoryName,
      removeUrl: buildUrl({ category: '' }),
    })
  }
  if (areaSlug && activeAreaName) {
    activeFilters.push({
      label: activeAreaName,
      removeUrl: buildUrl({ area: '' }),
    })
  }

  const sortLabels: Record<string, string> = {
    relevant: 'Most Relevant',
    rating: 'Highest Rated',
    newest: 'Newest',
    az: 'A-Z',
  }

  // Fetch suggestion categories and areas for empty state
  let suggestedCategories: Category[] = []
  let suggestedAreas: Area[] = []
  if (bizList.length === 0) {
    const [catRes, areaRes] = await Promise.all([
      getSupabase().from('categories').select('*').is('parent_id', null).order('name').limit(6),
      getSupabase().from('areas').select('*').order('name').limit(6),
    ])
    suggestedCategories = catRes.data || []
    suggestedAreas = areaRes.data || []
  }

  return (
    <div>
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search Results' }]} />
          <h1 className="font-heading text-3xl md:text-4xl font-bold mt-4">
            {q ? `Results for "${q}"` : 'Search Businesses'}
          </h1>
          <div className="mt-6">
            <SearchBar
              initialQuery={q}
              initialCategory={catSlug}
              initialArea={areaSlug}
              initialSort={sort}
              variant="compact"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-hustle-muted">Active filters:</span>
            {activeFilters.map((filter) => (
              <Link
                key={filter.label}
                href={filter.removeUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hustle-blue/10 text-hustle-blue text-sm font-medium hover:bg-hustle-blue/20 transition-colors"
              >
                {filter.label}
                <span className="text-hustle-blue/60 hover:text-hustle-blue">✕</span>
              </Link>
            ))}
            {activeFilters.length > 1 && (
              <Link
                href="/search"
                className="text-sm text-hustle-muted hover:text-hustle-dark underline"
              >
                Clear all
              </Link>
            )}
          </div>
        )}

        {/* Results count and sort info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-hustle-muted">
            {bizList.length} result{bizList.length !== 1 ? 's' : ''} found
          </p>
          {sort !== 'relevant' && (
            <p className="text-sm text-hustle-muted">
              Sorted by: <span className="font-medium text-hustle-dark">{sortLabels[sort] || sort}</span>
            </p>
          )}
        </div>

        {/* Results or empty state */}
        {bizList.length > 0 ? (
          <>
            <SearchImpressionTracker
              businessIds={bizList.map((b) => b.id)}
              query={q || catSlug || areaSlug || 'browse'}
            />
            <BusinessGrid businesses={bizList} />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="font-heading text-xl font-bold text-hustle-dark mb-2">
              No matches
            </h2>
            <p className="text-hustle-muted mb-8 max-w-md mx-auto">
              We couldn&apos;t find what you&apos;re looking for. Try different words or browse by category below.
            </p>

            {suggestedCategories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-hustle-muted mb-3">Try a category</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/search?category=${cat.slug}`}
                      className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-hustle-dark hover:border-hustle-blue hover:text-hustle-blue transition-colors"
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {suggestedAreas.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-hustle-muted mb-3">Try an area</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedAreas.map((area) => (
                    <Link
                      key={area.id}
                      href={`/search?area=${area.slug}`}
                      className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-hustle-dark hover:border-hustle-blue hover:text-hustle-blue transition-colors"
                    >
                      📍 {area.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
