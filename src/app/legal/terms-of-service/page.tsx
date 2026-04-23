import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for MyHustle.com — the rules and conditions governing your use of Nigeria\'s trusted business directory.',
}

export default function TermsOfServicePage() {
  return (
    <div>
      <span className="text-sm text-hustle-muted bg-hustle-light rounded-lg px-4 py-2 inline-block mb-8">
        Last updated: 5 April 2026
      </span>

      <h1 className="font-heading text-3xl font-bold text-hustle-dark mb-6">
        Terms of Service
      </h1>

      <p className="text-hustle-muted leading-relaxed mb-4">
        Welcome to MyHustle.com (&ldquo;MyHustle&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of our platform. By using MyHustle, you agree to be bound by these Terms. If you do not
        agree, please do not use our services.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        1. Platform Description
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle.com is a business directory platform that connects customers with Nigerian small
        and medium enterprises (SMEs). Our services include business listing display, search and
        discovery, booking facilitation, and business management tools.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        2. Eligibility
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        To use MyHustle, you must:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Be at least 18 years of age</li>
        <li>Be a Nigerian resident or operate a business registered in Nigeria</li>
        <li>Have the legal capacity to enter into a binding agreement</li>
        <li>Provide accurate and complete registration information</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        3. User Obligations
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        When using MyHustle, you agree to:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Provide accurate, current, and complete information about yourself and your business</li>
        <li>Keep your account credentials secure and confidential</li>
        <li>Not create spam listings, fake reviews, or misleading content</li>
        <li>Not use the platform for any unlawful purpose</li>
        <li>Not attempt to scrape, copy, or reproduce platform data without permission</li>
        <li>Comply with our <a href="/legal/acceptable-use" className="text-hustle-blue hover:underline">Acceptable Use Policy</a></li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        4. Business Listing Rules
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        Business owners who list on MyHustle must:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Operate a legitimate business in Nigeria</li>
        <li>Provide accurate contact information, including a valid phone number</li>
        <li>Keep business hours, services, and pricing information up to date</li>
        <li>Only upload photos and content they have the right to use</li>
        <li>Not list prohibited businesses as defined in our Acceptable Use Policy</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        5. Booking Terms
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle facilitates bookings between customers and businesses. Please note:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>MyHustle acts as an intermediary and is not a party to the service agreement between customer and business</li>
        <li>We are not responsible for the quality, safety, or legality of services provided by listed businesses</li>
        <li>Disputes regarding services are between the customer and the business</li>
        <li>Businesses are responsible for honouring confirmed bookings or communicating changes promptly</li>
        <li>Customers should arrive on time and communicate cancellations in advance</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        6. Subscription and Payment Terms
      </h2>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Subscription payments are processed through Paystack</li>
        <li>Subscriptions auto-renew at the end of each billing period unless cancelled</li>
        <li>You may cancel your subscription at any time through your dashboard</li>
        <li>No refunds are provided for partial billing periods</li>
        <li>We reserve the right to change pricing with 30 days' notice</li>
        <li>Free listings remain available with limited features</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        7. Intellectual Property
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        The MyHustle platform, including its design, code, logos, and branding, is owned by
        MyHustle and protected by Nigerian intellectual property laws. You may not copy, modify,
        or distribute any part of our platform without written permission.
      </p>
      <p className="text-hustle-muted leading-relaxed mb-4">
        You retain ownership of content you upload to MyHustle (photos, descriptions, etc.).
        However, by uploading content, you grant MyHustle a non-exclusive, royalty-free,
        worldwide licence to display, reproduce, and distribute that content in connection with
        our services.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        8. Limitation of Liability
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        To the maximum extent permitted by Nigerian law:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>MyHustle is not liable for the quality, safety, or legality of services provided by listed businesses</li>
        <li>We do not guarantee the accuracy of listing information, particularly for data sourced from public records</li>
        <li>We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform</li>
        <li>Our total liability shall not exceed the amount you paid to MyHustle in the 12 months preceding the claim</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        9. Dispute Resolution
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes
        arising from or relating to these Terms or your use of MyHustle shall be subject to the
        exclusive jurisdiction of the courts of Lagos State, Nigeria. We encourage you to contact
        us first to resolve any issues informally.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        10. Account Termination
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle reserves the right to suspend or permanently remove accounts that:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Violate these Terms or our Acceptable Use Policy</li>
        <li>Contain fraudulent or misleading information</li>
        <li>Engage in spam, review manipulation, or other abusive behaviour</li>
        <li>Remain inactive for more than 12 months (business accounts)</li>
      </ul>
      <p className="text-hustle-muted leading-relaxed mb-4">
        You may delete your account at any time through your dashboard settings. Upon deletion,
        your personal data will be removed in accordance with our{' '}
        <a href="/legal/privacy-policy" className="text-hustle-blue hover:underline">
          Privacy Policy
        </a>.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        11. Changes to These Terms
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We may update these Terms from time to time. We will provide at least 30 days' notice
        of material changes via email to your registered address. Your continued use of MyHustle
        after the effective date of changes constitutes acceptance of the updated Terms.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        12. Contact Us
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        If you have questions about these Terms, please contact us:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Email:{' '}
          <a href="mailto:legal@myhustle.com" className="text-hustle-blue hover:underline">
            legal@myhustle.com
          </a>
        </li>
        <li>Platform: MyHustle.com</li>
      </ul>
    </div>
  )
}
