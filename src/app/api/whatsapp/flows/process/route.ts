/**
 * Cron endpoint to process active WhatsApp flows.
 * Should be called every 1-5 minutes by Vercel Cron or external scheduler.
 * Protected by API key.
 */

import { NextRequest, NextResponse } from 'next/server'
import { processActiveFlows } from '@/lib/whatsapp/flows'

export async function POST(request: NextRequest) {
  // Verify cron secret or API key
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || process.env.WHATSAPP_VERIFY_TOKEN

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await processActiveFlows()
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Processing failed'
    console.error('[flows/process] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Also support GET for Vercel Cron
export async function GET(request: NextRequest) {
  return POST(request)
}
