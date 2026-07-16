import type { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/articles'
import ArticleLayout from '@/components/ArticleLayout'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import SpeakableJsonLd from '@/components/SpeakableJsonLd'
import Link from 'next/link'

export const revalidate = 86400

const slug = 'how-to-register-business-nigeria-cac-guide'
const article = getArticleBySlug(slug)!

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  keywords: article.keywords,
  openGraph: {
    title: article.title,
    description: article.description,
    type: 'article',
    publishedTime: article.date,
    modifiedTime: article.dateModified,
    url: `https://myhustle.space/insights/${slug}`,
    images: [{ url: '/logo-dark.png', width: 512, height: 512, alt: article.title }],
  },
  alternates: { canonical: `https://myhustle.space/insights/${slug}` },
}

export default function Article() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.space' },
          { name: 'Insights', url: 'https://myhustle.space/insights' },
          { name: article.title, url: `https://myhustle.space/insights/${slug}` },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          author: { '@type': 'Organization', name: 'MyHustle', url: 'https://myhustle.space' },
          publisher: {
            '@type': 'Organization',
            name: 'MyHustle',
            url: 'https://myhustle.space',
            logo: { '@type': 'ImageObject', url: 'https://myhustle.space/logo-dark.png' },
          },
          datePublished: article.date,
          dateModified: article.dateModified,
          mainEntityOfPage: { '@type': 'WebPage', '@id': `https://myhustle.space/insights/${slug}` },
          image: 'https://myhustle.space/logo-dark.png',
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '[data-speakable]'],
          },
        }}
      />
      <SpeakableJsonLd name={article.title} url={`https://myhustle.space/insights/$how-to-register-business-nigeria-cac-guide`} />
      <ArticleLayout article={article}>
        <p className="text-xl text-gray-700 leading-relaxed">
          <strong>Registering your business with the Corporate Affairs Commission (CAC) is the single most important legal step you can take as a Nigerian entrepreneur.</strong> It transforms your hustle from an informal operation into a recognised legal entity &mdash; one that can open corporate bank accounts, bid for contracts, access government grants, and build the kind of credibility that attracts serious customers and partners.
        </p>

        <p>
          This guide walks you through the entire CAC registration process as it stands in 2026, including the online portal, required documents, costs, timelines, and the common mistakes that delay or derail applications. Whether you&apos;re registering a simple business name for your side hustle or incorporating a limited liability company for a venture-backed startup, this guide has you covered.
        </p>

        <h2 id="why-register">Why You Must Register Your Business</h2>

        <p>
          Many Nigerian entrepreneurs operate informally for years before considering registration. While this approach might work in the early days, it creates serious limitations as your business grows:
        </p>

        <ul>
          <li><strong>Legal Protection:</strong> A registered business is a separate legal entity. Your personal assets are protected from business liabilities (especially with an LLC).</li>
          <li><strong>Banking Access:</strong> You cannot open a corporate bank account without CAC registration. Operating through personal accounts limits your transaction volumes and looks unprofessional to clients.</li>
          <li><strong>Contract Eligibility:</strong> Government contracts, corporate vendor programmes, and many B2B relationships require CAC registration as a minimum qualification.</li>
          <li><strong>Credibility:</strong> Registration signals legitimacy. In a market where trust is hard-won, a CAC certificate is your first proof of seriousness. Our data shows that among the 74,901 businesses on <Link href="/" className="text-hustle-blue font-medium hover:underline">MyHustle</Link>, registered businesses consistently attract more enquiries.</li>
          <li><strong>Access to Finance:</strong> Banks, microfinance institutions, and grant programmes require CAC registration. The 71 <Link href="/category/banks-microfinance" className="text-hustle-blue font-medium hover:underline">banks and microfinance institutions</Link> on our platform all require registration for business lending.</li>
          <li><strong>Intellectual Property:</strong> You cannot trademark your business name or protect your brand without first registering with CAC.</li>
        </ul>

        <h2 id="business-structures">Choosing Your Business Structure</h2>

        <p>
          Before you begin the registration process, you need to decide which business structure suits your needs. CAC offers several options, but three are most common for Nigerian SMEs:
        </p>

        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Business Name (BN)</th>
              <th>Limited Liability Company (LLC)</th>
              <th>Limited Liability Partnership (LLP)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Best For</td><td>Sole traders, freelancers, small shops</td><td>Growth businesses, startups, companies seeking investment</td><td>Professional firms (law, accounting, consulting)</td></tr>
            <tr><td>Owners</td><td>1 person (sole proprietor)</td><td>Minimum 2 shareholders, 1 director</td><td>Minimum 2 partners</td></tr>
            <tr><td>Liability</td><td>Unlimited &mdash; personal assets at risk</td><td>Limited to share capital</td><td>Limited to partnership contribution</td></tr>
            <tr><td>CAC Filing Fee</td><td>&#8358;10,000 &ndash; &#8358;15,000</td><td>&#8358;50,000 &ndash; &#8358;100,000</td><td>&#8358;50,000 &ndash; &#8358;100,000</td></tr>
            <tr><td>Total Cost (with lawyer)</td><td>&#8358;15,000 &ndash; &#8358;30,000</td><td>&#8358;100,000 &ndash; &#8358;250,000</td><td>&#8358;100,000 &ndash; &#8358;200,000</td></tr>
            <tr><td>Timeline</td><td>2 &ndash; 7 business days</td><td>2 &ndash; 4 weeks</td><td>2 &ndash; 4 weeks</td></tr>
            <tr><td>Annual Returns</td><td>Not required</td><td>Required (annual filing)</td><td>Required (annual filing)</td></tr>
            <tr><td>Can Raise Investment</td><td>No</td><td>Yes &mdash; can issue shares</td><td>Limited</td></tr>
            <tr><td>Tax Registration</td><td>Personal income tax</td><td>Company income tax (FIRS)</td><td>Partnership tax</td></tr>
          </tbody>
        </table>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
          <p className="font-semibold text-amber-800">Our Recommendation</p>
          <p className="text-amber-700 mt-1">
            If you&apos;re just starting out and testing a business idea, register a <strong>Business Name</strong> &mdash; it&apos;s fast, affordable, and sufficient for most early-stage operations. Once your business gains traction and you need to raise capital, hire employees, or bid for larger contracts, upgrade to an <strong>LLC</strong>. The 110 <Link href="/category/management-consultants" className="text-hustle-blue font-medium hover:underline">management consultants</Link> on MyHustle can help you make this transition.
          </p>
        </div>

        <h2 id="required-documents">Required Documents Checklist</h2>

        <p>
          Gather all your documents before starting the online application. Missing documents are the number one cause of registration delays.
        </p>

        <h3>For Business Name Registration</h3>
        <ul>
          <li>Valid government-issued ID (National ID, International Passport, Driver&apos;s Licence, or Voter&apos;s Card)</li>
          <li>Passport photograph (white background, recent)</li>
          <li>Proof of business address (utility bill, tenancy agreement, or signed letter from property owner)</li>
          <li>Two proposed business names (in case your first choice is taken)</li>
          <li>Nature of business description</li>
        </ul>

        <h3>For LLC Registration</h3>
        <ul>
          <li>All documents listed above for each director and shareholder</li>
          <li>Memorandum and Articles of Association (MEMART)</li>
          <li>Statement of share capital (minimum &#8358;100,000 for private company)</li>
          <li>Particulars of directors (minimum 1 director)</li>
          <li>Particulars of shareholders (minimum 2)</li>
          <li>Particulars of company secretary</li>
          <li>Registered office address</li>
          <li>Consent of first directors to act</li>
          <li>Statutory declaration of compliance (sworn before a Commissioner for Oaths)</li>
        </ul>

        <h3>For LLP Registration</h3>
        <ul>
          <li>Valid IDs and passport photographs for all partners</li>
          <li>LLP agreement (partnership deed)</li>
          <li>Particulars of designated partners (minimum 2)</li>
          <li>Registered office address</li>
          <li>Statement of compliance</li>
        </ul>

        <h2 id="step-by-step">Step-by-Step Registration Process</h2>

        <p>
          CAC has fully digitised its registration process through the Company Registration Portal (CRP). Here&apos;s how to navigate it:
        </p>

        <h3>Step 1: Create Your CAC Account</h3>
        <p>
          Visit <strong>pre.cac.gov.ng</strong> and create an account. You&apos;ll need a valid email address and phone number. Verify your email before proceeding. If you already have an account from a previous registration, log in with your existing credentials.
        </p>

        <h3>Step 2: Check Name Availability</h3>
        <p>
          Before filing, search for your proposed business name to confirm it&apos;s available. CAC will reject names that are identical or too similar to existing registered businesses. Tips for choosing a name:
        </p>
        <ul>
          <li>Avoid generic names like &quot;Best Services Limited&quot; &mdash; they&apos;re likely taken</li>
          <li>Include a unique identifier (your name, location, or a coined word)</li>
          <li>Avoid restricted words like &quot;Federal,&quot; &quot;National,&quot; &quot;Bank,&quot; or &quot;Insurance&quot; unless you have the relevant licence</li>
          <li>Prepare at least two alternative names</li>
          <li>Use our <Link href="/tools/business-name-generator" className="text-hustle-blue font-medium hover:underline">Business Name Generator</Link> for inspiration</li>
        </ul>

        <h3>Step 3: Reserve Your Name</h3>
        <p>
          Once you find an available name, reserve it through the portal. Name reservation costs &#8358;500 and is valid for 60 days. This gives you time to prepare your other documents without worrying about someone else taking your name.
        </p>

        <h3>Step 4: Complete the Registration Form</h3>
        <p>
          Fill in the online registration form with your business details:
        </p>
        <ul>
          <li><strong>Business Name:</strong> Your reserved name</li>
          <li><strong>Nature of Business:</strong> Select from CAC&apos;s classification (you can choose up to 4 business activities)</li>
          <li><strong>Business Address:</strong> Must be a physical address, not a P.O. Box</li>
          <li><strong>Proprietor/Director Details:</strong> Full names, addresses, nationality, occupation, date of birth</li>
          <li><strong>Share Capital (LLC only):</strong> Authorised and issued share capital, allocation among shareholders</li>
        </ul>

        <h3>Step 5: Upload Documents</h3>
        <p>
          Upload all required documents in the specified formats (usually PDF or JPEG). Ensure documents are clear, legible, and within the file size limits. For LLC registration, your MEMART and statutory declaration must be properly executed and stamped.
        </p>

        <h3>Step 6: Pay the Filing Fee</h3>
        <p>
          Pay the applicable fee through the portal. CAC accepts payment via Remita, bank transfer, or card payment. Keep your payment receipt &mdash; you&apos;ll need it if there are any issues with your application.
        </p>

        <h3>Step 7: Submit and Track</h3>
        <p>
          Submit your application and note your tracking number. You can monitor the status of your application through the portal. CAC will either approve your application, request additional information, or raise queries that need to be addressed.
        </p>

        <h3>Step 8: Receive Your Certificate</h3>
        <p>
          Upon approval, CAC issues a digital certificate of registration (for Business Names) or certificate of incorporation (for LLCs and LLPs). You can download this from the portal. The certificate includes your unique RC (Registration Certificate) number, which you&apos;ll use for all official business purposes.
        </p>

        <h2 id="costs-breakdown">Costs Breakdown (2026 Updated)</h2>

        <p>
          Understanding the full cost helps you budget properly. Here&apos;s what to expect:
        </p>

        <table>
          <thead>
            <tr>
              <th>Cost Item</th>
              <th>Business Name</th>
              <th>LLC (Private)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Name Reservation</td><td>&#8358;500</td><td>&#8358;500</td></tr>
            <tr><td>Registration/Filing Fee</td><td>&#8358;10,000 &ndash; &#8358;15,000</td><td>&#8358;50,000 &ndash; &#8358;100,000</td></tr>
            <tr><td>Stamp Duty</td><td>&#8358;500</td><td>&#8358;15,000 &ndash; &#8358;30,000</td></tr>
            <tr><td>MEMART Preparation</td><td>N/A</td><td>&#8358;20,000 &ndash; &#8358;50,000</td></tr>
            <tr><td>Statutory Declaration</td><td>N/A</td><td>&#8358;5,000 &ndash; &#8358;10,000</td></tr>
            <tr><td>Legal/Agent Fee (optional)</td><td>&#8358;5,000 &ndash; &#8358;15,000</td><td>&#8358;30,000 &ndash; &#8358;80,000</td></tr>
            <tr><td className="font-bold">Total Estimate</td><td className="font-bold">&#8358;15,000 &ndash; &#8358;30,000</td><td className="font-bold">&#8358;100,000 &ndash; &#8358;250,000</td></tr>
          </tbody>
        </table>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
          <p className="font-semibold text-blue-800">Cost-Saving Tip</p>
          <p className="text-blue-700 mt-1">
            You can register a Business Name yourself through the CAC portal without a lawyer for as little as &#8358;10,500 (name reservation + filing fee + stamp duty). For LLC registration, we recommend using a lawyer or accredited CAC agent to avoid costly errors in your MEMART and other legal documents.
          </p>
        </div>

        <h2 id="timeline">Timeline Expectations</h2>

        <p>
          Registration timelines have improved significantly since CAC digitised its processes, but they still vary:
        </p>

        <ul>
          <li><strong>Business Name:</strong> 2 &ndash; 7 business days from submission to certificate issuance. Simple applications with complete documents are often approved within 48 hours.</li>
          <li><strong>LLC:</strong> 2 &ndash; 4 weeks from submission to certificate of incorporation. The process involves more review stages, and any queries from CAC can add 1 &ndash; 2 weeks.</li>
          <li><strong>LLP:</strong> 2 &ndash; 4 weeks, similar to LLC timelines.</li>
        </ul>

        <p>
          <strong>Factors that cause delays:</strong>
        </p>
        <ul>
          <li>Incomplete or unclear documents (the most common cause)</li>
          <li>Name conflicts that weren&apos;t caught during reservation</li>
          <li>Errors in MEMART or statutory declaration</li>
          <li>CAC system downtime (less frequent now but still occurs)</li>
          <li>High volume periods (January and September tend to be busiest)</li>
        </ul>

        <h2 id="common-mistakes">Common Mistakes to Avoid</h2>

        <p>
          Having processed thousands of registrations, CAC agents report these as the most frequent errors:
        </p>

        <ol>
          <li>
            <strong>Choosing an unavailable name:</strong> Always search thoroughly before reserving. Check not just exact matches but similar-sounding names. &quot;Apex Solutions Limited&quot; and &quot;Apex Solution Limited&quot; will likely conflict.
          </li>
          <li>
            <strong>Mismatched information:</strong> Ensure your name appears exactly the same across all documents. If your ID says &quot;Oluwaseun Adebayo&quot; but your form says &quot;Seun Adebayo,&quot; expect a query.
          </li>
          <li>
            <strong>Wrong business classification:</strong> Choose business activities that accurately reflect what you do. Selecting too many unrelated activities can raise red flags. Selecting too few can limit your operations later.
          </li>
          <li>
            <strong>Using a residential address without permission:</strong> If you&apos;re registering your business at a residential address, ensure your tenancy agreement or property documents permit commercial use.
          </li>
          <li>
            <strong>Inadequate share capital (LLC):</strong> While the minimum is &#8358;100,000, setting your share capital too low can limit your ability to bid for contracts or access certain financial products. Many businesses set it at &#8358;1,000,000 or higher.
          </li>
          <li>
            <strong>Not swearing the statutory declaration:</strong> The statutory declaration for LLC registration must be sworn before a Commissioner for Oaths or Notary Public. A simple signature is not sufficient.
          </li>
          <li>
            <strong>Ignoring post-registration requirements:</strong> Registration is not the end &mdash; it&apos;s the beginning. See the next section for what comes after.
          </li>
        </ol>

        <h2 id="post-registration">Post-Registration Steps</h2>

        <p>
          Congratulations on registering your business! But don&apos;t stop here. These post-registration steps are essential for full legal compliance and operational readiness:
        </p>

        <h3>1. Tax Registration (TIN)</h3>
        <p>
          Register with the Federal Inland Revenue Service (FIRS) for your Tax Identification Number (TIN). For Business Names, you&apos;ll file under personal income tax. For LLCs, you&apos;ll register for Company Income Tax, VAT (if applicable), and PAYE (if you have employees). CAC now automatically generates a TIN during registration, but you should verify and activate it with FIRS.
        </p>

        <h3>2. Open a Corporate Bank Account</h3>
        <p>
          Take your CAC certificate, TIN, and other documents to your preferred bank to open a corporate account. Most of the 71 <Link href="/category/banks-microfinance" className="text-hustle-blue font-medium hover:underline">banks and microfinance institutions</Link> on MyHustle require your CAC certificate, MEMART (for LLCs), board resolution, and directors&apos; IDs.
        </p>

        <h3>3. Register with Relevant Regulatory Bodies</h3>
        <p>
          Depending on your industry, you may need additional registrations:
        </p>
        <ul>
          <li><strong>NAFDAC:</strong> For food, drugs, cosmetics, and medical devices</li>
          <li><strong>SON:</strong> For manufactured products requiring standards certification</li>
          <li><strong>State Business Premises Registration:</strong> Required in most states for physical business locations</li>
          <li><strong>Professional Bodies:</strong> For regulated professions (law, medicine, accounting, engineering)</li>
          <li><strong>SCUML:</strong> Special Control Unit against Money Laundering &mdash; required for designated non-financial businesses</li>
        </ul>

        <h3>4. Get Your Business Online</h3>
        <p>
          In 2026, digital visibility is not optional. Our data shows that 57.7% of the 74,901 businesses on MyHustle have websites, and those with online presence consistently receive more customer enquiries. Start with these steps:
        </p>
        <ul>
          <li><Link href="/list-your-business" className="text-hustle-blue font-medium hover:underline">List your business on MyHustle</Link> &mdash; it&apos;s free and takes less than 5 minutes</li>
          <li>Create a Google Business Profile for local search visibility</li>
          <li>Set up a simple website or landing page</li>
          <li>Establish social media presence on platforms your customers use</li>
        </ul>

        <h3>5. Set Up Proper Bookkeeping</h3>
        <p>
          Start tracking income and expenses from day one. For LLCs, you&apos;re legally required to maintain proper books of account. Even for Business Names, good records make tax filing easier and help you understand your business performance.
        </p>

        <h3>6. File Annual Returns (LLC and LLP)</h3>
        <p>
          LLCs and LLPs must file annual returns with CAC. Failure to file can result in penalties and eventually lead to your company being struck off the register. Set a calendar reminder for your filing deadline.
        </p>

        <h2 id="using-an-agent">Should You Use a Registration Agent?</h2>

        <p>
          You can register a Business Name yourself through the CAC portal &mdash; the process is straightforward and well-documented. However, for LLC registration, using an accredited CAC agent or lawyer offers several advantages:
        </p>

        <ul>
          <li><strong>Document preparation:</strong> Agents prepare your MEMART, statutory declaration, and other legal documents correctly the first time</li>
          <li><strong>Error avoidance:</strong> Experienced agents know the common pitfalls and can navigate CAC queries efficiently</li>
          <li><strong>Time savings:</strong> An agent handles the back-and-forth with CAC, freeing you to focus on your business</li>
          <li><strong>Post-registration support:</strong> Many agents also handle TIN registration, bank account opening, and regulatory filings</li>
        </ul>

        <p>
          You can find accredited registration agents and <Link href="/category/management-consultants" className="text-hustle-blue font-medium hover:underline">management consultants</Link> who offer CAC registration services on MyHustle. Expect to pay &#8358;30,000 &ndash; &#8358;80,000 for LLC registration through an agent, inclusive of their professional fee.
        </p>

        <h2 id="faq">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Can I register a business online without visiting any office?</h3>
            <p>
              Yes, for Business Name registration, the entire process is online. For LLC registration, you&apos;ll need to visit a Commissioner for Oaths to swear your statutory declaration, but the CAC filing itself is fully online.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Can a non-Nigerian register a business in Nigeria?</h3>
            <p>
              Yes, but with conditions. Non-Nigerians can be shareholders and directors of an LLC, but the company must have a minimum share capital of &#8358;100 million for wholly foreign-owned companies (or lower thresholds for joint ventures with Nigerian partners). Business Name registration is limited to Nigerian citizens and permanent residents.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">What happens if I don&apos;t register my business?</h3>
            <p>
              Operating an unregistered business is not illegal per se, but it limits your options significantly. You cannot open corporate bank accounts, bid for government contracts, access most business loans, or protect your business name from being registered by someone else.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Can I change my business name after registration?</h3>
            <p>
              Yes, but it requires filing an amendment with CAC and paying additional fees. For LLCs, a name change requires a special resolution by shareholders. It&apos;s much easier to get the name right the first time.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How do I convert a Business Name to an LLC?</h3>
            <p>
              You cannot directly convert a Business Name to an LLC. You&apos;ll need to register a new LLC separately. However, you can use the same or similar name (subject to availability) and transfer your business operations to the new entity.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Is my CAC registration valid nationwide?</h3>
            <p>
              Yes. CAC registration is a federal process, and your certificate is valid across all 36 states and the FCT. However, you may need additional state-level registrations (business premises permit) in each state where you operate a physical location.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">What is the penalty for late annual returns?</h3>
            <p>
              CAC charges a penalty for late filing of annual returns. The penalty increases with each year of non-compliance. Persistent non-filing can lead to your company being listed as inactive and eventually struck off the register.
            </p>
          </div>
        </div>

        <h2 id="next-steps">Your Next Steps</h2>

        <p>
          Business registration is the foundation, but it&apos;s just the beginning of your entrepreneurial journey. Here&apos;s what to do after you receive your certificate:
        </p>

        <ol>
          <li><strong>Get your TIN</strong> and register for applicable taxes</li>
          <li><strong>Open a corporate bank account</strong> to separate personal and business finances</li>
          <li><strong><Link href="/list-your-business" className="text-hustle-blue font-medium hover:underline">List your business on MyHustle</Link></strong> to start attracting customers immediately</li>
          <li><strong>Build your online presence</strong> with a website and social media profiles</li>
          <li><strong>Set up bookkeeping</strong> from day one</li>
          <li><strong>Network with other businesses</strong> in your <Link href="/categories" className="text-hustle-blue font-medium hover:underline">category</Link> and city</li>
        </ol>

        <p>
          Nigeria&apos;s business landscape is growing rapidly &mdash; our directory alone tracks 74,901 active businesses across <Link href="/" className="text-hustle-blue font-medium hover:underline">39 cities and 218 categories</Link>. By registering your business properly, you&apos;re positioning yourself to compete effectively in this dynamic market.
        </p>

        <div className="bg-hustle-light rounded-xl p-6 my-6 not-prose">
          <h3 className="text-lg font-heading font-bold text-hustle-dark mb-2">Need Help with Registration?</h3>
          <p className="text-hustle-muted">
            Browse our directory of <Link href="/category/management-consultants" className="text-hustle-blue font-medium hover:underline">management consultants</Link> who offer CAC registration services, or use our <Link href="/tools/cac-registration-guide" className="text-hustle-blue font-medium hover:underline">interactive CAC registration guide</Link> for step-by-step assistance. You can also try our <Link href="/tools/business-name-generator" className="text-hustle-blue font-medium hover:underline">Business Name Generator</Link> to find the perfect name for your venture.
          </p>
        </div>
      </ArticleLayout>
    </>
  )
}
