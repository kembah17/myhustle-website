import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, createServiceClient } from '@/lib/supabase'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60_000 // 1 minute
  const maxRequests = 20

  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

// Clean up stale entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60_000)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { response: '', error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { businessId, message, conversationHistory = [] } = body as {
      businessId: string
      message: string
      conversationHistory: ChatMessage[]
    }

    if (!businessId || !message) {
      return NextResponse.json(
        { response: '', error: 'Missing businessId or message.' },
        { status: 400 }
      )
    }

    // Trim conversation history to last 10 messages
    const trimmedHistory = conversationHistory.slice(-10)

    // Fetch business data from Supabase

    const { data: business, error: bizError } = await getSupabase()
      .from('businesses')
      .select('*, category:categories(name), area:areas(name)')
      .eq('id', businessId)
      .single()

    if (bizError || !business) {
      return NextResponse.json(
        { response: '', error: 'Business not found.' },
        { status: 404 }
      )
    }

    // Fetch business hours
    const { data: hours } = await getSupabase()
      .from('business_hours')
      .select('*')
      .eq('business_id', businessId)

    // Fetch review stats
    const { data: reviews } = await getSupabase()
      .from('reviews')
      .select('rating')
      .eq('business_id', businessId)
      .eq('status', 'published')

    const reviewCount = reviews?.length || 0
    const avgRating = reviewCount > 0
      ? (reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : 'No ratings yet'

    // Format business hours for the prompt
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const hoursText = hours && hours.length > 0
      ? hours
          .sort((a, b) => a.day - b.day)
          .map(h => {
            const dayName = dayNames[h.day]
            if (h.closed) return `${dayName}: Closed`
            return `${dayName}: ${h.open_time?.slice(0, 5)} - ${h.close_time?.slice(0, 5)}`
          })
          .join('\n')
      : 'Business hours not specified'

    const categoryName = (business.category as { name: string } | null)?.name || 'Business'
    const areaName = (business.area as { name: string } | null)?.name || ''

    // Build system prompt
    const systemPrompt = `You are the AI receptionist for ${business.name}. You are warm, helpful, and professional — like a friendly Nigerian receptionist who genuinely wants to help visitors.

BUSINESS INFORMATION:
- Name: ${business.name}
- Category: ${categoryName}
- Description: ${business.description || 'Not provided'}
- Location: ${business.address || 'Not specified'}${areaName ? `, ${areaName}` : ''}
- Phone: ${business.phone || 'Not listed'}
- WhatsApp: ${business.whatsapp || 'Not listed'}
- Email: ${business.email || 'Not listed'}
- Website: ${business.website || 'Not listed'}
- Rating: ${avgRating}${reviewCount > 0 ? ` (${reviewCount} review${reviewCount > 1 ? 's' : ''})` : ''}

BUSINESS HOURS:
${hoursText}

YOUR PERSONALITY & RULES:
1. You are the receptionist for THIS business only. Speak as "we" and "our" when referring to the business.
2. Be warm and welcoming with occasional Nigerian English warmth (e.g., "You're welcome!" meaning "come in/you're appreciated").
3. Keep responses SHORT — 2-3 sentences maximum. This is for voice, so be concise.
4. Only share information that is provided above. NEVER make up services, prices, or details not in the data.
5. If asked something you don't know, say something like: "I don't have that information right now, but you can reach us directly to find out!"
6. If someone wants to book, suggest they use the booking form on this page.
7. Be naturally conversational, not robotic. You're a real receptionist, not a chatbot.
8. If greeted, respond warmly and ask how you can help.
9. Do not use markdown formatting, bullet points, or numbered lists — speak naturally as if talking.`

    // Build messages array for OpenRouter
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...trimmedHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: message },
    ]

    // Call OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://myhustle.com',
        'X-Title': 'MyHustle Voice Receptionist',
      },
      body: JSON.stringify({
        model: 'nvidia/llama-3.3-nemotron-super-49b-v1:free',
        messages,
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text()
      console.error('OpenRouter API error:', openRouterResponse.status, errorText)
      return NextResponse.json(
        { response: '', error: 'AI service is temporarily unavailable. Please try again.' },
        { status: 502 }
      )
    }

    const data = await openRouterResponse.json()
    const aiResponse = data.choices?.[0]?.message?.content || ''

    if (!aiResponse) {
      return NextResponse.json(
        { response: '', error: 'No response from AI. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Voice chat error:', error)
    return NextResponse.json(
      { response: '', error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
