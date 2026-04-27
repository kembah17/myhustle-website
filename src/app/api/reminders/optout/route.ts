import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { verifyOptOutToken } from '@/lib/reminders'

export const dynamic = 'force-dynamic'

/**
 * GET /api/reminders/optout?token=xxx
 * 
 * One-click unsubscribe endpoint.
 * Token is a signed user_id (HMAC-SHA256 with REMINDER_API_KEY).
 * Returns a simple HTML page confirming unsubscribe.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse(renderPage('Missing Token', 'No unsubscribe token provided. Please use the link from your email.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const userId = verifyOptOutToken(token)

  if (!userId) {
    return new NextResponse(renderPage('Invalid Link', 'This unsubscribe link is invalid or has expired. Please contact us at hello@myhustle.space if you need help.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  try {
    const supabase = createServiceClient()

    const { error } = await supabase
      .from('user_reminders')
      .update({ opted_out: true })
      .eq('user_id', userId)

    if (error) {
      console.error('[Reminders/OptOut] Update error:', error)
      return new NextResponse(renderPage('Something Went Wrong', 'We couldn\'t process your unsubscribe request. Please try again or contact us at hello@myhustle.space.', false), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    console.log(`[Reminders/OptOut] User ${userId} opted out`)

    return new NextResponse(renderPage('Unsubscribed Successfully', 'You\'ve been unsubscribed from MyHustle reminder emails. You won\'t receive any more messages from us about completing your listing.', true), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    console.error('[Reminders/OptOut] Error:', err)
    return new NextResponse(renderPage('Something Went Wrong', 'We couldn\'t process your request. Please contact us at hello@myhustle.space.', false), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}

function renderPage(title: string, message: string, success: boolean): string {
  const icon = success ? '\u2705' : '\u26A0\uFE0F'
  const accentColor = success ? '#10b981' : '#f59e0b'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - MyHustle</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 48px 32px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .icon { font-size: 48px; margin-bottom: 16px; }
    .brand {
      font-size: 20px;
      font-weight: 700;
      color: #1a56db;
      margin-bottom: 24px;
    }
    .brand .amber { color: #f59e0b; }
    h1 {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 12px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .accent-bar {
      width: 48px;
      height: 4px;
      background: ${accentColor};
      border-radius: 2px;
      margin: 0 auto 24px;
    }
    a.btn {
      display: inline-block;
      background: #1a56db;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s;
    }
    a.btn:hover { background: #1544b5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">My<span class="amber">Hustle</span></div>
    <div class="icon">${icon}</div>
    <div class="accent-bar"></div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://myhustle.space" class="btn">Go to MyHustle</a>
  </div>
</body>
</html>`
}
