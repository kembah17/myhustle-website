import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import SpeakableJsonLd from '@/components/SpeakableJsonLd'

export const metadata: Metadata = {
  title: 'Pricing — List Your Business on MyHustle',
  description:
    'Choose the right plan to list your business on MyHustle. Free listings available. Premium plans from \u20A65,000/month with enhanced visibility, booking, and analytics.',
  openGraph: {
    title: 'Pricing — List Your Business on MyHustle',
    description:
      'Choose the right plan to list your business on MyHustle. Free listings available. Premium plans start at \u20A65,000/month.',
    url: 'https://myhustle.space/pricing',
  },
  alternates: {
    canonical: 'https://myhustle.space/pricing',
  },
}

const tiers = [
  {
    name: 'Free',
    price: '\u20A60',
    priceValue: 0,
    period: 'forever',
    description: 'Get discovered by customers searching for your services.',
    features: [
      'Basic business listing',
      'Business name, address & phone',
      'Category & area placement',
      'Appear in search results',
      'Customer reviews',
      'WhatsApp contact link',
    ],
    cta: 'List Your Business Free',
    ctaHref: '/list-your-business',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '\u20A65,000',
    priceValue: 5000,
    period: '/month',
    description: 'Stand out from competitors with enhanced visibility.',
    features: [
      'Everything in Free',
      'Cover photo & photo gallery',
      'Business description & tagline',
      'Priority in search results',
      'Business hours display',
      'Website & social media links',
      'Verified badge',
    ],
    cta: 'Get Started',
    ctaHref: '/list-your-business?plan=starter',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '\u20A615,000',
    priceValue: 15000,
    period: '/month',
    description: 'Grow your business with bookings and analytics.',
    features: [
      'Everything in Starter',
      'Online booking system',
      'Customer analytics dashboard',
      'Featured placement in category',
      'AI voice receptionist',
      'Respond to reviews',
      'Monthly performance report',
    ],
    cta: 'Go Pro',
    ctaHref: '/list-your-business?plan=pro',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '\u20A635,000',
    priceValue: 35000,
    period: '/month',
    description: 'Maximum visibility and full digital office features.',
    features: [
      'Everything in Pro',
      'Homepage featured listing',
      'Accept payments online',
      'Custom business page URL',
      'Priority customer support',
      'Multi-location support',
      'Dedicated account manager',
      'API access',
    ],
    cta: 'Go Premium',
    ctaHref: '/list-your-business?plan=premium',
    highlighted: false,
  },
]

const faqs = [
  {
    question: 'Is there really a free plan?',
    answer:
      'Yes! Every Nigerian business can list on MyHustle for free. Your basic listing includes your business name, address, phone number, category placement, and customer reviews. No credit card required.',
  },
  {
    question: 'Can I upgrade or downgrade at any time?',
    answer:
      'Absolutely. You can upgrade your plan at any time and the new features activate immediately. If you downgrade, your current plan stays active until the end of your billing period.',
  },
  {
    question: 'How do I pay?',
    answer:
      'We accept payments via Paystack — including bank transfers, debit cards, and USSD. All prices are in Nigerian Naira (\u20A6) with no hidden fees.',
  },
  {
    question: 'What is the AI voice receptionist?',
    answer:
      'The AI voice receptionist answers calls and WhatsApp messages for your business 24/7. It can provide business information, take bookings, and route enquiries — so you never miss a customer.',
  },
  {
    question: 'How many businesses are on MyHustle?',
    answer:
      'MyHustle currently lists over 74,000 businesses across 39 Nigerian cities. We are the fastest-growing SME directory in Nigeria.',
  },
  {
    question: 'Do I need a website to list my business?',
    answer:
      'No. Your MyHustle listing acts as your digital storefront. Customers can find you, read reviews, see your hours, and contact you directly — no website needed.',
  },
]

export default function PricingPage() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'MyHustle Pricing — Business Listing Plans',
    description:
      'Choose the right plan to list your business on MyHustle. Free listings available. Premium plans from ₦5,000/month.',
    url: 'https://myhustle.space/pricing',
    mainEntity: {
      '@type': 'Service',
      name: 'MyHustle Business Listing',
      description:
        "List your business on Nigeria's largest SME directory. Get discovered by customers searching for your services.",
      provider: {
        '@type': 'Organization',
        name: 'MyHustle',
        url: 'https://myhustle.space',
        areaServed: { '@type': 'Country', name: 'Nigeria' },
      },
      serviceType: 'Business Directory Listing',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'MyHustle Listing Plans',
        itemListElement: tiers.map((tier) => ({
          '@type': 'Offer',
          name: tier.name + ' Plan',
          description: tier.description,
          price: String(tier.priceValue),
          priceCurrency: 'NGN',
          url: `https://myhustle.space${tier.ctaHref}`,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: String(tier.priceValue),
            priceCurrency: 'NGN',
            unitText: tier.priceValue === 0 ? 'forever' : 'month',
            ...(tier.priceValue > 0 ? { billingDuration: 'P1M' } : {}),
          },
        })),
      },
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-hustle-light">
      <SpeakableJsonLd name="Pricing — MyHustle" url="https://myhustle.space/pricing" />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.space' },
          { name: 'Pricing', url: 'https://myhustle.space/pricing' },
        ]}
      />

      {/* Hero */}
      <section className="bg-hustle-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold">
            Simple, Transparent <span className="text-hustle-amber">Pricing</span>
          </h1>
          <p className="text-blue-200 text-lg mt-4 max-w-2xl mx-auto">
            Every Nigerian business deserves to be found online. Start free, upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl shadow-sm border-2 p-6 flex flex-col ${
                  tier.highlighted
                    ? 'border-hustle-amber shadow-lg scale-[1.02]'
                    : 'border-gray-100'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hustle-amber text-hustle-dark text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h2 className="font-heading text-xl font-bold text-hustle-dark">{tier.name}</h2>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-hustle-dark">{tier.price}</span>
                  <span className="text-hustle-muted text-sm">{tier.period}</span>
                </div>
                <p className="text-hustle-muted text-sm mt-2">{tier.description}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-hustle-dark">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.ctaHref}
                  className={`mt-6 block text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                    tier.highlighted
                      ? 'bg-hustle-amber text-hustle-dark hover:bg-amber-400'
                      : 'bg-hustle-blue text-white hover:bg-blue-700'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-gray-200 rounded-xl p-5 hover:border-hustle-amber transition-colors"
              >
                <summary className="font-semibold text-hustle-dark cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <svg
                    className="w-5 h-5 text-hustle-muted group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-hustle-muted mt-3 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hustle-blue text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            Ready to Grow Your Business?
          </h2>
          <p className="text-blue-200 mt-4">
            Join over 74,000 Nigerian businesses already on MyHustle. List your business in under 2 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/list-your-business"
              className="bg-hustle-amber text-hustle-dark font-semibold py-3 px-8 rounded-xl hover:bg-amber-400 transition-colors"
            >
              List Your Business Free
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
