import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const revalidate = 86400

const BASE_URL = 'https://myhustle.space'
const MIN_BUSINESSES = 5

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const urls: string[] = []
  const supabase = getSupabase()

  try {
    // Add the index page
    urls.push(`  <url>
    <loc>${BASE_URL}/top</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)

    // Get top cities by business count (only ~39 cities)
    const { data: cities } = await supabase.from('cities').select('id, slug')
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug')
      .is('parent_id', null)

    if (!cities || !categories) {
      console.error('Top sitemap: failed to fetch cities or categories')
      return buildResponse(urls)
    }

    // Get counts per city to find top 15 cities
    const cityCountPromises = cities.map(async (city) => {
      const { count } = await supabase
        .from('businesses')
        .select('id', { count: 'exact', head: true })
        .eq('city_id', city.id)
        .eq('active', true)
      return { ...city, count: count || 0 }
    })
    const citiesWithCounts = await Promise.all(cityCountPromises)
    const topCities = citiesWithCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)

    // For each top city × category combo, check if enough businesses exist
    const comboPromises = topCities.flatMap((city) =>
      categories.map(async (cat) => {
        const { count } = await supabase
          .from('businesses')
          .select('id', { count: 'exact', head: true })
          .eq('city_id', city.id)
          .eq('category_id', cat.id)
          .eq('active', true)
        return { citySlug: city.slug, catSlug: cat.slug, count: count || 0 }
      })
    )

    const combos = await Promise.all(comboPromises)

    for (const combo of combos) {
      if (combo.count >= MIN_BUSINESSES) {
        urls.push(`  <url>
    <loc>${BASE_URL}/top/${escapeXml(combo.catSlug)}/${escapeXml(combo.citySlug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`)
      }
    }
  } catch (e) {
    console.error('Top sitemap: unexpected error', e)
  }

  return buildResponse(urls)
}

function buildResponse(urls: string[]) {
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
