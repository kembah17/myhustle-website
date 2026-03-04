// Lightweight client-side analytics tracking for MyHustle.com
// Fire-and-forget pattern - never blocks UI

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debounce tracking: max 1 page view per business per 30 seconds
const recentPageViews = new Map<string, number>()
const PAGE_VIEW_DEBOUNCE_MS = 30_000

/**
 * Generate or retrieve anonymous visitor ID from localStorage.
 * No PII collected - just a random UUID for unique visitor counting.
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'ssr'
  try {
    const key = 'mh_visitor_id'
    let id = localStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    // localStorage blocked (incognito, etc.) - generate ephemeral ID
    return crypto.randomUUID()
  }
}

/**
 * Detect device type from user agent
 */
function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

/**
 * Get basic metadata for tracking context
 */
function getBaseMetadata(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  return {
    referrer: document.referrer || 'direct',
    device: getDeviceType(),
    url: window.location.pathname,
  }
}

/**
 * Core tracking function. Sends event to Supabase REST API.
 * * Fire-and-forget: uses fetch with keepalive for reliable tracking.
 * Never throws, never blocks UI.
 */
export function trackEvent(
  businessId: string,
  eventType: string,
  metadata?: Record<string, string>
): void {
  if (typeof window === 'undefined') return

  const payload = {
    business_id: businessId,
    event_type: eventType,
    metadata: { ...getBaseMetadata(), ...metadata },
    visitor_id: getVisitorId(),
  }

  // Fire-and-forget with keepalive for reliability on page unload
  const url = `${SUPABASE_URL}/rest/v1/analytics_events`
  const body = JSON.stringify(payload)
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Prefer': 'return=minimal',
  }

  // Fire-and-forget with keepalive for reliability on page unload
  try {
    fetch(url, {
      method: 'POST',
      headers,
      body,
      keepalive: true,
    }).catch(() => {
      // Silent fail - analytics should never break the app
    })
  } catch {
    // Silent fail
  }
}

/**
 * Track a page view with debouncing (max 1 per business per 30s)
 */
export function trackPageView(businessId: string): void {
  const now = Date.now()
  const lastView = recentPageViews.get(businessId)
  if (lastView && now - lastView < PAGE_VIEW_DEBOUNCE_MS) return
  recentPageViews.set(businessId, now)
  trackEvent(businessId, 'page_view')
}

/**
 * Track WhatsApp button click
 */
export function trackWhatsAppClick(businessId: string): void {
  trackEvent(businessId, 'whatsapp_click')
}

/**
 * Track phone call button click
 */
export function trackCallClick(businessId: string): void {
  trackEvent(businessId, 'call_click')
}

/**
 * Track booking form started (user progressed past step 1)
 */
export function trackBookingStarted(businessId: string): void {
  trackEvent(businessId, 'booking_started')
}

/**
 * Track booking completed successfully
 */
export function trackBookingCompleted(businessId: string): void {
  trackEvent(businessId, 'booking_completed')
}

/**
 * Track search impression (business appeared in search results)
 */
export function trackSearchImpression(businessId: string, query: string): void {
  trackEvent(businessId, 'search_impression', { search_query: query })
}
