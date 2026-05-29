import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const revalidate = 86400

const BASE_URL = 'https://myhustle.space'

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

  try {
    // Fetch all cities
    const { data: cities, error: citiesError } = await getSupabase()
      .from('cities')
      .select('id, slug')

    if (citiesError) {
      console.error('Cities sitemap: cities query error', citiesError)
    }

    // Build a city ID → slug lookup map for validation
    const cityIdToSlug = new Map<string, string>()
    if (cities) {
      for (const city of cities) {
        cityIdToSlug.set(city.id, city.slug)
        urls.push(`  <url>
    <loc>${BASE_URL}/${escapeXml(city.slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)
      }
    }

    // Fetch all areas with their city_id and city slug via join
    const { data: areas, error: areasError } = await getSupabase()
      .from('areas')
      .select('slug, city_id, city:cities(slug)')

    if (areasError) {
      console.error('Cities sitemap: areas query error', areasError)
    }

    if (areas) {
      let mismatchCount = 0
      for (const area of areas) {
        const joinedCitySlug = (area.city as any)?.slug
        if (!joinedCitySlug) continue

        // Validation: verify the area's city_id matches the joined city
        // This catches any data integrity issues where area.city_id
        // doesn't match the city it's being listed under
        const expectedCitySlug = cityIdToSlug.get(area.city_id)
        if (expectedCitySlug && expectedCitySlug !== joinedCitySlug) {
          mismatchCount++
          console.warn(
            `Cities sitemap: area "${area.slug}" has city_id pointing to "${expectedCitySlug}" ` +
            `but join resolved to "${joinedCitySlug}" - skipping`
          )
          continue
        }

        urls.push(`  <url>
    <loc>${BASE_URL}/${escapeXml(joinedCitySlug)}/${escapeXml(area.slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
      }

      if (mismatchCount > 0) {
        console.warn(`Cities sitemap: ${mismatchCount} area-city mismatches detected and skipped`)
      }
    }
  } catch (e) {
    console.error('Cities sitemap: unexpected error', e)
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
