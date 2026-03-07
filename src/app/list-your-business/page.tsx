import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import WhatsAppCTA from '@/components/WhatsAppCTA'
import { generateListYourBusinessFAQs } from '@/lib/faq-generator'
import FAQSection from '@/components/FAQSection'

export const metadata: Metadata = {
  title: 'List Your Business Free on MyHustle | Get Found by Customers Across Nigeria',
  description:
    'Add your business to MyHustle.com for free. Get discovered by thousands of customers searching for services across Nigeria. List via WhatsApp in 2 minutes or use our web form.',
  openGraph: {
    title: 'List Your Business Free on MyHustle',
    description:
      'Get discovered by thousands of customers across Nigeria. List your business via WhatsApp in 2 minutes.',
    url: 'https://myhustle.com/list-your-business',
    siteName: 'MyHustle.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'List Your Business Free on MyHustle',
    description:
      'Get discovered by thousands of customers across Nigeria. List your business via WhatsApp in 2 minutes.',
  },
  alternates: {
    canonical: 'https://myhustle.com/list-your-business',
  },
}

export default function ListYourBusinessPage() {
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'List Your Business on MyHustle',
    description:
      'Add your business to Nigeria\'s #1 SME directory for free. Get found by customers across Nigeria.',
    url: 'https://myhustle.com/list-your-business',
    isPartOf: {
      '@type': 'WebSite',
      name: 'MyHustle.com',
      url: 'https://myhustle.com',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'MyHustle Business Listing',
      description:
        'Free business directory listing for Nigerian SMEs. Get found, get booked, get paid.',
      provider: {
        '@type': 'Organization',
        name: 'MyHustle.com',
        url: 'https://myhustle.com',
      },
      areaServed: {
        '@type': 'City',
        name: 'Nigeria',
        containedInPlace: {
          '@type': 'Country',
          name: 'Nigeria',
        },
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'NGN',
        description: 'Free business listing',
      },
    },
  }


  const listFaqs = generateListYourBusinessFAQs()

  return (
    <div>
      <JsonLd data={pageJsonLd} />

      {/* Hero Section */}
      <section className="bg-hustle-blue text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              List Your Business on{' '}
              <span className="text-hustle-amber">MyHustle</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-10">
              Get found by thousands of customers searching for businesses like yours across Nigeria. It&apos;s free and takes less than 2 minutes.
            </p>

            {/* WhatsApp Primary CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-[#25D366] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Recommended</span>
              </div>
              <h2 className="font-heading text-2xl font-bold mb-3">List via WhatsApp</h2>
              <p className="text-blue-200 mb-6">
                Most Nigerian business owners prefer WhatsApp — so do we. Just send us a message with your business name and we&apos;ll handle the rest.
              </p>
              <WhatsAppCTA variant="hero" />
            </div>

            {/* Web Form Secondary CTA */}
            <div className="text-blue-200">
              <p className="mb-3">Prefer to do it yourself?</p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20"
              >
                <svg className="w-5 h-5" width="20" height="20" style={{width:'20px',height:'20px',maxWidth:'20px',maxHeight:'20px',flexShrink:0}} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                Sign Up &amp; Use Web Form
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to Prepare */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            What to Have Ready
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            When you message us on WhatsApp, here&apos;s what we&apos;ll ask about. Don&apos;t worry if you don&apos;t have everything — we can always add more later.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-hustle-light rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-hustle-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" width="24" height="24" style={{width:'24px',height:'24px',maxWidth:'24px',maxHeight:'24px',flexShrink:0}} fill="none" stroke="#1B4965" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.999 2.999 0 013-2.599h12a2.999 2.999 0 013 2.599" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">Business Name</h3>
              <p className="text-hustle-muted text-sm">The name your customers know you by</p>
            </div>
            <div className="bg-hustle-light rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-hustle-amber/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" width="24" height="24" style={{width:'24px',height:'24px',maxWidth:'24px',maxHeight:'24px',flexShrink:0}} fill="none" stroke="#F59E0B" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">What You Do</h3>
              <p className="text-hustle-muted text-sm">Your services or products in a few words</p>
            </div>
            <div className="bg-hustle-light rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-hustle-sunset/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" width="24" height="24" style={{width:'24px',height:'24px',maxWidth:'24px',maxHeight:'24px',flexShrink:0}} fill="none" stroke="#EA580C" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">Your Location</h3>
              <p className="text-hustle-muted text-sm">City and area where you operate</p>
            </div>
            <div className="bg-hustle-light rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" width="24" height="24" style={{width:'24px',height:'24px',maxWidth:'24px',maxHeight:'24px',flexShrink:0}} fill="none" stroke="#25D366" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">Phone Number</h3>
              <p className="text-hustle-muted text-sm">So customers can reach you directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-hustle-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            Why List on MyHustle?
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            We&apos;re building the go-to place for people to find businesses across Nigeria. Here&apos;s what you get — for free.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-hustle-blue/10 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7" width="28" height="28" style={{width:'28px',height:'28px',maxWidth:'28px',maxHeight:'28px',flexShrink:0}} fill="none" stroke="#1B4965" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-hustle-dark mb-3">Get Found</h3>
              <p className="text-hustle-muted">
                When someone searches for your type of business in your area, your listing shows up. No more relying only on word of mouth.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-hustle-amber/10 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7" width="28" height="28" style={{width:'28px',height:'28px',maxWidth:'28px',maxHeight:'28px',flexShrink:0}} fill="none" stroke="#F59E0B" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-hustle-dark mb-3">Get Booked</h3>
              <p className="text-hustle-muted">
                Customers can book appointments directly from your listing. No more back-and-forth messages to schedule.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-hustle-sunset/10 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7" width="28" height="28" style={{width:'28px',height:'28px',maxWidth:'28px',maxHeight:'28px',flexShrink:0}} fill="none" stroke="#EA580C" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-hustle-dark mb-3">Get Paid</h3>
              <p className="text-hustle-muted">
                Accept payments online through your listing. Customers pay upfront, you focus on delivering great service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Numbers */}
      <section className="py-16 bg-hustle-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-heading text-4xl md:text-5xl font-bold text-hustle-amber">Free</div>
              <p className="text-blue-200 mt-2">To list your business</p>
            </div>
            <div>
              <div className="font-heading text-4xl md:text-5xl font-bold text-hustle-amber">2 min</div>
              <p className="text-blue-200 mt-2">To get started</p>
            </div>
            <div>
              <div className="font-heading text-4xl md:text-5xl font-bold text-hustle-amber">24/7</div>
              <p className="text-blue-200 mt-2">Your listing works for you</p>
            </div>
            <div>
              <div className="font-heading text-4xl md:text-5xl font-bold text-hustle-amber">3 Cities</div>
              <p className="text-blue-200 mt-2">All areas covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={listFaqs} title="Common Questions" />

      {/* Final CTA */}
      <section className="py-16 bg-hustle-sunset text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Get More Customers?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join smart business owners across Nigeria who are already getting discovered on MyHustle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WhatsAppCTA variant="inline" />
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-hustle-sunset px-6 py-3 rounded-lg font-bold hover:bg-hustle-light transition-colors"
            >
              Use Web Form Instead
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
