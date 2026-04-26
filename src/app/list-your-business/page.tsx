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
    url: 'https://myhustle.space/list-your-business',
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
    canonical: 'https://myhustle.space/list-your-business',
  },
}

export default function ListYourBusinessPage() {
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'List Your Business on MyHustle',
    description:
      'Add your business to Nigeria\'s #1 SME directory for free. Get found by customers across Nigeria.',
    url: 'https://myhustle.space/list-your-business',
    isPartOf: {
      '@type': 'WebSite',
      name: 'MyHustle.com',
      url: 'https://myhustle.space',
    },
    mainEntity: {
      '@type': 'Service',
      name: 'MyHustle Business Listing',
      description:
        'Free business directory listing for Nigerian SMEs. Get found, get booked, get paid.',
      provider: {
        '@type': 'Organization',
        name: 'MyHustle.com',
        url: 'https://myhustle.space',
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
              List Your Business / Hustle on{' '}
              <span className="text-hustle-amber">MyHustle</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-10">
              Get found by thousands of customers searching for businesses like yours across Nigeria. It's free and takes less than 2 minutes.
            </p>

            {/* WhatsApp Primary CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-[#25D366] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Recommended</span>
              </div>
              <h2 className="font-heading text-2xl font-bold mb-3">List via WhatsApp</h2>
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
                Sign Up & Use Web Form
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Step by Step */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            Getting listed on MyHustle via WhatsApp is simple. Here's the process:
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">Click the Button</h3>
              <p className="text-hustle-muted text-sm">Tap the WhatsApp button below. It opens a chat with a pre-filled template ready for you to complete.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-hustle-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">Fill In Your Details</h3>
              <p className="text-hustle-muted text-sm">Complete the template with your business name, what you do, location, and contact info. Takes about 2 minutes.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-hustle-amber text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">Send the Message</h3>
              <p className="text-hustle-muted text-sm">Hit send! Our team receives your details and starts creating your professional listing right away.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-hustle-sunset text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-heading font-bold text-hustle-dark mb-2">You're Live!</h3>
              <p className="text-hustle-muted text-sm">Within 24 hours, we'll create your listing and send you a confirmation with a link to claim and manage it.</p>
            </div>
          </div>

          {/* WhatsApp Template Preview + CTA */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-heading text-xl font-bold text-center mb-6">
              Here's What the Template Looks Like
            </h3>
            <div className="bg-[#E5DDD5] rounded-2xl p-4 md:p-6 mb-8">
              {/* WhatsApp-style chat bubble */}
              <div className="max-w-md ml-auto">
                <div className="bg-[#DCF8C6] rounded-xl rounded-tr-sm p-4 shadow-sm">
                  <p className="text-[#111B21] text-sm leading-relaxed whitespace-pre-line">
                    Hi! I want to list my business on MyHustle 🎉{"\n"}
                    {"\n"}
                    📋 <span className="font-bold">BUSINESS DETAILS</span>{"\n"}
                    🏪 Business Name: ________{"\n"}
                    📂 What I Do (category): ________{"\n"}
                    📝 Brief Description: ________{"\n"}
                    {"\n"}
                    📍 <span className="font-bold">LOCATION</span>{"\n"}
                    🏙️ City: ________{"\n"}
                    📌 Area: ________{"\n"}
                    🏠 Address: ________{"\n"}
                    {"\n"}
                    📞 <span className="font-bold">CONTACT INFO</span>{"\n"}
                    📱 Phone: ________{"\n"}
                    💬 WhatsApp: ________{"\n"}
                    📧 Email: ________{"\n"}
                    🌐 Website (if any): ________{"\n"}
                    {"\n"}
                    Please set up my listing! 🙏
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[#667781] text-xs">Just now</span>
                    <svg className="w-4 h-4 text-[#53BDEB]" viewBox="0 0 16 11" fill="currentColor">
                      <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.146.47.47 0 0 0-.343.146l-.311.31a.445.445 0 0 0-.14.337c0 .136.047.25.14.343l2.996 2.996a.724.724 0 0 0 .501.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374l-.337-.273zm-2.66 7.062l.007-.005-.007.005z" />
                      <path d="M14.757.653a.457.457 0 0 0-.305-.102.493.493 0 0 0-.38.178l-6.19 7.636-1.143-1.08-.312.312 1.734 1.734a.724.724 0 0 0 .502.203.697.697 0 0 0 .546-.266l6.646-8.417a.497.497 0 0 0 .108-.299.441.441 0 0 0-.19-.374l-.337-.273z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-hustle-muted mb-4">Ready? Tap the button and fill in your details:</p>
              <WhatsAppCTA variant="inline" className="text-lg px-8 py-4" />
            </div>
          </div>
        </div>
      </section>

      {/* What to Have Ready */}
      <section className="py-16 bg-hustle-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            What to Have Ready
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            Here's what the template asks for. Don't worry if you don't have everything — just fill in what you can and we'll work with you on the rest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Business Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-hustle-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-heading font-bold text-hustle-dark mb-3 text-center">Business Details</h3>
              <ul className="text-hustle-muted text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-hustle-blue font-bold mt-0.5">•</span>
                  <span><strong>Business Name</strong> — the name customers know you by</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hustle-blue font-bold mt-0.5">•</span>
                  <span><strong>Category</strong> — what you do (e.g. Hair Stylist, Plumber, Tailor)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hustle-blue font-bold mt-0.5">•</span>
                  <span><strong>Description</strong> — a brief summary of your services</span>
                </li>
              </ul>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-hustle-amber/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-heading font-bold text-hustle-dark mb-3 text-center">Location</h3>
              <ul className="text-hustle-muted text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-hustle-amber font-bold mt-0.5">•</span>
                  <span><strong>City</strong> — Lagos, Abuja, Port Harcourt, etc.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hustle-amber font-bold mt-0.5">•</span>
                  <span><strong>Area</strong> — your neighbourhood (e.g. Lekki, Wuse, GRA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-hustle-amber font-bold mt-0.5">•</span>
                  <span><strong>Address</strong> — street address or landmark</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="font-heading font-bold text-hustle-dark mb-3 text-center">Contact Info</h3>
              <ul className="text-hustle-muted text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#25D366] font-bold mt-0.5">•</span>
                  <span><strong>Phone</strong> — your business phone number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25D366] font-bold mt-0.5">•</span>
                  <span><strong>WhatsApp</strong> — if different from phone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25D366] font-bold mt-0.5">•</span>
                  <span><strong>Email</strong> — for your listing account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#25D366] font-bold mt-0.5">•</span>
                  <span><strong>Website</strong> — optional, if you have one</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">
            Why List on MyHustle?
          </h2>
          <p className="text-hustle-muted text-center mb-12 max-w-2xl mx-auto">
            We're building the go-to place for people to find businesses across Nigeria. Here's what you get — for free.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-hustle-light rounded-2xl p-8 shadow-sm border border-gray-100">
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
            <div className="bg-hustle-light rounded-2xl p-8 shadow-sm border border-gray-100">
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
            <div className="bg-hustle-light rounded-2xl p-8 shadow-sm border border-gray-100">
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
