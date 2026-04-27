import { createServiceClient } from '@/lib/supabase'
import crypto from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserReminder {
  id: string
  user_id: string
  user_email: string
  user_phone: string | null
  user_name: string | null
  signup_date: string
  has_business: boolean
  reminder_day0_email: string | null
  reminder_day1_whatsapp: string | null
  reminder_day3_whatsapp: string | null
  reminder_day7_email: string | null
  reminder_day14_email: string | null
  reminder_day30_email: string | null
  opted_out: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type ReminderChannel = 'email' | 'whatsapp'

export interface PendingReminder {
  user: UserReminder
  reminderKey: keyof UserReminder
  day: number
  channel: ReminderChannel
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://myhustle.space'
const ONBOARDING_URL = `${BASE_URL}/dashboard/onboarding`

// Reminder schedule: [day, column, channel]
// Anti-spam: never WhatsApp + email on same day, max 6 messages over 30 days
const REMINDER_SCHEDULE: Array<[number, keyof UserReminder, ReminderChannel]> = [
  [0,  'reminder_day0_email',      'email'],
  [1,  'reminder_day1_whatsapp',   'whatsapp'],
  [3,  'reminder_day3_whatsapp',   'whatsapp'],
  [7,  'reminder_day7_email',      'email'],
  [14, 'reminder_day14_email',     'email'],
  [30, 'reminder_day30_email',     'email'],
]

// ─── Opt-out Token ───────────────────────────────────────────────────────────

const OPT_OUT_SECRET = process.env.REMINDER_API_KEY || 'myhustle-reminder-default-secret'

export function generateOptOutToken(userId: string): string {
  const hmac = crypto.createHmac('sha256', OPT_OUT_SECRET)
  hmac.update(userId)
  return `${userId}.${hmac.digest('hex').slice(0, 16)}`
}

export function verifyOptOutToken(token: string): string | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [userId, sig] = parts
  const hmac = crypto.createHmac('sha256', OPT_OUT_SECRET)
  hmac.update(userId)
  const expected = hmac.digest('hex').slice(0, 16)
  if (sig !== expected) return null
  return userId
}

export function getOptOutUrl(userId: string): string {
  const token = generateOptOutToken(userId)
  return `${BASE_URL}/api/reminders/optout?token=${encodeURIComponent(token)}`
}

// ─── Brevo Email Sending ─────────────────────────────────────────────────────

interface BrevoEmailParams {
  to: string
  toName?: string
  subject: string
  htmlContent: string
}

export async function sendBrevoEmail(params: BrevoEmailParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('[Reminders] BREVO_API_KEY not set — skipping email send to', params.to)
    return false
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'MyHustle', email: 'hello@myhustle.space' },
        to: [{ email: params.to, name: params.toName || params.to }],
        subject: params.subject,
        htmlContent: params.htmlContent,
        headers: {
          'List-Unsubscribe': `<${BASE_URL}/api/reminders/optout>`,
        },
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[Reminders] Brevo API error:', res.status, body)
      return false
    }

    return true
  } catch (err) {
    console.error('[Reminders] Brevo send failed:', err)
    return false
  }
}

// ─── WhatsApp Cloud API Sending ──────────────────────────────────────────────

export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    console.warn('[Reminders] WhatsApp env vars not set — skipping WhatsApp send to', phone)
    return false
  }

  // Normalize phone: ensure it starts with country code without +
  const normalizedPhone = phone.replace(/^\+/, '').replace(/\s/g, '')

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: normalizedPhone,
          type: 'text',
          text: { preview_url: true, body: message },
        }),
      }
    )

    if (!res.ok) {
      const body = await res.text()
      console.error('[Reminders] WhatsApp API error:', res.status, body)
      return false
    }

    return true
  } catch (err) {
    console.error('[Reminders] WhatsApp send failed:', err)
    return false
  }
}

// ─── Email Templates ─────────────────────────────────────────────────────────

