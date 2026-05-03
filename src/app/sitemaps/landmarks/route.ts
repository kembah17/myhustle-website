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
    const { data: landmarks, error } = await getSupabase()
      .from('landmarks')
      .select('slug')

    if (error) {
      console.error('Landmarks sitemap: query error', error)
    }

    if (landmarks) {
      for (const lm of landmarks) {
        urls.push(`  <url>
    <loc>${BASE_URL}/near/${escapeXml(lm.slug)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
      }
    }
  } catch (e) {
    console.error('Landmarks sitemap: unexpected error', e)
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
