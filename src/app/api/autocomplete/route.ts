import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ businesses: [], categories: [], areas: [] })
  }

  const supabase = getSupabase()
  const pattern = `%${q}%`

  // Run all three queries in parallel
  const [bizRes, catRes, areaRes] = await Promise.all([
    // Business names — top 5 active matches
    supabase
      .from('businesses')
      .select('slug, name, category:categories(name, icon), area:areas(name), city:cities(name)')
      .eq('active', true)
      .ilike('name', pattern)
      .order('verified', { ascending: false })
      .order('name')
      .limit(5),

    // Categories — top 3 matches (parent categories first)
    supabase
      .from('categories')
      .select('slug, name, icon, parent_id')
      .ilike('name', pattern)
      .order('parent_id', { ascending: true, nullsFirst: true })
      .limit(3),

    // Areas with city — top 3 matches
    supabase
      .from('areas')
      .select('slug, name, city:cities(slug, name)')
      .ilike('name', pattern)
      .order('name')
      .limit(3),
  ])

  const businesses = (bizRes.data || []).map((b: any) => ({
    slug: b.slug,
    name: b.name,
    category: b.category?.name || null,
    categoryIcon: b.category?.icon || null,
    area: b.area?.name || null,
    city: b.city?.name || null,
  }))

  const categories = (catRes.data || []).map((c: any) => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon || null,
    isParent: c.parent_id === null,
  }))

  const areas = (areaRes.data || []).map((a: any) => ({
    slug: a.slug,
    name: a.name,
    citySlug: (a.city as any)?.slug || null,
    cityName: (a.city as any)?.name || null,
  }))

  return NextResponse.json(
    { businesses, categories, areas },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
