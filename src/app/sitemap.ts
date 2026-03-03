import { createServiceClient } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://myhustle.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient()

  // Fetch all data in parallel
  const [areasRes, categoriesRes, businessesRes, landmarksRes] = await Promise.all([
    supabase.from('areas').select('slug, updated_at'),
    supabase.from('categories').select('slug, parent_id, updated_at'),
    supabase.from('businesses').select('slug, updated_at').eq('active', true),
    supabase.from('landmarks').select('slug, updated_at'),
  ])

  const areas = areasRes.data || []
  const categories = categoriesRes.data || []
  const businesses = businessesRes.data || []
  const landmarks = landmarksRes.data || []
  const parentCategories = categories.filter(c => !c.parent_id)

  const entries: MetadataRoute.Sitemap = []

  // Homepage
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  })

  // Lagos index
  entries.push({
    url: `${BASE_URL}/lagos`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  // Area pages: /lagos/[area]
  for (const area of areas) {
    entries.push({
      url: `${BASE_URL}/lagos/${area.slug}`,
      lastModified: area.updated_at ? new Date(area.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Category pages: /category/[slug]
  for (const cat of categories) {
    entries.push({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Area + Category combos: /lagos/[area]/[category]
  for (const area of areas) {
    for (const cat of parentCategories) {
      entries.push({
        url: `${BASE_URL}/lagos/${area.slug}/${cat.slug}`,
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
      lastModified: lm.updated_at ? new Date(lm.updated_at) : new Date(),
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

  return entries
}
