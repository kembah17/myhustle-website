import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// Haversine formula to calculate distance between two points in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '')
  const lon = parseFloat(searchParams.get('lon') || '')
  const limit = Math.min(parseInt(searchParams.get('limit') || '5', 10), 20)

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: 'Missing or invalid lat/lon parameters' },
      { status: 400 }
    )
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: 'lat must be between -90 and 90, lon between -180 and 180' },
      { status: 400 }
    )
  }

  try {
    const supabase = getSupabase()
    const { data: areas, error } = await supabase
      .from('areas')
      .select('id, slug, name, lat, lon, city:cities(name, slug)')

    if (error) {
      console.error('[nearby] Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch areas' },
        { status: 500 }
      )
    }

    if (!areas || areas.length === 0) {
      return NextResponse.json({ areas: [] })
    }

    // Calculate distances and sort
    const areasWithDistance = areas
      .filter((area) => area.lat != null && area.lon != null)
      .map((area) => ({
        id: area.id,
        slug: area.slug,
        name: area.name,
        lat: area.lat,
        lon: area.lon,
        city_name: (area.city as any)?.name || null,
        city_slug: (area.city as any)?.slug || null,
        distance_km: Math.round(haversineDistance(lat, lon, area.lat, area.lon) * 100) / 100,
      }))
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, limit)

    return NextResponse.json({ areas: areasWithDistance })
  } catch (err) {
    console.error('[nearby] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
