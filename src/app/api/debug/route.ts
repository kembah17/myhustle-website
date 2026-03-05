import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results: Record<string, unknown> = {}
  
  // Check env vars
  results.env = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
  
  try {
    const supabase = getSupabase()
    
    // Test cities query
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id, slug, name')
    
    results.cities = { data: cities, error: citiesError }
    
    // Test areas query (limit 3)
    const { data: areas, error: areasError } = await supabase
      .from('areas')
      .select('id, slug, name')
      .limit(3)
    
    results.areas = { data: areas, error: areasError }
    
    // Test single city query (like the page does)
    const { data: lagos, error: lagosError } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', 'lagos')
      .single()
    
    results.lagosQuery = { data: lagos, error: lagosError }
    
  } catch (e: unknown) {
    results.exception = String(e)
  }
  
  return NextResponse.json(results, { status: 200 })
}
