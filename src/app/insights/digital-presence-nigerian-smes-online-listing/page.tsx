import type { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/articles'
import ArticleLayout from '@/components/ArticleLayout'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import Link from 'next/link'

export const revalidate = 86400

const slug = 'digital-presence-nigerian-smes-online-listing'
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
        }}
      />
      <ArticleLayout article={article}>
        <p className="text-xl text-gray-700 leading-relaxed">
          <strong>If your business isn&apos;t online, it&apos;s invisible to a growing majority of Nigerian consumers.</strong> Our analysis of 74,901 verified business listings reveals a striking digital divide: while 99.5% of Nigerian businesses have phone numbers and 97.8% have descriptions, only 57.7% maintain a website &mdash; and a mere 5 businesses (less than 0.01%) have listed an email address. For the tens of thousands of SMEs operating without any digital presence, the question is no longer whether to go online, but how to do it quickly and affordably.
        </p>

        <p>
          This guide breaks down the current state of digital adoption among Nigerian SMEs, explains why online listings matter more than ever, and provides a practical, step-by-step roadmap for getting your business visible on the internet &mdash; even if you have zero technical skills and a limited budget.
        </p>

        <h2 id="digital-divide">The Digital Divide: What the Numbers Tell Us</h2>

        <p>
          The data from our directory paints a clear picture of where Nigerian businesses stand in their digital journey:
        </p>

        <ul>
          <li><strong>Phone numbers:</strong> 74,558 out of 74,901 businesses (99.5%) have a phone number listed. The phone remains the undisputed primary contact channel for Nigerian businesses, with WhatsApp serving as both a communication and marketing tool.</li>
          <li><strong>Business descriptions:</strong> 73,279 businesses (97.8%) have written descriptions. Most business owners understand the value of explaining what they do, even if that description only lives in a directory listing.</li>
          <li><strong>Websites:</strong> 43,246 businesses (57.7%) have a website. This means 42.3% of businesses &mdash; over 31,000 enterprises &mdash; have no web presence beyond directory listings and social media profiles.</li>
          <li><strong>Email addresses:</strong> Just 5 businesses (less than 0.01%) have listed an email address. This near-total absence of email as a business contact method reflects a uniquely Nigerian reality where WhatsApp and phone calls have entirely replaced email for most SME communications.</li>
        </ul>

        <p>
          These numbers reveal an important insight: Nigerian businesses are not anti-technology. The near-universal adoption of phone numbers and the high rate of business descriptions show that owners are willing to invest in making their businesses accessible. The gap is specifically in <em>web-based</em> digital presence &mdash; websites, email, and structured online profiles.
        </p>

        <h2 id="why-online-listings-matter">Why Online Listings Matter More Than Ever</h2>

        <p>
          The way Nigerians find businesses has changed dramatically. A decade ago, word-of-mouth and physical signage were the primary discovery channels. Today, the journey typically starts with a search &mdash; on Google, on social media, or increasingly through AI-powered tools that pull information from structured online sources.
        </p>

        <h3>How Customers Find Businesses Today</h3>

        <p>
          Understanding the modern customer journey is essential for any business owner considering their digital strategy:
        </p>

        <ul>
          <li><strong>Google Search:</strong> When someone types &quot;catering service near me&quot; or &quot;best hair salon in Lekki,&quot; Google pulls results from websites, directory listings, and Google Business Profiles. Businesses without any online presence simply don&apos;t appear in these results.</li>
          <li><strong>Business directories:</strong> Platforms like <Link href="/">MyHustle</Link> aggregate business information into searchable, categorised listings. For businesses without websites, a directory listing is often their only appearance in search results.</li>
          <li><strong>Social media:</strong> Instagram, Facebook, and TikTok have become powerful discovery tools, particularly for beauty, fashion, food, and lifestyle businesses. However, social media profiles alone don&apos;t perform well in Google search results.</li>
          <li><strong>WhatsApp:</strong> While WhatsApp is Nigeria&apos;s dominant business communication tool, it functions as a closed network. Customers need your number first before they can find you on WhatsApp &mdash; which means you still need another channel for initial discovery.</li>
          <li><strong>AI and voice search:</strong> The rise of AI assistants and voice search means that structured, well-organised business data (the kind found in directory listings) is becoming increasingly important for discoverability.</li>
        </ul>

        <h3>The Visibility Gap</h3>

        <p>
          Consider this scenario: a corporate office in Victoria Island needs a catering service for an upcoming event. The office manager searches Google for &quot;catering services Lagos.&quot; Of the <Link href="/categories/catering">167 catering businesses</Link> in our directory, those with websites and directory listings will appear in search results. Those without any online presence &mdash; no matter how excellent their jollof rice &mdash; will be invisible to this potential customer.
        </p>

        <p>
          This visibility gap is costing Nigerian SMEs real money every day. And the gap is widening as more consumers shift to online search as their primary discovery method.
        </p>

        <h2 id="step-by-step">Step-by-Step: Getting Your Business Online</h2>

        <p>
          The good news is that building a digital presence doesn&apos;t require a massive budget or technical expertise. Here&apos;s a practical roadmap, ordered from easiest and cheapest to more advanced:
        </p>

        <h3>Step 1: Set Up WhatsApp Business (Free, 30 Minutes)</h3>

        <p>
          If you haven&apos;t already, download WhatsApp Business (not regular WhatsApp) and set up your business profile. This is the absolute minimum digital presence for any Nigerian business. Include your business name, category, description, address, operating hours, and a catalogue of your products or services. WhatsApp Business is free and takes less than 30 minutes to set up properly.
        </p>

        <p>
          <strong>Why it matters:</strong> With 99.5% of businesses already having phone numbers, WhatsApp Business simply adds structure and professionalism to a channel you&apos;re already using. It also enables the product catalogue feature, which functions as a mini-website within WhatsApp.
        </p>

        <h3>Step 2: Create a Directory Listing (Free or Low-Cost, 15 Minutes)</h3>

        <p>
          <Link href="/list-your-business">List your business on MyHustle</Link> and other relevant directories. A directory listing gives your business a permanent, searchable web page with your contact details, description, location, and category. This is particularly valuable for the 42.3% of businesses that don&apos;t have their own website.
        </p>

        <p>
          <strong>Why it matters:</strong> Directory listings appear in Google search results, are structured for AI and voice search, and provide a professional online presence without any technical skills or ongoing maintenance. Our <Link href="/pricing">free listing tier</Link> includes all the essentials, while premium options add features like priority placement and enhanced profiles.
        </p>

        <h3>Step 3: Establish Social Media Presence (Free, 1&ndash;2 Hours)</h3>

        <p>
          Create business profiles on the platforms most relevant to your industry. For beauty and fashion businesses, Instagram is essential. For B2B services like <Link href="/categories/management-consultants">management consulting</Link>, LinkedIn and Facebook are more appropriate. For food vendors and caterers, a combination of Instagram and Facebook works well.
        </p>

        <p>
          <strong>Why it matters:</strong> Social media provides visual storytelling, customer engagement, and community building that directories and websites can&apos;t match. However, social media should complement &mdash; not replace &mdash; your directory listing and website, as social media posts have limited search engine visibility.
        </p>

        <h3>Step 4: Build a Simple Website (&#8358;50,000&ndash;&#8358;500,000, 1&ndash;4 Weeks)</h3>

        <p>
          For businesses ready to invest in a more comprehensive online presence, a simple website provides the most control over your brand and messaging. Options range from free website builders like Google Sites to professional WordPress sites. Focus on mobile-first design &mdash; over 80% of Nigerian internet users access the web primarily through smartphones.
        </p>

        <p>
          <strong>Why it matters:</strong> A website gives you complete control over your brand narrative, enables e-commerce capabilities, and provides the strongest signal to search engines. However, it requires ongoing maintenance and content updates to remain effective.
        </p>

        <h2 id="free-vs-paid">Free vs Paid Listing Options</h2>

        <p>
          Not all online listings are created equal. Understanding the difference between free and paid options helps you make informed decisions about where to invest your limited marketing budget:
        </p>

        <ul>
          <li><strong>Free listings</strong> typically include your business name, category, contact number, and a brief description. They appear in directory search results but may be ranked below paid listings. For businesses just starting their digital journey, free listings are an excellent first step.</li>
          <li><strong>Paid/premium listings</strong> often include enhanced features such as priority placement in search results, detailed business profiles with photos and videos, customer review management, analytics on profile views and enquiries, and verification badges that build trust. Check our <Link href="/pricing">pricing page</Link> for current options.</li>
        </ul>

        <p>
          The best approach for most SMEs is to start with free listings across multiple platforms, then upgrade to premium on the one or two platforms that generate the most enquiries.
        </p>

        <h2 id="directory-listings-case">The Case for Directory Listings Specifically</h2>

        <p>
          Among all the digital presence options available, directory listings offer a unique combination of benefits that make them particularly valuable for Nigerian SMEs:
        </p>

        <ul>
          <li><strong>Instant credibility:</strong> Being listed alongside other verified businesses in your category lends immediate credibility, especially for newer businesses without an established reputation.</li>
          <li><strong>SEO benefits:</strong> Directory listings create backlinks to your website (if you have one) and appear in search results for category and location-based queries. A business listed in the <Link href="/categories">MyHustle directory</Link> benefits from the platform&apos;s domain authority.</li>
          <li><strong>Zero maintenance:</strong> Unlike a website or social media profile that requires regular content updates, a directory listing works for you 24/7 with minimal ongoing effort. Update your details when they change, and the listing continues to drive enquiries.</li>
          <li><strong>Structured data:</strong> Directories organise your business information in a structured format that search engines and AI tools can easily understand and surface in relevant queries.</li>
          <li><strong>Category discovery:</strong> Customers browsing directory categories discover businesses they wouldn&apos;t have found through direct search. If someone is browsing &quot;cleaning services in Abuja,&quot; every listed cleaning business gets exposure &mdash; not just those with the best SEO.</li>
        </ul>

        <h2 id="mobile-first">Mobile-First Considerations</h2>

        <p>
          Any digital presence strategy for Nigerian businesses must account for the reality that the vast majority of internet access happens on mobile devices. According to industry data, over 80% of Nigerian internet users access the web primarily through smartphones, often on limited data plans.
        </p>

        <p>
          This has several practical implications:
        </p>

        <ul>
          <li><strong>Your listing must be mobile-optimised:</strong> Directory platforms like MyHustle are built mobile-first, ensuring your business information displays correctly on any device. If you build your own website, mobile responsiveness is non-negotiable.</li>
          <li><strong>Click-to-call is essential:</strong> The ability to tap a phone number and immediately initiate a call is the single most important feature for mobile users. Ensure your phone number is prominently displayed and clickable on every platform where your business appears.</li>
          <li><strong>WhatsApp integration matters:</strong> Given that WhatsApp is the dominant communication tool, having a direct WhatsApp link (wa.me link) on your listing and website dramatically reduces friction for potential customers.</li>
          <li><strong>Page speed is critical:</strong> On mobile networks, slow-loading pages lose customers. Directory listings load fast because they&apos;re optimised by the platform. If you have your own website, test its speed on a 3G connection &mdash; that&apos;s the reality for many of your potential customers.</li>
          <li><strong>Keep content concise:</strong> Mobile users scan rather than read. Your business description should communicate your value proposition in the first two sentences. Use bullet points, clear headings, and prominent calls to action.</li>
        </ul>

        <h2 id="action-plan">Your Action Plan: Get Online This Week</h2>

        <p>
          Here&apos;s a concrete action plan that any Nigerian business owner can execute within a single week, regardless of technical skill level or budget:
        </p>

        <h3>Day 1&ndash;2: Foundation</h3>
        <ul>
          <li>Download and set up WhatsApp Business with complete profile information</li>
          <li>Gather your business details: name, category, description (2&ndash;3 sentences), phone number, address, operating hours, and 3&ndash;5 photos of your work or premises</li>
        </ul>

        <h3>Day 3: Directory Listings</h3>
        <ul>
          <li><Link href="/list-your-business">Create your MyHustle listing</Link> with all the information gathered above</li>
          <li>Set up a Google Business Profile (free) if you have a physical location</li>
          <li>Ensure your business name, address, and phone number are consistent across all listings</li>
        </ul>

        <h3>Day 4&ndash;5: Social Media</h3>
        <ul>
          <li>Create a business page on the platform most relevant to your industry</li>
          <li>Post 3&ndash;5 pieces of content showcasing your products, services, or team</li>
          <li>Add your directory listing URL and WhatsApp link to your social media bio</li>
        </ul>

        <h3>Day 6&ndash;7: Optimisation</h3>
        <ul>
          <li>Ask 2&ndash;3 satisfied customers to leave reviews on your directory listing</li>
          <li>Check how your business appears when you search for it on Google</li>
          <li>Explore the <Link href="/tools">free business tools</Link> available to help you manage and grow your online presence</li>
        </ul>

        <h2 id="conclusion">Conclusion: The Cost of Staying Invisible</h2>

        <p>
          The data is clear: Nigerian businesses are rapidly adopting digital tools, but a significant gap remains between phone-based communication and true online visibility. With 42.3% of businesses still lacking a website and email adoption at near zero, there&apos;s an enormous opportunity for forward-thinking SMEs to gain competitive advantage simply by being findable online.
        </p>

        <p>
          The businesses that thrive in 2026 and beyond will be those that meet customers where they&apos;re searching &mdash; on Google, in directories, and through AI-powered discovery tools. The good news is that getting started costs nothing and takes less than a week.
        </p>

        <p>
          <strong>Ready to get your business online?</strong> <Link href="/list-your-business">List your business on MyHustle for free</Link> and join the 74,901 Nigerian businesses already building their digital presence. For more insights on Nigeria&apos;s business landscape, explore our <Link href="/insights/state-of-small-business-nigeria-2026">State of Small Business report</Link> and <Link href="/insights/nigerian-businesses-going-digital-trends">digital transformation trends analysis</Link>.
        </p>
      </ArticleLayout>
    </>
  )
}
