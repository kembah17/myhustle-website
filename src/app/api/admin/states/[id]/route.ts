import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, createServiceClient } from '@/lib/supabase'
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
  const { data: { user } } = await getSupabase().auth.getUser()
  return user
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { name, code, geo_zone } = body
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const slug = slugify(name.replace(/\s*state$/i, ''))
  const db = createServiceClient()
  const { data, error } = await db.from('states').update({ slug, name, code: code || null, geo_zone: geo_zone || null }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServiceClient()
  const { error } = await db.from('states').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
