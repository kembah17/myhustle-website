"use client"

import { useState } from 'react'
import Link from 'next/link'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000'
const CONTACT_EMAIL = 'info@myhustle.space'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `*New Contact Form Submission*%0A%0A*Name:* ${form.name}%0A*Email:* ${form.email}%0A*Subject:* ${form.subject}%0A%0A*Message:*%0A${form.message}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-hustle-blue text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have a question, suggestion, or need help? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 mb-16">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-hustle-light rounded-xl p-6 text-center hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-1">WhatsApp</h3>
              <p className="text-hustle-muted text-sm">Chat with us directly</p>
              <p className="text-hustle-blue text-sm font-medium mt-2">Send a message →</p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="bg-hustle-light rounded-xl p-6 text-center hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 bg-hustle-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-hustle-blue/20 transition-colors">
                <svg className="w-7 h-7 text-hustle-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-1">Email</h3>
              <p className="text-hustle-muted text-sm">{CONTACT_EMAIL}</p>
              <p className="text-hustle-blue text-sm font-medium mt-2">Send email →</p>
            </a>

            {/* Social Media */}
            <div className="bg-hustle-light rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-hustle-amber/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-hustle-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-hustle-dark mb-1">Social Media</h3>
              <p className="text-hustle-muted text-sm mb-3">Follow us for updates</p>
              <div className="flex justify-center gap-3">
                <span className="text-hustle-muted text-xs bg-white px-3 py-1 rounded-full">Instagram</span>
                <span className="text-hustle-muted text-xs bg-white px-3 py-1 rounded-full">Twitter/X</span>
                <span className="text-hustle-muted text-xs bg-white px-3 py-1 rounded-full">Facebook</span>
              </div>
            </div>
          </div>

          {/* Contact Form + FAQ */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-hustle-dark mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="font-heading text-xl font-semibold text-hustle-dark mb-2">Message Sent!</h3>
                  <p className="text-hustle-muted">
                    Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-4 text-hustle-blue font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-hustle-dark mb-1">Your Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-hustle-dark mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-hustle-dark mb-1">Subject <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-hustle-dark mb-1">Message <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-blue focus:border-transparent resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-hustle-blue text-white font-semibold rounded-lg hover:bg-hustle-blue/90 transition-colors"
                  >
                    Send via WhatsApp
                  </button>
                  <p className="text-xs text-hustle-muted text-center">
                    This will open WhatsApp with your message pre-filled.
                  </p>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-hustle-dark mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'How do I list my business on MyHustle?',
                    a: 'Click "List Your Business" in the navigation, fill in your business details, and verify your phone number. It takes less than 5 minutes and is completely free.',
                  },
                  {
                    q: 'Is MyHustle free to use?',
                    a: 'Yes! Basic listings are completely free. We offer premium tiers with additional features like priority placement, analytics, and enhanced profiles.',
                  },
                  {
                    q: 'How do I claim an existing listing?',
                    a: 'Find your business on MyHustle, click the "Claim this Business" button, and verify ownership with your phone number. You\'ll have full control of your listing instantly.',
                  },
                  {
                    q: 'How do reviews work?',
                    a: 'Customers who book through MyHustle can leave verified reviews after their appointment. This helps build trust and attract more customers to your business.',
                  },
                  {
                    q: 'What cities does MyHustle cover?',
                    a: 'We\'re actively expanding across Nigeria. We currently cover major cities including Lagos, Abuja, Port Harcourt, and more. New cities are added regularly.',
                  },
                  {
                    q: 'How do I report an incorrect listing?',
                    a: 'Visit the business page and click the "Report" button at the bottom. Our team reviews all reports and takes action within 24-48 hours.',
                  },
                ].map((faq, i) => (
                  <details key={i} className="group bg-hustle-light rounded-xl">
                    <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-hustle-dark">
                      {faq.q}
                      <svg className="w-5 h-5 text-hustle-muted group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="px-4 pb-4 text-hustle-muted text-sm leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/help" className="text-hustle-blue font-medium hover:underline text-sm">
                  View all FAQs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-hustle-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-hustle-muted">
            Looking to list your business?{' '}
            <Link href="/list-your-business" className="text-hustle-blue font-semibold hover:underline">
              Get started for free →
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
