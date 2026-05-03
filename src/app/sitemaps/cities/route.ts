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
      .select('slug')

    if (citiesError) {
      console.error('Cities sitemap: cities query error', citiesError)
    }

    if (cities) {
      for (const city of cities) {
        urls.push(`  <url>
    <loc>${BASE_URL}/${escapeXml(city.slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)
      }
    }

    // Fetch all areas with their city slugs
    const { data: areas, error: areasError } = await getSupabase()
      .from('areas')
      .select('slug, city:cities(slug)')

    if (areasError) {
      console.error('Cities sitemap: areas query error', areasError)
    }

    if (areas) {
      for (const area of areas) {
        const citySlug = (area.city as any)?.slug
        if (!citySlug) continue
        urls.push(`  <url>
    <loc>${BASE_URL}/${escapeXml(citySlug)}/${escapeXml(area.slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
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
