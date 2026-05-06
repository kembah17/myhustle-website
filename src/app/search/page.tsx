import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessGrid from '@/components/BusinessGrid'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Business, Category, Area, Review } from '@/lib/types'
import SearchImpressionTracker from '@/components/analytics/SearchImpressionTracker'
import SuggestWhatsApp from '@/components/SuggestWhatsApp'
import { expandSearchTerms, expandMultiWordQuery } from '@/lib/synonyms'
import { inferCategoryFromTerms } from '@/lib/category-inference'

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

/**
 * Check how many search terms match a business name or description.
 * Returns { nameMatches, descMatches } counts.
 */
function countTermMatches(
  biz: BizWithRelations,
  terms: string[]
): { nameMatches: number; descMatches: number } {
  const name = (biz.name || '').toLowerCase()
  const desc = (biz.description || '').toLowerCase()
  let nameMatches = 0
  let descMatches = 0
  for (const term of terms) {
    const t = term.toLowerCase()
    if (name.includes(t)) nameMatches++
    else if (desc.includes(t)) descMatches++
  }
  return { nameMatches, descMatches }
}

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
  let explicitCategoryFilter = false
  if (catSlug) {
    explicitCategoryFilter = true
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

  // Text search with synonym expansion + location detection + category inference
  let searchTermsUsed: string[] = []
  let isMultiTermSearch = false

  if (q) {
    // STEP 1: Detect location terms in query
    const queryWords = q.toLowerCase().trim().split(/\s+/)
    let detectedAreaId: string | null = null
    let detectedCityId: string | null = null
    const nonLocationWords: string[] = []

    // Check each word against areas and cities
    for (const word of queryWords) {
      if (word.length < 3) { nonLocationWords.push(word); continue }

      // Only check if no area filter already applied
      if (!areaSlug && !detectedAreaId) {
        // Try EXACT match first (e.g., 'Lekki' not 'Ibeju-Lekki')
        const { data: exactArea } = await getSupabase()
          .from('areas')
          .select('id, name')
          .ilike('name', word)
          .limit(1)
        if (exactArea && exactArea.length > 0) {
          detectedAreaId = exactArea[0].id
          activeAreaName = exactArea[0].name
          continue // Don't add to text search
        }
        // Fallback: partial match, prefer shortest name (most specific)
        const { data: partialAreas } = await getSupabase()
          .from('areas')
          .select('id, name')
          .ilike('name', `%${word}%`)
          .limit(5)
        if (partialAreas && partialAreas.length > 0) {
          // Sort by name length - shortest is most specific
          const best = partialAreas.sort((a, b) => a.name.length - b.name.length)[0]
          detectedAreaId = best.id
          activeAreaName = best.name
          continue // Don't add to text search
        }
      }

      // Check cities if no area found
      if (!areaSlug && !detectedAreaId && !detectedCityId) {
        const { data: cityMatch } = await getSupabase()
          .from('cities')
          .select('id, name')
          .ilike('name', word)
          .limit(1)
        if (cityMatch && cityMatch.length > 0) {
          detectedCityId = cityMatch[0].id
          continue
        }
      }

      nonLocationWords.push(word)
    }

    // Apply detected location filter
    if (detectedAreaId) {
      query = query.eq('area_id', detectedAreaId)
    } else if (detectedCityId) {
      query = query.eq('city_id', detectedCityId)
    }

    // STEP 2: Category Inference (Layer 1)
    // If no explicit category filter, try to infer from search terms
    if (!explicitCategoryFilter && nonLocationWords.length >= 1) {
      const inference = inferCategoryFromTerms(nonLocationWords)
      if ((inference.confidence === 'high' || inference.confidence === 'low') && inference.parentCategoryId) {
        // Apply parent category filter - get all subcategory IDs under this parent
        const { data: children } = await getSupabase()
          .from('categories')
          .select('id')
          .eq('parent_id', inference.parentCategoryId)
        const ids = [inference.parentCategoryId, ...(children || []).map((c) => c.id)]
        query = query.in('category_id', ids)
      }
    }

    // STEP 3: Expand remaining keywords through synonyms
    if (nonLocationWords.length > 0) {
      const searchText = nonLocationWords.join(' ')
      const searchTerms = expandMultiWordQuery(searchText)
      searchTermsUsed = searchTerms.slice(0, 15)
      isMultiTermSearch = nonLocationWords.length >= 2

      // Layer 2: Name Priority - search name with higher priority
      // We use OR conditions but will re-rank results after fetching
      const terms = searchTermsUsed
      const orConditions = terms
        .map((term) => {
          const escaped = term.replace(/[%_]/g, '\\$&')
          return `name.ilike.%${escaped}%,description.ilike.%${escaped}%`
        })
        .join(',')
      query = query.or(orConditions)
    }
  }

  // Apply sorting
  switch (sort) {
    case 'rating':
      query = query.limit(100)
      break
    case 'newest':
      query = query.order('created_at', { ascending: false }).limit(100)
      break
    case 'az':
      query = query.order('name', { ascending: true }).limit(100)
      break
    case 'relevant':
    default:
      query = query
        .order('verified', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100)
      break
  }

  const { data: businesses } = await query
  let bizList = (businesses || []) as BizWithRelations[]

  // POST-FETCH: Apply Layer 2 (Name Priority) and Layer 3 (Minimum Match Threshold)
  if (searchTermsUsed.length > 0 && bizList.length > 0) {
    // Score each business: name matches get 3x weight
    const scored = bizList.map((biz) => {
      const { nameMatches, descMatches } = countTermMatches(biz, searchTermsUsed)
      const score = nameMatches * 3 + descMatches
      return { biz, nameMatches, descMatches, score, totalMatches: nameMatches + descMatches }
    })

    // Layer 3: Minimum Match Threshold
    // For multi-term searches, require at least 2 terms to match total
    // (either in name or description)
    let filtered = scored
    if (isMultiTermSearch) {
      filtered = scored.filter((item) => {
        // If it matches in the name at all, keep it (name match = high relevance)
        if (item.nameMatches >= 1) return true
        // For description-only matches, require 2+ terms
        return item.totalMatches >= 2
      })
      // If filtering removed everything, fall back to all results
      if (filtered.length === 0) filtered = scored
    }

    // Layer 2: Sort by score (name matches prioritized)
    if (sort === 'relevant') {
      filtered.sort((a, b) => {
        // Primary: score (name matches weighted 3x)
        if (b.score !== a.score) return b.score - a.score
        // Secondary: verified businesses first
        if (b.biz.verified !== a.biz.verified) return b.biz.verified ? 1 : -1
        return 0
      })
    }

    bizList = filtered.map((item) => item.biz).slice(0, 50)
  } else {
    bizList = bizList.slice(0, 50)
  }

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

            <div className="mt-8 max-w-md mx-auto">
              <SuggestWhatsApp type="general" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
