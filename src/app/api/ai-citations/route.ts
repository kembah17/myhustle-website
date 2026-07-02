import { NextResponse } from 'next/server'

const MONITOR_QUERIES = [
  'best business directory Nigeria',
  'find businesses in Lagos Nigeria',
  'Nigerian SME directory',
  'list my business Nigeria free',
  'top restaurants Lagos',
  'best hotels Abuja Nigeria',
  'business directory Africa',
  'myhustle Nigeria',
  'find plumber in Lagos',
  'best salon Abuja',
]

export async function GET() {
  return NextResponse.json({
    status: 'active',
    monitor_queries: MONITOR_QUERIES,
    instructions: 'Use these queries to periodically check AI engines (ChatGPT, Perplexity, Gemini, Google AI Overview) for MyHustle citations.',
    check_engines: [
      { name: 'ChatGPT', url: 'https://chat.openai.com' },
      { name: 'Perplexity', url: 'https://perplexity.ai' },
      { name: 'Google Gemini', url: 'https://gemini.google.com' },
      { name: 'Google AI Overview', url: 'https://google.com' },
    ],
    tracking_method: 'Manual check + log results as GA4 custom events via /api/analytics/track',
    created_at: '2026-07-02',
  })
}
