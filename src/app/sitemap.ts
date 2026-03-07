import { getSupabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://myhustle.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fetch all data in parallel - areas now include business counts
  const [citiesRes, areasRes, categoriesRes, businessesRes, landmarksRes] = await Promise.all([
    getSupabase().from('cities').select('slug'),
    getSupabase().from('areas').select('slug, city_id, city:cities(slug), businesses(count)'),
    getSupabase().from('categories').select('slug, parent_id'),
    getSupabase().from('businesses').select('slug, updated_at').eq('active', true),
    getSupabase().from('landmarks').select('slug'),
  ])

  // Log errors for debugging
  if (citiesRes.error) console.error('Sitemap: cities query error:', citiesRes.error)
  if (areasRes.error) console.error('Sitemap: areas query error:', areasRes.error)
  if (categoriesRes.error) console.error('Sitemap: categories query error:', categoriesRes.error)
  if (businessesRes.error) console.error('Sitemap: businesses query error:', businessesRes.error)
  if (landmarksRes.error) console.error('Sitemap: landmarks query error:', landmarksRes.error)

  const cities = citiesRes.data || []
  const areas = areasRes.data || []
  const categories = categoriesRes.data || []
  const businesses = businessesRes.data || []
  const landmarks = landmarksRes.data || []
  const parentCategories = categories.filter(c => !c.parent_id)

  console.log(`Sitemap: ${cities.length} cities, ${areas.length} areas, ${categories.length} categories, ${businesses.length} businesses, ${landmarks.length} landmarks`)

  const entries: MetadataRoute.Sitemap = []

  // Homepage
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  })

  // City index pages: /[city]
  for (const city of cities) {
    entries.push({
      url: `${BASE_URL}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  // Area pages: /[city]/[area] - differentiate priority by business count
  for (const area of areas) {
    const citySlug = (area.city as any)?.slug
    if (!citySlug) continue

    // Extract business count from the aggregated relation
    const bizCount = (area.businesses as any)?.[0]?.count ?? 0
    const hasBusinesses = bizCount > 0

    entries.push({
      url: `${BASE_URL}/${citySlug}/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: hasBusinesses ? 'weekly' : 'monthly',
      priority: hasBusinesses ? 0.8 : 0.5,
    })
  }

  // Category pages: /category/[slug]
  for (const cat of categories) {
    entries.push({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Area + Category combos: /[city]/[area]/[category]
  // ONLY for areas that have businesses
  for (const area of areas) {
    const citySlug = (area.city as any)?.slug
    if (!citySlug) continue

    const bizCount = (area.businesses as any)?.[0]?.count ?? 0
    if (bizCount === 0) continue // Skip empty areas for category combos

    for (const cat of parentCategories) {
      entries.push({
        url: `${BASE_URL}/${citySlug}/${area.slug}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  // Landmark pages: /near/[landmark]
  for (const lm of landmarks) {
    entries.push({
      url: `${BASE_URL}/near/${lm.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  // Landmark + Category: /near/[landmark]/[category]
  for (const lm of landmarks) {
    for (const cat of parentCategories) {
      entries.push({
        url: `${BASE_URL}/near/${lm.slug}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  // Business detail pages: /business/[slug]
  for (const biz of businesses) {
    entries.push({
      url: `${BASE_URL}/business/${biz.slug}`,
      lastModified: biz.updated_at ? new Date(biz.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  console.log(`Sitemap: Generated ${entries.length} total URLs`)
  return entries
}
