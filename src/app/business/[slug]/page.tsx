import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import Breadcrumbs from '@/components/Breadcrumbs'
import StarRating from '@/components/StarRating'
import BookingForm from '@/components/BookingForm'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import ReviewSummary from '@/components/ReviewSummary'
import ReviewForm from '@/components/ReviewForm'
import PhotoGallery from '@/components/business/PhotoGallery'
import type { Metadata } from 'next'
import VerificationBadge from '@/components/VerificationBadge'
import PageViewTracker from '@/components/analytics/PageViewTracker'
import VoiceReceptionist from '@/components/VoiceReceptionist'
import ContactTracker from '@/components/analytics/ContactTracker'
import type { Business, Category, Area, Review, ReviewResponse, BusinessHour, BusinessPhoto } from '@/lib/types'
import ShareButtons from '@/components/ShareButtons'
import { generateBusinessFAQs } from '@/lib/faq-generator'
import ClaimBusinessButton from '@/components/ClaimBusinessButton'
import ReportListingButton from '@/components/ReportListingButton'
import FAQSection from '@/components/FAQSection'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: biz } = await getSupabase()
    .from('businesses')
    .select('name, description, category:categories(name), area:areas(name, city:cities(name, slug))')
    .eq('slug', slug)
    .single()

  if (!biz) return { title: 'Business Not Found' }

  const catName = (biz.category as unknown as Category)?.name || ''
  const areaName = (biz.area as unknown as Area)?.name || ''
  const cityName = (biz.area as any)?.city?.name || 'Nigeria'
  const title = `${biz.name} — ${catName} in ${areaName}, ${cityName} | MyHustle`
  const description = biz.description
    ? biz.description.slice(0, 160)
    : `${biz.name} — ${catName} in ${areaName}, ${cityName}. See services, read reviews, and book on MyHustle.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://myhustle.com/business/${slug}`,
    },
  }
}


