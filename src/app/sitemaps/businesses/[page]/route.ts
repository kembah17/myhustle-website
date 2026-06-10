import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { calculateQualityScore, INDEX_THRESHOLD } from '@/lib/quality-score'

export const revalidate = 86400

const BASE_URL = 'https://myhustle.space'
const PAGE_SIZE = 5000

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Fetch sets of business IDs that have photos, reviews, or hours.
 * Used for quality score computation in sitemap generation.
 */
async function fetchQualitySignalSets() {
  const supabase = getSupabase()

  // Fetch distinct business IDs with photos
  const photoBizIds = new Set<string>()
  let offset = 0
  while (true) {
    const { data } = await supabase
      .from('business_photos')
      .select('business_id')
      .order('business_id')
      .range(offset, offset + 999)
    if (!data || data.length === 0) break
    for (const d of data) photoBizIds.add(d.business_id)
    offset += 1000
    if (data.length < 1000) break
  }

  // Fetch distinct business IDs with published reviews
  const reviewBizIds = new Set<string>()
  offset = 0
  while (true) {
    const { data } = await supabase
      .from('reviews')
      .select('business_id')
      .eq('status', 'published')
      .order('business_id')
      .range(offset, offset + 999)
    if (!data || data.length === 0) break
    for (const d of data) reviewBizIds.add(d.business_id)
    offset += 1000
    if (data.length < 1000) break
  }

  // Fetch distinct business IDs with hours
  const hoursBizIds = new Set<string>()
  offset = 0
  while (true) {
    const { data } = await supabase
      .from('business_hours')
      .select('business_id')
      .order('business_id')
      .range(offset, offset + 999)
    if (!data || data.length === 0) break
    for (const d of data) hoursBizIds.add(d.business_id)
    offset += 1000
    if (data.length < 1000) break
  }

  return { photoBizIds, reviewBizIds, hoursBizIds }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page: pageStr } = await params
  const page = parseInt(pageStr, 10)

  if (isNaN(page) || page < 0) {
    return new NextResponse('Invalid page', { status: 400 })
  }

  const urls: string[] = []

  try {
    // Check if quality_score column exists by trying to use it
    const { error: colCheck } = await getSupabase()
      .from('businesses')
      .select('quality_score')
      .limit(1)

    if (!colCheck) {
      // quality_score column exists — use it directly (fast path)
      const start = page * PAGE_SIZE
      const end = start + PAGE_SIZE - 1

      const { data: businesses, error } = await getSupabase()
        .from('businesses')
        .select('slug, updated_at, created_at')
        .eq('active', true)
        .gte('quality_score', INDEX_THRESHOLD)
        .order('id', { ascending: true })
        .range(start, end)

      if (!error && businesses) {
        for (const biz of businesses) {
          const dateStr = biz.updated_at || biz.created_at
          const lastmod = dateStr
            ? new Date(dateStr).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
          urls.push(`  <url>
    <loc>${BASE_URL}/business/${escapeXml(biz.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
        }
      }
    } else {
      // quality_score column doesn't exist yet — compute scores at runtime
      const { photoBizIds, reviewBizIds, hoursBizIds } = await fetchQualitySignalSets()

      // Fetch all active businesses with quality-relevant fields
      // We need to fetch ALL and filter, then paginate the results
      const allIndexable: { slug: string; updated_at: string | null; created_at: string }[] = []
      let offset = 0
      const BATCH = 1000

      while (true) {
        const { data: businesses } = await getSupabase()
          .from('businesses')
          .select('id, slug, updated_at, created_at, description, area_id, website, verified, verification_tier')
          .eq('active', true)
          .order('id', { ascending: true })
          .range(offset, offset + BATCH - 1)

        if (!businesses || businesses.length === 0) break

        for (const biz of businesses) {
          const score = calculateQualityScore({
            description: biz.description,
            area_id: biz.area_id,
            website: biz.website,
            hasPhotos: photoBizIds.has(biz.id),
            hasReviews: reviewBizIds.has(biz.id),
            hasHours: hoursBizIds.has(biz.id),
            isClaimed: biz.verified || (biz.verification_tier || 0) > 0,
          })

          if (score.isIndexable) {
            allIndexable.push({
              slug: biz.slug,
              updated_at: biz.updated_at,
              created_at: biz.created_at,
            })
          }
        }

        offset += BATCH
        if (businesses.length < BATCH) break
      }

      // Paginate the filtered results
      const start = page * PAGE_SIZE
      const pageItems = allIndexable.slice(start, start + PAGE_SIZE)

      for (const biz of pageItems) {
        const dateStr = biz.updated_at || biz.created_at
        const lastmod = dateStr
          ? new Date(dateStr).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        urls.push(`  <url>
    <loc>${BASE_URL}/business/${escapeXml(biz.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
      }
    }
  } catch (e) {
    console.error(`Businesses sitemap page ${page}: unexpected error`, e)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  })
}
