import { getSupabase } from '@/lib/supabase'
import { calculateQualityScore } from '@/lib/quality-score'

export interface SitemapBusiness {
  slug: string
  updated_at: string | null
  created_at: string
  description: string | null
  area_id: string | null
  website: string | null
  verified: boolean
  verification_tier: number | null
  cover_photo_url: string | null
}

/**
 * Fetch all quality-eligible businesses from the database.
 * Since PostgREST cannot filter by string length, we fetch all active
 * businesses with their scoring fields and filter in JS.
 * Results are cached via ISR (revalidate = 86400) at the route level.
 */
export async function fetchQualityBusinessSlugs(): Promise<SitemapBusiness[]> {
  const supabase = getSupabase()
  const allQualified: SitemapBusiness[] = []
  let offset = 0
  const batchSize = 5000

  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('slug, updated_at, created_at, description, area_id, website, verified, verification_tier, cover_photo_url')
      .eq('active', true)
      .order('id', { ascending: true })
      .range(offset, offset + batchSize - 1)

    if (error || !data || data.length === 0) break

    for (const biz of data as SitemapBusiness[]) {
      const { isIndexable } = calculateQualityScore({
        description: biz.description,
        area_id: biz.area_id,
        website: biz.website,
        // cover_photo_url on businesses table is a proxy for photos
        hasPhotos: !!biz.cover_photo_url,
        hasReviews: false, // Conservative: skip review joins for sitemap perf
        hasHours: false,   // Conservative: skip hours joins for sitemap perf
        isClaimed: !!(biz.verified || (biz.verification_tier && biz.verification_tier > 0)),
      })

      if (isIndexable) {
        allQualified.push(biz)
      }
    }

    if (data.length < batchSize) break
    offset += batchSize
  }

  return allQualified
}
