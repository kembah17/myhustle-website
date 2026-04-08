import type { Metadata } from 'next'
import FAQClient from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Help & FAQ \u2014 MyHustle',
  description:
    "Find answers to common questions about using MyHustle.com \u2014 Nigeria's trusted business directory.",
}

const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I find a business on MyHustle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can find businesses on MyHustle in several ways: use the search bar on the homepage to search by name, category, or location; browse by city and area to discover businesses near you; explore categories to find specific types of services; or use the "Near Me" feature to find businesses closest to your current location.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book an appointment on MyHustle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "To book an appointment, visit the business page you're interested in and click the \"Book Now\" button. Fill in your preferred date, time, and any details about the service you need. Once submitted, you'll receive a confirmation notification. The business owner will confirm or suggest an alternative time.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do reviews work on MyHustle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Reviews on MyHustle are from verified customers who completed a booking through the platform. After your booking is marked as complete by the business, you'll receive an option to leave a review. Reviews include a star rating (1\u20135) and written feedback.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I claim my business listing on MyHustle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Find your business on MyHustle using the search bar, then click the "Claim this Business" button on your listing page. Verify ownership by confirming the phone number on file — it takes less than 2 minutes. No documents or registration required. Once verified, you\'ll have full control over your listing. Formally registered businesses can optionally upload their CAC certificate for a Gold badge.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the MyHustle verification tiers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyHustle has three verification levels. The main one is Verified Owner (Blue badge) — just verify your phone number and you\'re set. No documents needed, no registration required. For formally registered businesses, there\'s an optional Gold badge (Registered Business) available after 6 months with good reviews and CAC/NIN verification. Every verified business gets full access to bookings, reviews, and all platform features regardless of badge level.',
      },
    },
    {
      '@type': 'Question',
      name: 'What subscription plans does MyHustle offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyHustle offers four plans: Free (basic listing with 3 photos), Starter at \u20A65,000/month (up to 10 photos and priority in area listings), Pro at \u20A615,000/month (up to 50 photos, analytics dashboard, and featured placement), and Premium at \u20A635,000/month (up to 100 photos, priority placement across the platform, and dedicated support).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I suggest a business to MyHustle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can suggest a business by clicking the "Suggest a Business" button on any area or category page. You can also use the WhatsApp button to send us the business details directly. We\'ll review the suggestion and add it to our directory.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I report a problem on MyHustle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you encounter incorrect information, inappropriate content, or any other issue, click the "Report this listing" button on any business page. You can also email us directly at report@myhustle.com with details of the problem. We review all reports within 48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I upload photos to my MyHustle listing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Go to your dashboard and click "Edit Listing", then navigate to the Photos section. Click "Upload Photos" to add images. Accepted formats are JPG, PNG, and WebP, with a maximum file size of 5MB per image. We recommend photos that are at least 1200\u00D7800 pixels for the best display quality.',
      },
    },
  ],
}

export default function HelpPage() {
  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_STRUCTURED_DATA) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-hustle-dark mb-3">
            Help &amp; FAQ
          </h1>
          <p className="text-hustle-muted text-lg leading-relaxed max-w-xl mx-auto">
            Find answers to common questions about using MyHustle \u2014 whether you\u2019re
            a customer looking for businesses or a business owner managing your listing.
          </p>
        </div>

        <FAQClient />
      </div>
    </div>
  )
}
