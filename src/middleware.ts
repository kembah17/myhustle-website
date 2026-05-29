import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ============================================================
// SEO REDIRECT & GONE MAPS
// ============================================================

// Category B: Merged/deleted area slugs → permanent redirects
// These area slugs were removed during deduplication; redirect to surviving areas
const MERGED_AREA_REDIRECTS: Record<string, string> = {
  '/lagos/trans-amadi-port-harcourt-port-harcourt': '/port-harcourt/trans-amadi',
  '/lagos/dline-port-harcourt-1': '/port-harcourt/d-line',
  '/lagos/d-line-port-harcourt': '/port-harcourt/d-line',
  '/lagos/rumuogba-port-harcourt-port-harcourt': '/port-harcourt/rumuogba-port-harcourt',
}

// Category C & D: URLs that should return 410 Gone
// These are spam/garbage URLs that never had valid content
const GONE_PATHS = new Set([
  '/business/birdviewtravels.com',
  '/business/univelcity.com',
  '/business/royaltiestours.com',
  '/business/gomycode.com',
  '/business/onetechacademy.com',
  '/&',
])

// Known top-level route prefixes that are NOT city slugs
// Used to avoid unnecessary DB lookups for area-city mismatch detection
const KNOWN_ROUTE_PREFIXES = new Set([
  'api', 'dashboard', 'onboarding', 'login', 'signup', 'forgot-password',
  'search', 'business', 'category', 'categories', 'cities', 'near', 'near-me',
  'about', 'contact', 'help', 'legal', 'list-your-business', 'nigeria-only',
  'sitemaps', 'sitemap.xml', '_next', 'favicon.ico', 'manifest',
])

// 410 Gone HTML response body
const GONE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex">
  <title>410 Gone - MyHustle</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #334155; }
    .container { text-align: center; max-width: 480px; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #64748b; line-height: 1.6; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>This page no longer exists</h1>
    <p>The content you\u2019re looking for has been permanently removed from MyHustle.</p>
    <p><a href="/">\u2190 Go to MyHustle homepage</a></p>
  </div>
</body>
</html>`

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Handle 410 Gone paths (Category C & D) ──────────────
  if (GONE_PATHS.has(pathname)) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
      },
    })
  }

  // ── 2. Handle merged area redirects (Category B) ───────────
  const mergedTarget = MERGED_AREA_REDIRECTS[pathname]
  if (mergedTarget) {
    const url = request.nextUrl.clone()
    url.pathname = mergedTarget
    return NextResponse.redirect(url, 301)
  }

  // ── 3. Dynamic area-city mismatch redirect (Category A) ────
  // For paths like /{city}/{area}, check if the area actually belongs
  // to a different city and redirect if so. This prevents future
  // recurrence for ANY misrouted area, not just the known 18.
  const segments = pathname.split('/').filter(Boolean)
  if (
    segments.length === 2 &&
    !KNOWN_ROUTE_PREFIXES.has(segments[0]) &&
    !segments[0].includes('.') &&
    !segments[1].includes('.')
  ) {
    const [citySlug, areaSlug] = segments
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
      try {
        // Look up the area and its actual city in one query
        const areaRes = await fetch(
          `${supabaseUrl}/rest/v1/areas?slug=eq.${encodeURIComponent(areaSlug)}&select=slug,city:cities!inner(slug)`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
            },
            // Cache for 1 hour to avoid repeated lookups
            next: { revalidate: 3600 },
          }
        )

        if (areaRes.ok) {
          const areas = await areaRes.json()
          if (areas.length > 0) {
            const actualCitySlug = (areas[0].city as any)?.slug
            if (actualCitySlug && actualCitySlug !== citySlug) {
              // Area exists but belongs to a different city → 301 redirect
              const url = request.nextUrl.clone()
              url.pathname = `/${actualCitySlug}/${areaSlug}`
              return NextResponse.redirect(url, 301)
            }
          }
        }
      } catch (e) {
        // Silently fail - let the page handle it
        console.error('Middleware area-city lookup failed:', e)
      }
    }
  }

  // ── Existing auth/geo middleware below ──────────────────────
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Guard: if Supabase env vars are missing, skip auth checks and pass through
  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Refresh session and get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Geo-restriction check (before auth redirects)
  const country = request.headers.get('x-vercel-ip-country') || undefined
  const bypassIPs = (process.env.GEO_BYPASS_IPS || '')
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean)
  const clientIP =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    ''
  const isBypassIP = bypassIPs.includes(clientIP)

  const crawlerPattern =
    /Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebot|ia_archiver/i
  const userAgent = request.headers.get('user-agent') || ''
  const isCrawler = crawlerPattern.test(userAgent)

  const geoRestrictedPaths = [
    '/signup',
    '/login',
    '/forgot-password',
    '/onboarding',
    '/dashboard',
  ]
  const isGeoRestricted = geoRestrictedPaths.some(p => pathname.startsWith(p))

  if (
    country &&
    country !== 'NG' &&
    !isCrawler &&
    !isBypassIP &&
    isGeoRestricted &&
    pathname !== '/nigeria-only'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/nigeria-only'
    return NextResponse.redirect(url)
  }

  // 3. Protected routes - redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/onboarding']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // 4. Admin route check - redirect non-admins to dashboard
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
  const isAdmin = user?.email
    ? adminEmails.includes(user.email.toLowerCase())
    : false

  if (pathname.startsWith('/dashboard/admin') && user && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    url.searchParams.set('message', 'admin_required')
    return NextResponse.redirect(url)
  }

  // 5. Auth routes - redirect to dashboard if already authenticated
  const authPaths = ['/login', '/signup', '/forgot-password']
  const isAuthPage = authPaths.some(p => pathname === p)

  if (isAuthPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
