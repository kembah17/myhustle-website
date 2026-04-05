import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'MyHustle.com Privacy Policy — how we collect, use, and protect your personal data in compliance with Nigeria\'s NDPR/NDPA.',
}

export default function PrivacyPolicyPage() {
  return (
    <div>
      <span className="text-sm text-hustle-muted bg-hustle-light rounded-lg px-4 py-2 inline-block mb-8">
        Last updated: 5 April 2026
      </span>

      <h1 className="font-heading text-3xl font-bold text-hustle-dark mb-6">
        Privacy Policy
      </h1>

      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle.com (&ldquo;MyHustle&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is
        committed to protecting your personal data. This Privacy Policy explains how we collect, use,
        store, and protect information when you use our platform. MyHustle is operated in Nigeria and
        complies with the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection
        Act (NDPA).
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        1. Information We Collect
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We collect the following categories of personal data when you use MyHustle:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Account information:</strong> Name, email address, phone number, and password</li>
        <li><strong>Business information:</strong> Business name, description, category, address, operating hours, and contact details</li>
        <li><strong>Photos and media:</strong> Images uploaded to business listings</li>
        <li><strong>Location data:</strong> City, area, and coordinates associated with business listings</li>
        <li><strong>Booking details:</strong> Appointment dates, times, service requests, and customer notes</li>
        <li><strong>Usage data:</strong> Pages visited, search queries, device information, and browser type</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        2. How We Use Your Data
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We use the information we collect for the following purposes:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Displaying business listings in our directory for public discovery</li>
        <li>Facilitating bookings between customers and businesses</li>
        <li>Sending booking confirmations, reminders, and updates</li>
        <li>Verifying business ownership and authenticity</li>
        <li>Analysing platform usage to improve our services</li>
        <li>Communicating important updates about your account or our platform</li>
        <li>Preventing fraud and ensuring platform security</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        3. Legal Basis for Processing
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        Under the NDPR/NDPA, we process your personal data based on:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Consent:</strong> When you create an account or submit a business listing</li>
        <li><strong>Contractual necessity:</strong> To provide our directory and booking services</li>
        <li><strong>Legitimate interest:</strong> To improve our platform and prevent misuse</li>
        <li><strong>Legal obligation:</strong> To comply with applicable Nigerian laws</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        4. Data Storage and Security
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        Your data is stored on Supabase cloud infrastructure with industry-standard security
        measures, including encryption at rest and in transit. We implement appropriate technical
        and organisational measures to protect your personal data against unauthorised access,
        alteration, disclosure, or destruction.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        5. Your Rights Under NDPR/NDPA
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        As a data subject, you have the following rights:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Right to access:</strong> Request a copy of the personal data we hold about you</li>
        <li><strong>Right to correction:</strong> Request correction of inaccurate or incomplete data</li>
        <li><strong>Right to deletion:</strong> Request deletion of your personal data, subject to legal retention requirements</li>
        <li><strong>Right to withdraw consent:</strong> Withdraw your consent to data processing at any time</li>
        <li><strong>Right to data portability:</strong> Receive your data in a structured, commonly used format</li>
        <li><strong>Right to object:</strong> Object to processing of your data for specific purposes</li>
      </ul>
      <p className="text-hustle-muted leading-relaxed mb-4">
        To exercise any of these rights, please contact us at{' '}
        <a href="mailto:privacy@myhustle.com" className="text-hustle-blue hover:underline">
          privacy@myhustle.com
        </a>.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        6. Third-Party Sharing
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We share your data with the following third-party service providers, solely for the
        purposes described:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Paystack:</strong> Payment processing for subscription billing and transactions</li>
        <li><strong>Google Maps:</strong> Location services and map display for business listings</li>
        <li><strong>Analytics providers:</strong> Aggregated usage data to improve platform performance</li>
      </ul>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We do not sell your personal data to third parties. All third-party providers are bound by
        data processing agreements that comply with NDPR requirements.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        7. Data Retention
      </h2>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Active accounts:</strong> Data is retained for as long as your account remains active</li>
        <li><strong>Deleted accounts:</strong> Personal data is removed within 30 days of account deletion</li>
        <li><strong>Booking records:</strong> Retained for 2 years for dispute resolution and legal compliance</li>
        <li><strong>Analytics data:</strong> Aggregated and anonymised data may be retained indefinitely</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        8. Cookies
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We use cookies and similar technologies to operate our platform. For detailed information
        about the cookies we use and how to manage them, please see our{' '}
        <a href="/legal/cookie-policy" className="text-hustle-blue hover:underline">
          Cookie Policy
        </a>.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        9. Children&apos;s Privacy
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle is not intended for use by individuals under the age of 18. We do not knowingly
        collect personal data from children. If we become aware that we have collected data from a
        person under 18, we will take steps to delete that information promptly.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        10. Changes to This Policy
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We may update this Privacy Policy from time to time. We will notify you of significant
        changes by email or through a notice on our platform. Your continued use of MyHustle after
        changes are posted constitutes acceptance of the updated policy.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        11. Contact Us
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        For any questions, concerns, or requests regarding this Privacy Policy or your personal
        data, please contact our Data Protection Officer:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Email:{' '}
          <a href="mailto:privacy@myhustle.com" className="text-hustle-blue hover:underline">
            privacy@myhustle.com
          </a>
        </li>
        <li>Platform: MyHustle.com</li>
      </ul>
    </div>
  )
}
