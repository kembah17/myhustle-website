import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy',
  description:
    'Acceptable Use Policy for MyHustle.com — what is and isn\'t allowed on Nigeria\'s trusted business directory.',
}

export default function AcceptableUsePage() {
  return (
    <div>
      <span className="text-sm text-hustle-muted bg-hustle-light rounded-lg px-4 py-2 inline-block mb-8">
        Last updated: 5 April 2026
      </span>

      <h1 className="font-heading text-3xl font-bold text-hustle-dark mb-6">
        Acceptable Use Policy
      </h1>

      <p className="text-hustle-muted leading-relaxed mb-4">
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) outlines the rules and standards for using
        MyHustle.com (&ldquo;MyHustle&rdquo;). All users — including business owners, customers,
        and visitors — must comply with this policy. Violations may result in account suspension
        or permanent removal from the platform.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        1. Prohibited Businesses
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        The following types of businesses may not be listed on MyHustle:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Illegal activities:</strong> Any business engaged in activities that violate Nigerian federal or state laws</li>
        <li><strong>Adult content:</strong> Businesses primarily offering adult entertainment, pornography, or sexually explicit services</li>
        <li><strong>Weapons and firearms:</strong> Sale or distribution of weapons, firearms, ammunition, or explosives</li>
        <li><strong>Controlled substances:</strong> Sale of illegal drugs, unregulated pharmaceuticals, or controlled substances</li>
        <li><strong>Pyramid and Ponzi schemes:</strong> Multi-level marketing schemes, Ponzi schemes, or any fraudulent investment operations</li>
        <li><strong>Counterfeit goods:</strong> Businesses selling fake, counterfeit, or pirated products</li>
        <li><strong>Unlicensed financial services:</strong> Unregistered lending, forex trading, or investment services not authorised by CBN or SEC</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        2. Prohibited Content
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        Users may not post, upload, or share the following content on MyHustle:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Hate speech:</strong> Content that promotes hatred, violence, or discrimination based on ethnicity, religion, gender, disability, or any protected characteristic</li>
        <li><strong>Discriminatory content:</strong> Listings or reviews that discriminate against individuals or groups</li>
        <li><strong>False or misleading information:</strong> Deliberately inaccurate business details, fake reviews, or deceptive claims</li>
        <li><strong>Copyrighted material:</strong> Photos, text, or other content used without the owner&apos;s permission</li>
        <li><strong>Spam:</strong> Repetitive, irrelevant, or unsolicited promotional content</li>
        <li><strong>Malicious content:</strong> Links to malware, phishing sites, or other harmful resources</li>
        <li><strong>Personal information:</strong> Publishing another person&apos;s private information without consent</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        3. Account Misuse
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        The following activities are strictly prohibited:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li><strong>Fake listings:</strong> Creating listings for businesses that do not exist or that you do not own or represent</li>
        <li><strong>Review manipulation:</strong> Writing fake reviews, paying for reviews, or coercing customers to leave positive reviews</li>
        <li><strong>Multiple accounts:</strong> Creating multiple accounts to list the same business or circumvent enforcement actions</li>
        <li><strong>Unauthorised scraping:</strong> Using automated tools to extract data from MyHustle without written permission</li>
        <li><strong>Impersonation:</strong> Claiming to be another business, person, or MyHustle representative</li>
        <li><strong>System abuse:</strong> Attempting to exploit vulnerabilities, overload servers, or interfere with platform operations</li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        4. Enforcement Process
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        When we identify a violation of this policy, we follow a graduated enforcement process:
      </p>

      <h3 className="font-heading text-lg font-medium text-hustle-dark mt-6 mb-3">
        Step 1: Warning
      </h3>
      <p className="text-hustle-muted leading-relaxed mb-4">
        For first-time or minor violations, we will send a written warning via email explaining
        the violation and requesting corrective action within 48 hours.
      </p>

      <h3 className="font-heading text-lg font-medium text-hustle-dark mt-6 mb-3">
        Step 2: 7-Day Suspension
      </h3>
      <p className="text-hustle-muted leading-relaxed mb-4">
        For repeated violations or failure to address a warning, the account and all associated
        listings will be suspended for 7 days. During suspension, listings will not appear in
        search results or directory pages.
      </p>

      <h3 className="font-heading text-lg font-medium text-hustle-dark mt-6 mb-3">
        Step 3: Permanent Removal
      </h3>
      <p className="text-hustle-muted leading-relaxed mb-4">
        For severe violations, continued non-compliance, or third offences, the account will be
        permanently removed from MyHustle. This includes deletion of all listings, reviews, and
        associated data. Permanent removal decisions are final.
      </p>

      <p className="text-hustle-muted leading-relaxed mb-4">
        <strong>Note:</strong> For severe violations (e.g., illegal activity, fraud, or safety
        threats), MyHustle reserves the right to skip directly to permanent removal without
        prior warning.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        5. Reporting Violations
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        If you encounter content or behaviour that violates this policy, please report it to us:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Email:{' '}
          <a href="mailto:report@myhustle.com" className="text-hustle-blue hover:underline">
            report@myhustle.com
          </a>
        </li>
        <li>Use the &ldquo;Report this listing&rdquo; button on any business page</li>
      </ul>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We review all reports within 48 hours and will take appropriate action. Reports can be
        submitted anonymously.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        6. Changes to This Policy
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We may update this Acceptable Use Policy from time to time. Changes will be posted on
        this page with an updated &ldquo;Last updated&rdquo; date. Continued use of MyHustle
        after changes are posted constitutes acceptance of the updated policy.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        7. Contact Us
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        For questions about this policy, please contact us at{' '}
        <a href="mailto:report@myhustle.com" className="text-hustle-blue hover:underline">
          report@myhustle.com
        </a>.
      </p>
    </div>
  )
}
