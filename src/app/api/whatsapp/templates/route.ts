/**
 * WhatsApp template management (admin-only).
 * GET  — List templates from DB.
 * POST — Sync templates from Meta.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getWhatsAppConfig, fetchTemplatesFromMeta } from '@/lib/whatsapp/meta-api'

async function checkAdmin(request: NextRequest) {
  const supabase = createServiceClient()
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' ? user : null
}

export async function GET(request: NextRequest) {
  const user = await checkAdmin(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('whatsapp_templates')
    .select('*')
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ templates: data || [] })
}

export async function POST(request: NextRequest) {
  const user = await checkAdmin(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = await getWhatsAppConfig()
  if (!config) {
    return NextResponse.json({ error: 'WhatsApp not configured' }, { status: 503 })
  }

  try {
    const metaTemplates = await fetchTemplatesFromMeta({
      wabaId: config.waba_id,
      accessToken: config.access_token,
    })

    const supabase = createServiceClient()
    let synced = 0

    for (const mt of metaTemplates) {
      const name = mt.name as string
      const { error } = await supabase
        .from('whatsapp_templates')
        .upsert(
          {
            name,
            category: (mt.category as string) || 'UTILITY',
            language: (mt.language as string) || 'en',
            status: (mt.status as string)?.toLowerCase() || 'approved',
            components: mt.components || [],
            meta_template_id: (mt.id as string) || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'name' },
        )

      if (!error) synced++
    }

    return NextResponse.json({ synced, total: metaTemplates.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
