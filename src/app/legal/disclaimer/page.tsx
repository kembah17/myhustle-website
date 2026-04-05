import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Disclaimer for MyHustle.com — important information about listing accuracy, business quality, and platform limitations.',
}

export default function DisclaimerPage() {
  return (
    <div>
      <span className="text-sm text-hustle-muted bg-hustle-light rounded-lg px-4 py-2 inline-block mb-8">
        Last updated: 5 April 2026
      </span>

      <h1 className="font-heading text-3xl font-bold text-hustle-dark mb-6">
        Disclaimer
      </h1>

      <p className="text-hustle-muted leading-relaxed mb-4">
        The information provided on MyHustle.com (&ldquo;MyHustle&rdquo;) is for general
        informational purposes only. By using our platform, you acknowledge and agree to the
        following disclaimers.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        1. Listing Accuracy
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle aggregates business information from multiple sources, including public records,
        user submissions, and third-party data providers. Some listing data may have been sourced
        from publicly available information and may be outdated, incomplete, or incorrect.
      </p>
      <p className="text-hustle-muted leading-relaxed mb-4">
        While we make reasonable efforts to ensure accuracy, we cannot guarantee that all business
        details — including names, addresses, phone numbers, operating hours, and services — are
        current or correct. Business owners are encouraged to{' '}
        <a href="/list-your-business" className="text-hustle-blue hover:underline">
          claim and verify their listings
        </a>{' '}
        to ensure information is accurate.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        2. Business Quality
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle does not endorse, recommend, or guarantee any business listed on our platform.
        The inclusion of a business in our directory does not constitute an endorsement of its
        products, services, or business practices. We do not verify the quality, safety,
        licensing, or regulatory compliance of listed businesses unless explicitly stated through
        our verification tiers.
      </p>
      <p className="text-hustle-muted leading-relaxed mb-4">
        Users are advised to exercise their own judgement and conduct their own due diligence
        before engaging with any business found on MyHustle.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        3. User-Generated Content
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        Reviews, ratings, photos, and other content submitted by users represent the opinions and
        experiences of individual users. This content is not verified, endorsed, or edited by
        MyHustle. We do not guarantee the accuracy, reliability, or completeness of any
        user-generated content.
      </p>
      <p className="text-hustle-muted leading-relaxed mb-4">
        If you believe any user-generated content is false, misleading, or violates our policies,
        please report it to{' '}
        <a href="mailto:report@myhustle.com" className="text-hustle-blue hover:underline">
          report@myhustle.com
        </a>.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        4. External Links
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle may contain links to third-party websites, including business websites, social
        media profiles, and payment processors. These links are provided for convenience only.
        We are not responsible for the content, privacy practices, or availability of any
        third-party websites. Visiting external links is at your own risk.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        5. No Professional Advice
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        The information on MyHustle is provided as a directory service and should not be
        construed as professional, legal, financial, medical, or any other form of specialist
        advice. Always seek the advice of qualified professionals for matters requiring
        specialist expertise.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        6. Service Availability
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        MyHustle strives to maintain continuous platform availability. However, we do not
        guarantee uninterrupted access to our services. The platform may experience downtime
        for maintenance, updates, or due to circumstances beyond our control. We will make
        reasonable efforts to notify users of planned maintenance in advance.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        7. Limitation of Liability
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        To the fullest extent permitted by Nigerian law, MyHustle shall not be liable for any
        direct, indirect, incidental, consequential, or punitive damages arising from your use
        of the platform, reliance on any information provided, or interactions with businesses
        listed on our directory.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        8. Contact Us
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        If you have questions or concerns about this Disclaimer, please contact us at{' '}
        <a href="mailto:legal@myhustle.com" className="text-hustle-blue hover:underline">
          legal@myhustle.com
        </a>.
      </p>
    </div>
  )
}