const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0] // Mon-Sun

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params

  const { data: business } = await getSupabase()
    .from('businesses')
    .select('*, category:categories(*), area:areas(*, city:cities(*))')
    .eq('slug', slug)
    .single()

  if (!business) notFound()

  const biz = business as Business & { category: Category; area: Area }

  // Fetch business photos
  const { data: photos } = await getSupabase()
    .from('business_photos')
    .select('*')
    .eq('business_id', biz.id)
    .order('position', { ascending: true })

  const photoList = (photos || []) as BusinessPhoto[]

  // Fetch reviews with responses
  const { data: reviews } = await getSupabase()
    .from('reviews')
    .select('*')
    .eq('business_id', biz.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const rawReviews = (reviews || []) as Review[]

  // Fetch review responses
  const reviewIds = rawReviews.map(r => r.id)
  let responses: ReviewResponse[] = []
  if (reviewIds.length > 0) {
    const { data: respData } = await getSupabase()
      .from('review_responses')
      .select('*')
      .in('review_id', reviewIds)
    responses = (respData || []) as ReviewResponse[]
  }

  // Merge responses into reviews
  const reviewList = rawReviews.map(r => ({
    ...r,
    photos: r.photos || [],
    helpful_count: r.helpful_count || 0,
    response: responses.find(resp => resp.review_id === r.id) || null,
  }))
  const avgRating = reviewList.length > 0
    ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
    : 0

  // Fetch business hours
  const { data: hours } = await getSupabase()
    .from('business_hours')
    .select('*')
    .eq('business_id', biz.id)

  const hoursList = (hours || []) as BusinessHour[]
  const sortedHours = DISPLAY_ORDER
    .map(dayNum => hoursList.find(h => h.day === dayNum))
    .filter(Boolean) as BusinessHour[]

  // Determine cover photo
  const coverPhoto = biz.cover_photo_url || photoList.find(p => p.is_cover)?.url || null

  // Schema.org LocalBusiness
  const DAY_NAMES_FOR_FAQ = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const bizFaqs = generateBusinessFAQs({
    businessName: biz.name,
    categoryName: biz.category?.name || '',
    areaName: biz.area?.name || '',
    cityName: (biz.area as any)?.city?.name || '',
    hasBooking: true,
    hasWhatsApp: !!biz.whatsapp,
    hasPhone: !!biz.phone,
    reviewCount: reviewList.length,
    avgRating,
    isVerified: biz.verified || biz.verification_tier > 0,
    verificationTier: biz.verification_tier || 0,
    hours: sortedHours.map(h => ({
      day: DAY_NAMES_FOR_FAQ[h.day],
      open: h.open_time || '',
      close: h.close_time || '',
      closed: h.closed,
    })),
  })

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: biz.name,
    url: `https://myhustle.com/business/${biz.slug}`,
    ...(biz.description || biz.tagline ? { description: [biz.tagline, biz.description].filter(Boolean).join('. ') } : {}),
    ...(biz.phone ? { telephone: biz.phone } : {}),
    ...(biz.email ? { email: biz.email } : {}),
    ...(biz.website ? { sameAs: biz.website } : {}),
    ...(coverPhoto ? { image: coverPhoto } : {}),
    ...(biz.address ? {
      address: {
        '@type': 'PostalAddress',
        streetAddress: biz.address,
        addressLocality: biz.area?.name || 'Nigeria',
        addressRegion: (biz.area as any)?.city?.state || (biz.area as any)?.city?.name || 'Nigeria',
        addressCountry: 'NG',
      },
    } : {}),
    ...(reviewList.length > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviewList.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviewList.slice(0, 5).map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.reviewer_name || 'MyHustle User' },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating },
        reviewBody: r.text || '',
        datePublished: r.created_at,
      })),
    } : {}),
    ...(sortedHours.length > 0 ? {
      openingHoursSpecification: sortedHours.filter(h => !h.closed).map(h => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_NAMES[h.day],
        opens: h.open_time,
        closes: h.close_time,
      })),
    } : {}),
  }

  return (
    <div>
      <JsonLd data={localBusinessJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.com' },
          ...(biz.area ? [
            { name: (biz.area as any)?.city?.name || 'Nigeria', url: `https://myhustle.com/${(biz.area as any)?.city?.slug || 'lagos'}` },
            { name: biz.area.name, url: `https://myhustle.com/${(biz.area as any)?.city?.slug || 'lagos'}/${biz.area.slug}` },
          ] : []),
          { name: biz.name, url: `https://myhustle.com/business/${biz.slug}` },
        ]}
      />
      <PageViewTracker businessId={biz.id} />
      <VoiceReceptionist businessId={biz.id} businessName={biz.name} />

      {/* Cover Photo Banner */}
      <div className="relative">
        {coverPhoto ? (
          <div className="relative h-[200px] md:h-[300px] w-full overflow-hidden">
            <img
              src={coverPhoto}
              alt={`${biz.name} — ${(biz.category as Category)?.name || ''} in ${(biz.area as Area)?.name || ''}, ${(biz.area as any)?.city?.name || 'Nigeria'}`}
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={300}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hustle-dark/80 via-hustle-dark/40 to-transparent" />
          </div>
        ) : (
          <div className="relative h-[200px] md:h-[300px] w-full bg-gradient-to-br from-hustle-blue via-hustle-blue/90 to-hustle-dark" />
        )}

        {/* Business Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                ...(biz.category ? [{ label: biz.category.name, href: `/category/${biz.category.slug}` }] : []),
                { label: biz.name },
              ]}
            />
            <div className="mt-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{biz.name}</h1>
                {(biz.verification_tier > 0 || biz.verified) && (
                  <VerificationBadge tier={biz.verification_tier || (biz.verified ? 1 : 0)} variant="full" />
                )}
              </div>
              {/* Tagline */}
              {biz.tagline && (
                <p className="text-hustle-amber text-lg md:text-xl mt-1 italic font-medium drop-shadow">
                  {biz.tagline}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {biz.category && (
                  <Link
                    href={`/category/${biz.category.slug}`}
                    className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full hover:bg-white/25 transition-colors"
                  >
                    {biz.category.icon && <span>{biz.category.icon}</span>}
                    {biz.category.name}
                  </Link>
                )}
                {biz.area && (
                  <Link
                    href={`/${(biz.area as any)?.city?.slug || 'lagos'}/${biz.area.slug}`}
                    className="inline-flex items-center gap-1 text-blue-200 hover:text-white transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" width="16" height="16" style={{width:"16px",height:"16px",maxWidth:"16px",maxHeight:"16px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {biz.area.name}{(biz.area as any)?.city?.name ? `, ${(biz.area as any).city.name}` : ''}
                  </Link>
                )}
                {reviewList.length > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={avgRating} count={reviewList.length} size="sm" />
                  </div>
                )}
              </div>
              <ShareButtons
                businessName={biz.name}
                businessSlug={biz.slug}
                categoryName={biz.category?.name}
                areaName={biz.area?.name}
                variant="header"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {biz.description && (
              <div>
                <h2 className="font-heading text-2xl font-bold mb-4">About {biz.name}</h2>
                <div className="prose prose-lg text-hustle-muted max-w-none">
                  <p>{biz.description}</p>
                </div>
              </div>
            )}

            {/* Photo Gallery - above business hours */}
            <PhotoGallery photos={photoList} businessName={biz.name} />

            {/* Business Hours */}
            {sortedHours.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold mb-4">Business Hours</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {sortedHours.map((h) => {
                        const todayNum = new Date().getDay()
                        const isToday = h.day === todayNum
                        return (
                          <tr
                            key={h.day}
                            className={`border-b border-gray-100 last:border-0 ${isToday ? 'bg-hustle-amber/5' : ''}`}
                          >
                            <td className={`px-4 py-3 font-medium ${isToday ? 'text-hustle-amber' : 'text-hustle-dark'}`}>
                              {DAY_NAMES[h.day]}
                              {isToday && <span className="text-xs ml-2 text-hustle-amber">(Today)</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {h.closed ? (
                                <span className="text-red-500 font-medium">Closed</span>
                              ) : (
                                <span className="text-hustle-dark">
                                  {h.open_time?.slice(0, 5)} — {h.close_time?.slice(0, 5)}
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="font-heading text-2xl font-bold mb-4">
                Reviews
                {reviewList.length > 0 && (
                  <span className="text-hustle-muted text-lg font-normal ml-2">({reviewList.length})</span>
                )}
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <p className="text-sm text-green-800">Reviews are from verified customers who completed a booking through MyHustle</p>
              </div>
              {reviewList.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-hustle-muted">No reviews yet. Be the first to review {biz.name}!</p>
                </div>
              ) : (
                <ReviewSummary reviews={reviewList} />
              )}

              {/* Write a Review */}
              <div className="mt-6">
                <ReviewForm businessId={biz.id} businessName={biz.name} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:z-10">
            {/* Contact Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="font-heading text-lg font-semibold text-hustle-dark">Contact Info</h3>

              {biz.address && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-hustle-muted flex-shrink-0 mt-0.5" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-hustle-dark text-sm">{biz.address}</p>
                </div>
              )}

              {biz.phone && (
                <a href={`tel:${biz.phone}`} className="flex items-center gap-3 text-hustle-dark hover:text-hustle-blue transition-colors">
                  <svg className="w-5 h-5 text-hustle-muted flex-shrink-0" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{biz.phone}</span>
                </a>
              )}

              {biz.phone2 && (
                <a href={`tel:${biz.phone2}`} className="flex items-center gap-3 text-hustle-dark hover:text-hustle-blue transition-colors">
                  <svg className="w-5 h-5 text-hustle-muted flex-shrink-0" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{biz.phone2} <span className="text-hustle-muted text-xs">(Alt.)</span></span>
                </a>
              )}

              {biz.email && (
                <a href={`mailto:${biz.email}`} className="flex items-center gap-3 text-hustle-dark hover:text-hustle-blue transition-colors">
                  <svg className="w-5 h-5 text-hustle-muted flex-shrink-0" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{biz.email}</span>
                </a>
              )}

              {biz.website && (
                <a href={biz.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-hustle-dark hover:text-hustle-blue transition-colors">
                  <svg className="w-5 h-5 text-hustle-muted flex-shrink-0" width="20" height="20" style={{width:"20px",height:"20px",maxWidth:"20px",maxHeight:"20px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="text-sm">Visit Website</span>
                </a>
              )}

              {/* Action Buttons with Tracking */}
              <ContactTracker businessId={biz.id} whatsapp={biz.whatsapp} phone={biz.phone} />
            </div>

            {/* Claim Business Button - only show for unclaimed businesses */}
            {!biz.user_id && (
              <ClaimBusinessButton businessId={biz.id} businessName={biz.name} businessSlug={biz.slug} />
            )}

            {/* Booking Form */}
            <BookingForm businessId={biz.id} businessName={biz.name} businessSlug={biz.slug} businessWhatsapp={biz.whatsapp} businessPhone={biz.phone} />

            {/* Report Listing */}
            <ReportListingButton businessId={biz.id} businessName={biz.name} />
          </div>
        </div>

        <FAQSection faqs={bizFaqs} />
      </div>
    </div>
  )
}
