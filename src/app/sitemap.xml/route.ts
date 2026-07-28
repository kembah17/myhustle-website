import { NextResponse } from 'next/server'
import { fetchQualityBusinessSlugs } from '@/lib/sitemap-quality'

export const revalidate = 86400 // 24 hours

const BASE_URL = 'https://myhustle.space'
const BUSINESSES_PER_PAGE = 5000

export async function GET() {
  let qualityBusinessCount = 0

  try {
    // Count quality-eligible businesses (cached by ISR)
    const qualified = await fetchQualityBusinessSlugs()
    qualityBusinessCount = qualified.length
  } catch (e) {
    console.error('Sitemap index: error counting quality businesses', e)
  }

  const businessPages = Math.ceil(qualityBusinessCount / BUSINESSES_PER_PAGE)

  const sitemaps = [
    `${BASE_URL}/sitemaps/static`,
    `${BASE_URL}/sitemaps/cities`,
    `${BASE_URL}/sitemaps/categories`,
    `${BASE_URL}/sitemaps/landmarks`,
    `${BASE_URL}/sitemaps/top`,
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
