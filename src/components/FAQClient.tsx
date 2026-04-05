'use client'

import { useState, useMemo } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSection {
  id: string
  label: string
  items: FAQItem[]
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    id: 'customers',
    label: 'For Customers',
    items: [
      {
        question: 'How do I find a business?',
        answer:
          'You can find businesses on MyHustle in several ways: use the search bar on the homepage to search by name, category, or location; browse by city and area to discover businesses near you; explore categories to find specific types of services; or use the "Near Me" feature to find businesses closest to your current location.',
      },
      {
        question: 'How do I book an appointment?',
        answer:
          'To book an appointment, visit the business page you\u2019re interested in and click the "Book Now" button. Fill in your preferred date, time, and any details about the service you need. Once submitted, you\u2019ll receive a confirmation notification. The business owner will confirm or suggest an alternative time.',
      },
      {
        question: 'How do reviews work?',
        answer:
          'Reviews on MyHustle are from verified customers who completed a booking through the platform. After your booking is marked as complete by the business, you\u2019ll receive an option to leave a review. Reviews include a star rating (1\u20135) and written feedback. This helps other customers make informed decisions and helps businesses improve their services.',
      },
      {
        question: 'How do I suggest a business?',
        answer:
          'Know a great business that isn\u2019t on MyHustle yet? You can suggest it by clicking the "Suggest a Business" button on any area or category page. You can also use the WhatsApp button to send us the business details directly. We\u2019ll review the suggestion and add it to our directory.',
      },
      {
        question: 'How do I report a problem?',
        answer:
          'If you encounter incorrect information, inappropriate content, or any other issue, click the "Report this listing" button on any business page. You can also email us directly at report@myhustle.com with details of the problem. We review all reports within 48 hours.',
      },
    ],
  },
  {
    id: 'business-owners',
    label: 'For Business Owners',
    items: [
      {
        question: 'How do I claim my listing?',
        answer:
          'Find your business on MyHustle using the search bar, then click the "Claim this Business" button on your listing page. You\u2019ll need to verify ownership either by matching the phone number on file or by uploading a verification document (such as your CAC certificate). Once verified, you\u2019ll have full control over your listing.',
      },
      {
        question: 'What are the verification tiers?',
        answer:
          'MyHustle has three verification tiers to build trust with customers. Tier 1: Phone Verification (free) \u2014 verify your business phone number to get a basic verification badge. Tier 2: Document Verification \u2014 upload your CAC certificate or other official documents for enhanced credibility. Tier 3: Physical Verification \u2014 a site visit confirms your business location and operations. Higher tiers receive better visibility in search results and directory listings.',
      },
      {
        question: 'How do I manage my listing?',
        answer:
          'Log in to your MyHustle dashboard to manage everything about your listing. You can update your business name, description, contact details, and operating hours. Add or remove photos, update your services and pricing, and respond to customer reviews \u2014 all from one place.',
      },
      {
        question: 'How do I respond to bookings?',
        answer:
          'New bookings appear in your dashboard under the Bookings section. You\u2019ll also receive a notification when a customer makes a booking. From the dashboard, you can confirm the booking, suggest an alternative time, or decline if you\u2019re unavailable. Prompt responses help build trust with customers.',
      },
      {
        question: 'What subscription plans are available?',
        answer:
          'MyHustle offers four plans: Free (basic listing with 3 photos), Starter at \u20A65,000/month (up to 10 photos and priority in area listings), Pro at \u20A615,000/month (up to 50 photos, analytics dashboard, and featured placement), and Premium at \u20A635,000/month (up to 100 photos, priority placement across the platform, and dedicated support). All paid plans include a 7-day free trial.',
      },
      {
        question: 'How do I upload photos and videos?',
        answer:
          'Go to your dashboard and click "Edit Listing", then navigate to the Photos section. Click "Upload Photos" to add images. Accepted formats are JPG, PNG, and WebP, with a maximum file size of 5MB per image. We recommend photos that are at least 1200\u00D7800 pixels for the best display quality. Tip: use good lighting and show your shopfront, products, or team. Video uploads are coming soon!',
      },
    ],
  },
]

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-hustle-light/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-heading font-medium text-hustle-dark pr-4">{item.question}</span>
        <svg
          className={`w-5 h-5 text-hustle-muted flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-hustle-muted leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQClient() {
  const [activeTab, setActiveTab] = useState('customers')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const activeSection = FAQ_SECTIONS.find((s) => s.id === activeTab)!

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return activeSection.items
    const q = searchQuery.toLowerCase()
    return activeSection.items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    )
  }, [activeSection, searchQuery])

  // Also search across all sections to show cross-tab results
  const allMatchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0
    const q = searchQuery.toLowerCase()
    return FAQ_SECTIONS.reduce(
      (count, section) =>
        count +
        section.items.filter(
          (item) =>
            item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
        ).length,
      0
    )
  }, [searchQuery])

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hustle-muted"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search frequently asked questions\u2026"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setOpenIndex(null)
          }}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-hustle-dark placeholder:text-hustle-muted/60 focus:outline-none focus:ring-2 focus:ring-hustle-blue/20 focus:border-hustle-blue transition-colors"
        />
        {searchQuery && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-hustle-muted">
            {allMatchCount} result{allMatchCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {FAQ_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveTab(section.id)
              setOpenIndex(null)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === section.id
                ? 'bg-hustle-blue text-white'
                : 'bg-hustle-light text-hustle-muted hover:text-hustle-dark hover:bg-gray-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <AccordionItem
              key={`${activeTab}-${index}`}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-hustle-muted">
              No results found for &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-sm text-hustle-muted/60 mt-1">
              Try a different search term or browse the other tab.
            </p>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-10 bg-hustle-light rounded-xl p-6 text-center">
        <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-2">
          Still have questions?
        </h3>
        <p className="text-hustle-muted text-sm mb-4">
          Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:support@myhustle.com"
            className="inline-flex items-center justify-center gap-2 bg-hustle-blue text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors"
          >
            <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Support
          </a>
          <a
            href="https://wa.me/2348000000000?text=Hi%2C%20I%20need%20help%20with%20MyHustle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.838-6.32-2.234l-.154-.124-3.197 1.071 1.071-3.197-.124-.154A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  )
}
