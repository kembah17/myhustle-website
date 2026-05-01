import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  const { pathname } = request.nextUrl

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
