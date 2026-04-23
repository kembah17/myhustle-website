import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'

async function getAuthUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface ImportState {
  name: string
  code?: string
  geo_zone?: string
}

interface ImportCity {
  name: string
  state?: string
  lat?: number
  lon?: number
}

interface ImportArea {
  name: string
  city: string
  lat?: number
  lon?: number
  description?: string
}

interface ImportLandmark {
  name: string
  city: string
  area?: string
  type?: string
  lat?: number
  lon?: number
  radius_km?: number
  description?: string
}

interface ImportData {
  states?: ImportState[]
  cities?: ImportCity[]
  areas?: ImportArea[]
  landmarks?: ImportLandmark[]
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: ImportData
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const db = createServiceClient()
  const summary = {
    states: { inserted: 0, skipped: 0 },
    cities: { inserted: 0, skipped: 0 },
    areas: { inserted: 0, skipped: 0 },
    landmarks: { inserted: 0, skipped: 0 },
    errors: [] as string[],
  }

  // Import states
  if (body.states && Array.isArray(body.states)) {
    for (const s of body.states) {
      if (!s.name) { summary.errors.push(`State missing name`); continue }
      const slug = slugify(s.name.replace(/\s*state$/i, ''))
      const { error } = await db.from('states').upsert(
        { slug, name: s.name, code: s.code || null, geo_zone: s.geo_zone || null },
        { onConflict: 'slug' }
      )
      if (error) { summary.errors.push(`State "${s.name}": ${error.message}`); summary.states.skipped++ }
      else summary.states.inserted++
    }
  }

  // Build state lookup
  const { data: allStates } = await db.from('states').select('id, name')
  const stateMap = new Map((allStates || []).map(s => [s.name.toLowerCase(), s.id]))

  // Import cities
  if (body.cities && Array.isArray(body.cities)) {
    for (const c of body.cities) {
      if (!c.name) { summary.errors.push(`City missing name`); continue }
      const slug = slugify(c.name)
      const stateId = c.state ? (stateMap.get(c.state.toLowerCase()) || null) : null
      const { error } = await db.from('cities').upsert(
        {
          slug, name: c.name,
          state: c.state || '',
          state_id: stateId,
          country: 'Nigeria',
          lat: c.lat || 0, lon: c.lon || 0,
        },
        { onConflict: 'slug' }
      )
      if (error) { summary.errors.push(`City "${c.name}": ${error.message}`); summary.cities.skipped++ }
      else summary.cities.inserted++
    }
  }

  // Build city lookup
  const { data: allCities } = await db.from('cities').select('id, name')
  const cityMap = new Map((allCities || []).map(c => [c.name.toLowerCase(), c.id]))

  // Import areas
  if (body.areas && Array.isArray(body.areas)) {
    for (const a of body.areas) {
      if (!a.name || !a.city) { summary.errors.push(`Area "${a.name || 'unknown'}" missing name or city`); continue }
      const cityId = cityMap.get(a.city.toLowerCase())
      if (!cityId) { summary.errors.push(`Area "${a.name}": city "${a.city}" not found`); summary.areas.skipped++; continue }
      const slug = slugify(a.name)
      const { error } = await db.from('areas').upsert(
        {
          slug, name: a.name, city_id: cityId,
          lat: a.lat || 0, lon: a.lon || 0,
          description: a.description || null,
        },
        { onConflict: 'slug' }
      )
      if (error) { summary.errors.push(`Area "${a.name}": ${error.message}`); summary.areas.skipped++ }
      else summary.areas.inserted++
    }
  }

  // Build area lookup
  const { data: allAreas } = await db.from('areas').select('id, name')
  const areaMap = new Map((allAreas || []).map(a => [a.name.toLowerCase(), a.id]))

  // Import landmarks
  if (body.landmarks && Array.isArray(body.landmarks)) {
    for (const l of body.landmarks) {
      if (!l.name || !l.city) { summary.errors.push(`Landmark "${l.name || 'unknown'}" missing name or city`); continue }
      const cityId = cityMap.get(l.city.toLowerCase())
      if (!cityId) { summary.errors.push(`Landmark "${l.name}": city "${l.city}" not found`); summary.landmarks.skipped++; continue }
      const areaId = l.area ? (areaMap.get(l.area.toLowerCase()) || null) : null
      const slug = slugify(l.name)
      const { error } = await db.from('landmarks').upsert(
        {
          slug, name: l.name, city_id: cityId,
          area_id: areaId,
          lat: l.lat || 0, lon: l.lon || 0,
          type: l.type || 'general',
          radius_km: l.radius_km || 1.0,
          aliases: [],
          description: l.description || null,
        },
        { onConflict: 'slug' }
      )
      if (error) { summary.errors.push(`Landmark "${l.name}": ${error.message}`); summary.landmarks.skipped++ }
      else summary.landmarks.inserted++
    }
  }

  return NextResponse.json(summary)
}
