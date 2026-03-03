'use client'

import { useState } from 'react'

interface BookingFormProps {
  businessName: string
  businessSlug: string
}

export default function BookingForm({ businessName, businessSlug }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just show success state
    // In production, this would POST to an API endpoint
    console.log('Booking request:', { businessSlug, ...formData })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-heading text-xl font-semibold text-green-800 mb-2">
          Booking Request Sent!
        </h3>
        <p className="text-green-700">
          Your booking request has been sent to {businessName}. They will contact you shortly.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', email: '', service: '', date: '', message: '' }) }}
          className="mt-4 text-green-700 underline hover:text-green-900"
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="font-heading text-xl font-semibold text-hustle-dark">
        Book {businessName}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Your Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
            placeholder="08012345678"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-hustle-dark mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
          placeholder="your@email.com"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Service Needed</label>
          <input
            type="text"
            value={formData.service}
            onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
            placeholder="e.g. Haircut, Tailoring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hustle-dark mb-1">Preferred Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-hustle-dark mb-1">Additional Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-hustle-dark focus:outline-none focus:ring-2 focus:ring-hustle-amber focus:border-transparent resize-none"
          placeholder="Any special requests or details..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-hustle-amber text-hustle-dark py-3 rounded-lg font-bold text-lg hover:bg-hustle-sunset hover:text-white transition-colors"
      >
        Send Booking Request
      </button>
    </form>
  )
}
