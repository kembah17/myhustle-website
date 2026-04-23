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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { action, notes } = body

  if (!action || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action. Must be approve or reject.' }, { status: 400 })
  }

  const db = createServiceClient()

  // Get the claim first
  const { data: claim, error: claimError } = await db
    .from('claim_attempts')
    .select('*')
    .eq('id', id)
    .single()

  if (claimError || !claim) {
    return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
  }

  if (action === 'approve') {
    // Update claim status
    const { error: updateError } = await db
      .from('claim_attempts')
      .update({
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        notes: notes || null,
      })
      .eq('id', id)

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    // Update business user_id to assign ownership
    const { error: bizError } = await db
      .from('businesses')
      .update({ user_id: claim.user_id })
      .eq('id', claim.business_id)

    if (bizError) return NextResponse.json({ error: bizError.message }, { status: 500 })

    return NextResponse.json({ success: true, status: 'approved' })
  } else {
    // Reject
    const { error: updateError } = await db
      .from('claim_attempts')
      .update({
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        notes: notes || null,
      })
      .eq('id', id)

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
    return NextResponse.json({ success: true, status: 'rejected' })
  }
}
