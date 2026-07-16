import type { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/articles'
import ArticleLayout from '@/components/ArticleLayout'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import SpeakableJsonLd from '@/components/SpeakableJsonLd'
import Link from 'next/link'

export const revalidate = 86400

const slug = 'how-to-find-reliable-business-nigeria'
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
      <SpeakableJsonLd name={article.title} url={`https://myhustle.space/insights/$how-to-find-reliable-business-nigeria`} />
      <ArticleLayout article={article}>
        <p className="text-xl text-gray-700 leading-relaxed">
          <strong>Finding a reliable business in Nigeria can feel like navigating a minefield.</strong> Whether you need a caterer for your wedding, a contractor to renovate your office, or a diagnostics lab for medical tests, the stakes are high and the information asymmetry is real. In a market of 74,901 businesses across 39 cities, how do you separate the trustworthy operators from the ones who will waste your time and money?
        </p>

        <p>
          This guide provides a practical, step-by-step framework for finding, vetting, and choosing reliable businesses in Nigeria. It&apos;s based on common patterns we&apos;ve observed across the thousands of businesses listed on <Link href="/" className="text-hustle-blue font-medium hover:underline">MyHustle</Link>, combined with consumer protection best practices adapted for the Nigerian market.
        </p>

        <h2 id="why-its-hard">Why Finding Reliable Businesses Is Challenging in Nigeria</h2>

        <p>
          Before diving into solutions, it helps to understand why the problem exists in the first place. Several structural factors make business discovery and verification harder in Nigeria than in more developed markets:
        </p>

        <ul>
          <li><strong>Low digital presence:</strong> While 99.5% of businesses on our platform have phone numbers, only 57.7% have websites. Many legitimate businesses operate entirely offline, making them invisible to online searches.</li>
          <li><strong>Informal economy dominance:</strong> A significant portion of Nigerian businesses operate without formal registration, making it harder to verify their legitimacy through official channels.</li>
          <li><strong>Limited review culture:</strong> Unlike markets where Google Reviews or Yelp provide social proof, Nigeria&apos;s review ecosystem is still developing. You can&apos;t always rely on online reviews to gauge quality.</li>
          <li><strong>Word-of-mouth dependency:</strong> Most Nigerians find service providers through personal recommendations. While effective, this limits your options to your immediate network&apos;s experience.</li>
          <li><strong>Inconsistent quality standards:</strong> Without strong industry regulation in many sectors, quality varies enormously between providers offering the same service at similar prices.</li>
        </ul>

        <h2 id="red-flags">Red Flags to Watch For</h2>

        <p>
          Before you engage any business, watch for these warning signs that suggest unreliability or potential fraud:
        </p>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
          <h3 className="font-semibold text-red-800 mb-2">Immediate Red Flags</h3>
          <ul className="text-red-700 space-y-2">
            <li><strong>No physical address:</strong> A legitimate business should be able to provide a verifiable physical location. &quot;We work from different locations&quot; is acceptable for mobile services but not for established businesses.</li>
            <li><strong>Pressure to pay upfront in full:</strong> Reputable businesses typically accept deposits (30&ndash;50%) rather than demanding 100% payment before any work begins.</li>
            <li><strong>No written agreement:</strong> Any business that refuses to put terms in writing &mdash; even a simple WhatsApp message confirming scope, price, and timeline &mdash; is a risk.</li>
            <li><strong>Prices far below market rate:</strong> If a quote seems too good to be true, it usually is. Extremely low prices often mean cut corners, hidden charges, or outright fraud.</li>
            <li><strong>No portfolio or references:</strong> Established businesses should be able to show previous work or provide references from past clients.</li>
            <li><strong>Unprofessional communication:</strong> Slow responses, vague answers to specific questions, and inability to explain their process clearly are warning signs.</li>
            <li><strong>Personal bank accounts only:</strong> A business that can only accept payment to a personal bank account may not be formally registered.</li>
          </ul>
        </div>

        <h2 id="verification-steps">How to Verify a Business</h2>

        <p>
          Once you&apos;ve identified a potential service provider, run through this verification checklist before committing your money:
        </p>

        <h3>1. Check CAC Registration</h3>
        <p>
          The Corporate Affairs Commission (CAC) maintains a public registry of all registered businesses in Nigeria. You can verify a business&apos;s registration status through the CAC portal at <strong>search.cac.gov.ng</strong>. A registered business has at minimum demonstrated the commitment to formalise their operations. While registration alone doesn&apos;t guarantee quality, the absence of registration for an established business is a concern.
        </p>

        <h3>2. Verify Their Online Presence</h3>
        <p>
          Check multiple online touchpoints:
        </p>
        <ul>
          <li><strong>Website:</strong> Does the business have a professional website with clear contact information, service descriptions, and an about page? Among the 74,901 businesses on MyHustle, 43,246 (57.7%) have websites &mdash; those that do tend to be more established.</li>
          <li><strong>Google Business Profile:</strong> Search for the business on Google Maps. A claimed and updated Google Business Profile with photos, hours, and reviews suggests an active, legitimate operation.</li>
          <li><strong>Social media:</strong> Check their Instagram, Facebook, or LinkedIn profiles. Look for consistent posting, real customer interactions, and a history that matches their claimed experience.</li>
          <li><strong>Directory listings:</strong> Search for the business on <Link href="/" className="text-hustle-blue font-medium hover:underline">MyHustle</Link> and other business directories. Listed businesses have been through at least a basic verification process.</li>
        </ul>

        <h3>3. Request and Check References</h3>
        <p>
          Ask the business for 2&ndash;3 references from recent clients. Then actually call those references and ask specific questions:
        </p>
        <ul>
          <li>Was the work completed on time?</li>
          <li>Was the final price close to the original quote?</li>
          <li>How did they handle problems or changes?</li>
          <li>Would you use them again?</li>
        </ul>
        <p>
          Be cautious of businesses that claim they can&apos;t provide references due to &quot;client confidentiality.&quot; While some industries have legitimate privacy concerns, most service businesses should be able to connect you with willing past clients.
        </p>

        <h3>4. Visit Their Location</h3>
        <p>
          If the business has a physical location, visit it before committing to a large project or payment. A physical visit tells you more than any website or phone call. Look for:
        </p>
        <ul>
          <li>Professional signage and branding</li>
          <li>Clean, organised workspace</li>
          <li>Visible staff and active operations</li>
          <li>Equipment and tools appropriate for their claimed services</li>
        </ul>

        <h3>5. Start Small</h3>
        <p>
          When possible, test a business with a small project before committing to a large one. Hire the caterer for a small gathering before booking them for your 500-guest wedding. Use the contractor for a minor repair before giving them a full renovation. This approach limits your risk while giving you firsthand experience of their quality, reliability, and communication.
        </p>

        <h2 id="using-directories">Using Online Directories Effectively</h2>

        <p>
          Online business directories like <Link href="/" className="text-hustle-blue font-medium hover:underline">MyHustle</Link> are one of the most efficient ways to find businesses in Nigeria. Here&apos;s how to use them effectively:
        </p>

        <h3>Search by Category and Location</h3>
        <p>
          Start by browsing the relevant <Link href="/categories" className="text-hustle-blue font-medium hover:underline">business category</Link> in your city. MyHustle covers 218 categories across 39 cities and 1,500 neighbourhoods, so you can find businesses specific to your area. Searching by location helps you find providers who are close enough to serve you efficiently.
        </p>

        <h3>Compare Multiple Options</h3>
        <p>
          Don&apos;t settle for the first business you find. Compare at least 3 providers on:
        </p>
        <ul>
          <li>Services offered and specialisations</li>
          <li>Contact information completeness (phone, website, address)</li>
          <li>Business description and professionalism</li>
          <li>Years in operation (if available)</li>
        </ul>

        <h3>Look for Complete Profiles</h3>
        <p>
          Businesses with complete directory profiles &mdash; including descriptions, contact details, website links, and category information &mdash; tend to be more professional and responsive. On MyHustle, 97.8% of businesses have descriptions and 99.5% have phone numbers, but the quality and completeness of these details varies. A business that has taken the time to create a thorough profile is more likely to take your enquiry seriously.
        </p>

        <h3>Use Directory Information as a Starting Point</h3>
        <p>
          A directory listing gives you the information you need to begin your verification process: business name (for CAC checks), phone number (for direct contact), website (for online verification), and address (for physical visits). Use this information to run through the verification steps outlined above.
        </p>

        <h2 id="questions-to-ask">Questions to Ask Before Hiring Any Business</h2>

        <p>
          Regardless of the industry, these questions help you assess reliability and set clear expectations:
        </p>

        <ol>
          <li><strong>&quot;How long have you been in this business?&quot;</strong> &mdash; Experience matters, especially for skilled services like construction, healthcare, and consulting.</li>
          <li><strong>&quot;Can you provide a written quote with a breakdown?&quot;</strong> &mdash; A detailed quote shows professionalism and helps prevent surprise charges later.</li>
          <li><strong>&quot;What is your payment structure?&quot;</strong> &mdash; Expect a deposit (30&ndash;50%) with the balance due on completion or in milestones. Avoid businesses demanding full payment upfront.</li>
          <li><strong>&quot;What happens if there are problems or delays?&quot;</strong> &mdash; A reliable business will have a clear process for handling issues, not just vague reassurances.</li>
          <li><strong>&quot;Are you registered with CAC?&quot;</strong> &mdash; For any significant engagement, working with a registered business provides legal recourse if things go wrong.</li>
          <li><strong>&quot;Can I see examples of your previous work?&quot;</strong> &mdash; Photos, case studies, or client testimonials demonstrate capability.</li>
          <li><strong>&quot;Who will actually do the work?&quot;</strong> &mdash; Some businesses subcontract work to third parties. Know who you&apos;re actually hiring.</li>
          <li><strong>&quot;What is your timeline for completion?&quot;</strong> &mdash; Get specific dates, not vague promises. Build in buffer time for Nigerian business realities.</li>
        </ol>

        <h2 id="industry-tips">Industry-Specific Tips</h2>

        <h3>Hiring a Caterer</h3>
        <p>
          With 167 <Link href="/category/catering-services" className="text-hustle-blue font-medium hover:underline">catering businesses</Link> on MyHustle, you have options. Always request a tasting session before booking for a large event. Ask about their food safety practices, staff hygiene protocols, and how they handle dietary requirements. Check if they have NAFDAC registration for any packaged food items. Get the menu, pricing per head, and service terms in writing.
        </p>

        <h3>Choosing a Healthcare Provider</h3>
        <p>
          For <Link href="/category/diagnostics-labs" className="text-hustle-blue font-medium hover:underline">diagnostics labs and clinics</Link>, verify that the facility is registered with the relevant state health ministry. Check if their practitioners are licensed by the appropriate professional body (Medical and Dental Council of Nigeria for doctors, Medical Laboratory Science Council for lab scientists). Ask about their equipment &mdash; modern, well-maintained diagnostic equipment produces more reliable results.
        </p>

        <h3>Engaging a Contractor</h3>
        <p>
          Construction and renovation projects are among the highest-risk engagements. Always visit the contractor&apos;s previous projects in person. Request a detailed bill of quantities (BOQ) rather than a lump-sum quote. Structure payments in milestones tied to specific completion stages. Consider hiring an independent quantity surveyor to verify the contractor&apos;s pricing.
        </p>

        <h3>Selecting a Consultant</h3>
        <p>
          The 110 <Link href="/category/management-consultants" className="text-hustle-blue font-medium hover:underline">management consultants</Link> on our platform range from solo practitioners to established firms. Ask about their specific experience in your industry or problem area. Request a proposal that outlines methodology, deliverables, and timeline &mdash; not just a price. Check their LinkedIn profiles and professional credentials.
        </p>

        <h3>Choosing a Beauty or Fashion Professional</h3>
        <p>
          For <Link href="/category/beauty-cosmetics" className="text-hustle-blue font-medium hover:underline">beauty</Link> and <Link href="/category/hair-salons" className="text-hustle-blue font-medium hover:underline">hair salon</Link> services, always check their Instagram portfolio for recent work. Book a trial session before committing to event-day services (especially for weddings). Ask about the products they use &mdash; quality products matter for both results and safety. Verify hygiene practices, especially for services involving skin contact.
        </p>

        <h2 id="protecting-yourself">Protecting Yourself</h2>

        <p>
          Even with thorough vetting, things can go wrong. Protect yourself with these practices:
        </p>

        <ul>
          <li><strong>Always get agreements in writing:</strong> Even a WhatsApp message confirming scope, price, and timeline creates a record you can reference later.</li>
          <li><strong>Pay through traceable channels:</strong> Use bank transfers rather than cash. The transaction record serves as proof of payment.</li>
          <li><strong>Document everything:</strong> Take photos of work in progress, save all communications, and keep receipts.</li>
          <li><strong>Know your rights:</strong> The Federal Competition and Consumer Protection Commission (FCCPC) handles consumer complaints. State consumer protection agencies also exist in most states.</li>
          <li><strong>Leave reviews:</strong> After your experience, leave honest reviews on Google, social media, or business directories. Your feedback helps other consumers make better decisions and incentivises businesses to maintain quality.</li>
        </ul>

        <h2 id="find-businesses">Start Your Search</h2>

        <p>
          Finding reliable businesses in Nigeria requires more effort than in some markets, but the framework above significantly reduces your risk. The key principles are simple: verify before you trust, start small before you commit big, get everything in writing, and use multiple information sources to cross-check claims.
        </p>

        <p>
          Ready to find a business? Browse the <Link href="/" className="text-hustle-blue font-medium hover:underline">MyHustle directory</Link> by category or city:
        </p>

        <ul>
          <li><Link href="/categories" className="text-hustle-blue font-medium hover:underline">Browse All 218 Business Categories</Link></li>
          <li><Link href="/lagos" className="text-hustle-blue font-medium hover:underline">Find Businesses in Lagos</Link> (453 businesses, 97 areas)</li>
          <li><Link href="/abuja" className="text-hustle-blue font-medium hover:underline">Find Businesses in Abuja</Link> (289 businesses, 68 areas)</li>
          <li><Link href="/port-harcourt" className="text-hustle-blue font-medium hover:underline">Find Businesses in Port Harcourt</Link> (73 businesses, 42 areas)</li>
        </ul>

        <p>
          Are you a business owner? <Link href="/list-your-business" className="text-hustle-blue font-medium hover:underline">List your business on MyHustle</Link> to make it easier for customers to find and verify your services. A complete, professional listing is your first step toward building trust with potential clients.
        </p>
      </ArticleLayout>
    </>
  )
}
