import { NextResponse } from 'next/server'
import { fetchQualityBusinessSlugs } from '@/lib/sitemap-quality'

export const revalidate = 86400

const BASE_URL = 'https://myhustle.space'
const URLS_PER_PAGE = 5000

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
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
    const allQualified = await fetchQualityBusinessSlugs()

    // Paginate the qualified results
    const start = page * URLS_PER_PAGE
    const end = start + URLS_PER_PAGE
    const pageBusinesses = allQualified.slice(start, end)

    for (const biz of pageBusinesses) {
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
