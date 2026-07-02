import { NextResponse } from 'next/server'

export const revalidate = 86400

const BASE_URL = 'https://myhustle.space'

const STATIC_PAGES = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: '/cities', changefreq: 'weekly', priority: '0.8' },
  { path: '/categories', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/help', changefreq: 'monthly', priority: '0.4' },
  { path: '/tools', changefreq: 'monthly', priority: '0.6' },
  { path: '/tools/business-name-generator', changefreq: 'monthly', priority: '0.6' },
  { path: '/tools/cac-registration-guide', changefreq: 'monthly', priority: '0.6' },
  { path: '/pricing', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.3' },
  { path: '/terms', changefreq: 'monthly', priority: '0.3' },
]

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(p => `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  })
}
