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

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'all'
  const claimed = searchParams.get('claimed') || 'all'

  const db = createServiceClient()
  let query = db
    .from('businesses')
    .select('*, category:categories!category_id(name), city:cities!city_id(name), area:areas!area_id(name)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  if (status === 'active') {
    query = query.eq('active', true)
  } else if (status === 'inactive') {
    query = query.eq('active', false)
  }
  if (claimed === 'claimed') {
    query = query.not('user_id', 'is', null)
  } else if (claimed === 'unclaimed') {
    query = query.is('user_id', null)
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count })
}
