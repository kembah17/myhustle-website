import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Cookie Policy for MyHustle.com — how we use cookies and similar technologies on Nigeria\'s trusted business directory.',
}

export default function CookiePolicyPage() {
  return (
    <div>
      <span className="text-sm text-hustle-muted bg-hustle-light rounded-lg px-4 py-2 inline-block mb-8">
        Last updated: 5 April 2026
      </span>

      <h1 className="font-heading text-3xl font-bold text-hustle-dark mb-6">
        Cookie Policy
      </h1>

      <p className="text-hustle-muted leading-relaxed mb-4">
        This Cookie Policy explains how MyHustle.com (&ldquo;MyHustle&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar technologies when you
        visit our platform. It explains what these technologies are, why we use them, and your
        rights to control their use.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        1. What Are Cookies?
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        Cookies are small text files that are stored on your device (computer, tablet, or mobile
        phone) when you visit a website. They are widely used to make websites work efficiently
        and to provide information to website owners.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        2. Essential Cookies
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        These cookies are strictly necessary for the platform to function. They cannot be
        switched off as the platform will not work properly without them.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm text-hustle-muted border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-hustle-light">
              <th className="text-left px-4 py-3 font-semibold text-hustle-dark">Cookie</th>
              <th className="text-left px-4 py-3 font-semibold text-hustle-dark">Provider</th>
              <th className="text-left px-4 py-3 font-semibold text-hustle-dark">Purpose</th>
              <th className="text-left px-4 py-3 font-semibold text-hustle-dark">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-3">sb-access-token</td>
              <td className="px-4 py-3">Supabase</td>
              <td className="px-4 py-3">Authentication session token — keeps you logged in</td>
              <td className="px-4 py-3">1 hour</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-3">sb-refresh-token</td>
              <td className="px-4 py-3">Supabase</td>
              <td className="px-4 py-3">Refreshes your authentication session</td>
              <td className="px-4 py-3">7 days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        3. Analytics Cookies (Planned)
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We plan to implement Google Analytics 4 (GA4) to help us understand how visitors use our
        platform. When implemented, these cookies will collect anonymised data about page views,
        traffic sources, and user behaviour. We will update this policy and request your consent
        before enabling analytics cookies.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        4. Third-Party Cookies
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        The following third-party services may set cookies when you interact with their features
        on our platform:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>
          <strong>Supabase:</strong> Authentication and session management cookies required for
          login functionality
        </li>
        <li>
          <strong>Paystack:</strong> Payment processing cookies set during checkout and
          subscription management
        </li>
      </ul>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        5. How to Manage Cookies
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        You can control and manage cookies through your browser settings. Here's how to do it
        in popular browsers:
      </p>

      <h3 className="font-heading text-lg font-medium text-hustle-dark mt-6 mb-3">
        Google Chrome
      </h3>
      <ol className="list-decimal list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Click the three-dot menu → Settings</li>
        <li>Navigate to Privacy and Security → Cookies and other site data</li>
        <li>Choose your preferred cookie settings</li>
      </ol>

      <h3 className="font-heading text-lg font-medium text-hustle-dark mt-6 mb-3">
        Mozilla Firefox
      </h3>
      <ol className="list-decimal list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Click the hamburger menu → Settings</li>
        <li>Navigate to Privacy & Security</li>
        <li>Under Cookies and Site Data, choose your preferred settings</li>
      </ol>

      <h3 className="font-heading text-lg font-medium text-hustle-dark mt-6 mb-3">
        Safari
      </h3>
      <ol className="list-decimal list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>Go to Safari → Preferences (or Settings on iOS)</li>
        <li>Click the Privacy tab</li>
        <li>Choose your preferred cookie blocking settings</li>
      </ol>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        6. What Happens If You Disable Cookies
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        If you disable essential cookies, the following features will not work:
      </p>
      <ul className="list-disc list-inside text-hustle-muted space-y-2 mb-4 ml-4">
        <li>You will not be able to log in to your account</li>
        <li>Business dashboard features will be inaccessible</li>
        <li>Booking management will not function</li>
      </ul>
      <p className="text-hustle-muted leading-relaxed mb-4">
        You can still browse business listings and search the directory without cookies, but
        personalised features require authentication cookies to be enabled.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        7. Changes to This Policy
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        We may update this Cookie Policy when we add new cookies or change how we use existing
        ones. Any changes will be posted on this page with an updated &ldquo;Last updated&rdquo;
        date.
      </p>

      <h2 className="font-heading text-xl font-semibold text-hustle-dark mt-8 mb-4">
        8. Contact Us
      </h2>
      <p className="text-hustle-muted leading-relaxed mb-4">
        If you have questions about our use of cookies, please contact us at{' '}
        <a href="mailto:privacy@myhustle.com" className="text-hustle-blue hover:underline">
          privacy@myhustle.com
        </a>.
      </p>
    </div>
  )
}
