import { supabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://myhustle.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Fetch all data in parallel - only businesses has updated_at
  const [citiesRes, areasRes, categoriesRes, businessesRes, landmarksRes] = await Promise.all([
    supabase.from('cities').select('slug'),
    supabase.from('areas').select('slug, city_id, city:cities(slug)'),
    supabase.from('categories').select('slug, parent_id'),
    supabase.from('businesses').select('slug, updated_at').eq('active', true),
    supabase.from('landmarks').select('slug'),
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

  // Area pages: /[city]/[area]
  for (const area of areas) {
    const citySlug = (area.city as any)?.slug
    if (!citySlug) continue
    entries.push({
      url: `${BASE_URL}/${citySlug}/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
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
  for (const area of areas) {
    const citySlug = (area.city as any)?.slug
    if (!citySlug) continue
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
