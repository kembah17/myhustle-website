import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { INDEX_THRESHOLD } from '@/lib/quality-score'

export const revalidate = 86400 // 24 hours

const BASE_URL = 'https://myhustle.space'
const BUSINESSES_PER_PAGE = 5000

export async function GET() {
  let totalIndexableBusinesses = 0

  try {
    // Try using quality_score column first (fast path)
    const { count, error } = await getSupabase()
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)
      .gte('quality_score', INDEX_THRESHOLD)

    if (!error && count !== null) {
      totalIndexableBusinesses = count
    } else {
      // Fallback: count businesses that likely meet quality threshold
      // Use a rough approximation based on fields we can filter on
      // (description length can't be filtered via REST, so count all active
      // and let the business sitemap route handle exact filtering)
      const { count: fallbackCount } = await getSupabase()
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)

      // Estimate ~20% are indexable based on our analysis
      if (fallbackCount) {
        totalIndexableBusinesses = Math.ceil(fallbackCount * 0.20)
      }
    }
  } catch (e) {
    console.error('Sitemap index: error counting businesses', e)
  }

  const businessPages = Math.ceil(totalIndexableBusinesses / BUSINESSES_PER_PAGE)

  const sitemaps = [
    `${BASE_URL}/sitemaps/static`,
    `${BASE_URL}/sitemaps/cities`,
    `${BASE_URL}/sitemaps/categories`,
    `${BASE_URL}/sitemaps/landmarks`,
  ]

  for (let i = 0; i < businessPages; i++) {
    sitemaps.push(`${BASE_URL}/sitemaps/businesses/${i}`)
  }

  // If no businesses were counted (build time / error), add at least page 0
  if (businessPages === 0) {
    sitemaps.push(`${BASE_URL}/sitemaps/businesses/0`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  })
}
