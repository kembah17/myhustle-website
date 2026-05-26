import { getSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

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
  const start = page * PAGE_SIZE
  const end = start + PAGE_SIZE - 1

  try {
    // Quality filter: only include businesses with a name AND (address OR phone)
    // This filters out truly empty placeholder pages that Google marks as thin content
    const { data: businesses, error } = await getSupabase()
      .from('businesses')
      .select('slug, updated_at, created_at, name, address, phone')
      .eq('active', true)
      .not('name', 'is', null)
      .neq('name', '')
      .or('address.neq.,phone.neq.')
      .order('id', { ascending: true })
      .range(start, end)

    if (error) {
      console.error(`Businesses sitemap page ${page}: query error`, error)
    }

    if (businesses) {
      for (const biz of businesses) {
        // Use updated_at if available, fall back to created_at, then today
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