function emailWrapper(content: string, unsubscribeUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: #1a56db; padding: 24px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
  .header .amber { color: #f59e0b; }
  .content { padding: 32px 24px; color: #333333; line-height: 1.6; }
  .content h2 { color: #1a56db; margin-top: 0; }
  .cta-btn { display: inline-block; background: #f59e0b; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 16px 0; }
  .footer { padding: 24px; text-align: center; color: #999999; font-size: 12px; border-top: 1px solid #eeeeee; }
  .footer a { color: #999999; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>My<span class="amber">Hustle</span></h1></div>
  <div class="content">${content}</div>
  <div class="footer">
    <p>MyHustle &mdash; Nigeria&rsquo;s Business Directory</p>
    <p><a href="${unsubscribeUrl}">Unsubscribe from these emails</a></p>
  </div>
</div>
</body>
</html>`
}

export function getDay0Email(name: string, unsubscribeUrl: string): { subject: string; html: string } {
  const displayName = name || 'there'
  return {
    subject: 'Welcome to MyHustle! \uD83C\uDF89 Your customers are searching',
    html: emailWrapper(`
      <h2>Welcome to MyHustle, ${displayName}! \uD83C\uDF89</h2>
      <p>Thanks for joining Nigeria&rsquo;s fastest-growing business directory.</p>
      <p>Every day, customers search for businesses like yours on MyHustle. Right now, they can&rsquo;t find you &mdash; but that changes in <strong>just 2 minutes</strong>.</p>
      <p><strong>Here&rsquo;s what your free listing gets you:</strong></p>
      <ul>
        <li>\u2705 Your business visible to thousands of local customers</li>
        <li>\u2705 Direct calls and WhatsApp messages from interested buyers</li>
        <li>\u2705 A professional online presence &mdash; no website needed</li>
        <li>\u2705 Show up when people search your area or category</li>
      </ul>
      <p style="text-align:center">
        <a href="${ONBOARDING_URL}" class="cta-btn">List My Business Now \u2192</a>
      </p>
      <p style="color:#666;font-size:14px">It takes less than 2 minutes. No payment required.</p>
    `, unsubscribeUrl),
  }
}

export function getDay7Email(name: string, unsubscribeUrl: string): { subject: string; html: string } {
  const displayName = name || 'there'
  return {
    subject: 'Businesses in your area are getting found on MyHustle',
    html: emailWrapper(`
      <h2>Hey ${displayName}, businesses around you are getting discovered \uD83D\uDCC8</h2>
      <p>This week alone, hundreds of new businesses joined MyHustle and started getting customer enquiries.</p>
      <p><strong>What listed businesses are getting:</strong></p>
      <ul>
        <li>\uD83D\uDCDE Direct phone calls from customers searching their area</li>
        <li>\uD83D\uDCAC WhatsApp messages asking about services and prices</li>
        <li>\uD83D\uDCCD Appearing in local search results on Google</li>
      </ul>
      <p>Your competitors might already be listed. Don&rsquo;t let customers find them instead of you.</p>
      <p style="text-align:center">
        <a href="${ONBOARDING_URL}" class="cta-btn">Get Listed in 2 Minutes \u2192</a>
      </p>
    `, unsubscribeUrl),
  }
}

export function getDay14Email(name: string, unsubscribeUrl: string): { subject: string; html: string } {
  const displayName = name || 'there'
  return {
    subject: 'Your customers are searching \u2014 are they finding you?',
    html: emailWrapper(`
      <h2>${displayName}, your customers are looking for you \uD83D\uDD0D</h2>
      <p>Every day, people in Nigeria search for:</p>
      <ul>
        <li>\u201CBarber near me\u201D</li>
        <li>\u201CBest restaurant in Lekki\u201D</li>
        <li>\u201CPlumber in Lagos\u201D</li>
      </ul>
      <p>When your business isn&rsquo;t listed, those customers go to someone else.</p>
      <p><strong>A MyHustle listing means:</strong></p>
      <ul>
        <li>\u2705 Customers find your phone number and call you directly</li>
        <li>\u2705 Your business shows up in area and category searches</li>
        <li>\u2705 You build trust with photos, hours, and a description</li>
      </ul>
      <p style="text-align:center">
        <a href="${ONBOARDING_URL}" class="cta-btn">Claim Your Free Listing \u2192</a>
      </p>
    `, unsubscribeUrl),
  }
}

export function getDay30Email(name: string, unsubscribeUrl: string): { subject: string; html: string } {
  const displayName = name || 'there'
  return {
    subject: 'We saved your spot on MyHustle',
    html: emailWrapper(`
      <h2>${displayName}, we saved your spot \uD83D\uDCCC</h2>
      <p>We noticed you signed up for MyHustle but haven&rsquo;t listed your business yet. No worries &mdash; your account is still ready and waiting.</p>
      <p>This is our last reminder. We respect your inbox and won&rsquo;t send more emails about this.</p>
      <p>But if you ever want to get your business in front of local customers, your listing is just 2 minutes away:</p>
      <p style="text-align:center">
        <a href="${ONBOARDING_URL}" class="cta-btn">Complete My Listing \u2192</a>
      </p>
      <p style="color:#666;font-size:14px">Thanks for being part of MyHustle. We&rsquo;re here whenever you&rsquo;re ready. \uD83D\uDC9B</p>
    `, unsubscribeUrl),
  }
}

// ─── WhatsApp Message Templates ──────────────────────────────────────────────

export function getDay1WhatsApp(name: string): string {
  const displayName = name || 'there'
  return `Hey ${displayName}! \uD83D\uDC4B Thanks for joining MyHustle. Listing your business takes just 2 minutes and helps customers find you. Ready to set up? \uD83D\uDC49 ${ONBOARDING_URL}\n\nReply STOP to opt out.`
}

export function getDay3WhatsApp(name: string): string {
  const displayName = name || 'there'
  return `Hi ${displayName}! Quick question \u2014 what type of business or hustle do you run? I can help you get set up on MyHustle so customers in your area can find you easily. \uD83D\uDC49 ${ONBOARDING_URL}\n\nReply STOP to opt out.`
}

// ─── Reminder Processing Logic ───────────────────────────────────────────────

export function daysSinceSignup(signupDate: string): number {
  const signup = new Date(signupDate)
  const now = new Date()
  return Math.floor((now.getTime() - signup.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Determine which reminders are pending for a user.
 * Anti-spam rules:
 * - Never send WhatsApp + email on the same day
 * - Only send the NEXT pending reminder in sequence
 * - Skip WhatsApp if no phone number
 */
export function getNextPendingReminder(user: UserReminder): PendingReminder | null {
  const days = daysSinceSignup(user.signup_date)

  for (const [day, key, channel] of REMINDER_SCHEDULE) {
    // Skip if not yet time
    if (days < day) continue

    // Skip if already sent
    if (user[key] !== null) continue

    // Skip WhatsApp if no phone
    if (channel === 'whatsapp' && !user.user_phone) continue

    // Anti-spam: check if we already sent something today
    const today = new Date().toISOString().slice(0, 10)
    const sentToday = REMINDER_SCHEDULE.some(([, k, c]) => {
      const val = user[k] as string | null
      if (!val) return false
      // Check if sent today AND different channel
      return val.slice(0, 10) === today && c !== channel
    })

    if (sentToday) return null // Don't send if other channel was used today

    return { user, reminderKey: key, day, channel }
  }

  return null
}

/**
 * Send a reminder and update the database record.
 * Returns true if sent successfully.
 */
export async function sendReminder(pending: PendingReminder): Promise<boolean> {
  const { user, reminderKey, day, channel } = pending
  const unsubscribeUrl = getOptOutUrl(user.user_id)
  let sent = false

  if (channel === 'email') {
    let emailData: { subject: string; html: string }

    switch (day) {
      case 0:
        emailData = getDay0Email(user.user_name || '', unsubscribeUrl)
        break
      case 7:
        emailData = getDay7Email(user.user_name || '', unsubscribeUrl)
        break
      case 14:
        emailData = getDay14Email(user.user_name || '', unsubscribeUrl)
        break
      case 30:
        emailData = getDay30Email(user.user_name || '', unsubscribeUrl)
        break
      default:
        console.warn(`[Reminders] Unknown email day: ${day}`)
        return false
    }

    sent = await sendBrevoEmail({
      to: user.user_email,
      toName: user.user_name || undefined,
      subject: emailData.subject,
      htmlContent: emailData.html,
    })
  } else if (channel === 'whatsapp') {
    if (!user.user_phone) return false

    let message: string
    switch (day) {
      case 1:
        message = getDay1WhatsApp(user.user_name || '')
        break
      case 3:
        message = getDay3WhatsApp(user.user_name || '')
        break
      default:
        console.warn(`[Reminders] Unknown WhatsApp day: ${day}`)
        return false
    }

    sent = await sendWhatsAppMessage(user.user_phone, message)
  }

  // Update the database even if send failed (to avoid retrying endlessly)
  // In production, you might want to implement retry logic with a max attempts counter
  if (sent) {
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('user_reminders')
      .update({ [reminderKey]: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      console.error(`[Reminders] Failed to update ${reminderKey} for user ${user.user_id}:`, error)
    }
  }

  return sent
}
