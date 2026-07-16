import type { Metadata } from 'next'
import { getArticleBySlug } from '@/lib/articles'
import ArticleLayout from '@/components/ArticleLayout'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import SpeakableJsonLd from '@/components/SpeakableJsonLd'
import Link from 'next/link'

export const revalidate = 86400

const slug = 'state-of-small-business-nigeria-2026'
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
      <SpeakableJsonLd name={article.title} url={`https://myhustle.space/insights/$state-of-small-business-nigeria-2026`} />
      <ArticleLayout article={article}>
        <p className="text-xl text-gray-700 leading-relaxed">
          <strong>Nigeria&apos;s small business ecosystem is larger, more diverse, and more digitally connected than ever.</strong> Our analysis of 74,901 verified business listings across 39 cities, 1,500 neighbourhoods, and 218 categories reveals a commercial landscape that defies simple narratives — one where catering entrepreneurs in Abuja outnumber tech consultants in Lagos, and where 99.5% of businesses have phone numbers but fewer than 1% use email as a contact method.
        </p>

        <p>
          This report draws on the MyHustle directory — Nigeria&apos;s fastest-growing business listing platform — to provide a data-driven snapshot of the country&apos;s SME landscape in 2026. Every number cited here comes from verified, active listings on the platform.
        </p>

        <h2 id="key-findings">Key Findings at a Glance</h2>

        <div className="bg-hustle-light rounded-xl p-6 my-6 not-prose">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-hustle-blue">74,901</div>
              <div className="text-sm text-hustle-muted mt-1">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-hustle-blue">39</div>
              <div className="text-sm text-hustle-muted mt-1">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-hustle-blue">218</div>
              <div className="text-sm text-hustle-muted mt-1">Business Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-hustle-blue">1,500</div>
              <div className="text-sm text-hustle-muted mt-1">Neighbourhoods</div>
            </div>
          </div>
        </div>

        <h2 id="methodology">Methodology</h2>
        <p>
          The data in this report is sourced from the MyHustle business directory, which aggregates verified business listings from across Nigeria. All 74,901 businesses included are active, verified entities with at least a business name and contact information. The directory covers 39 cities across 35 of Nigeria&apos;s 36 states plus the Federal Capital Territory (FCT). Businesses are classified into 218 categories — 21 parent categories and 197 sub-categories — following a taxonomy aligned with Nigeria&apos;s commercial reality.
        </p>

        <h2 id="geographic-distribution">Geographic Distribution: Where Nigerian Businesses Operate</h2>
        <p>
          Nigeria&apos;s business activity is heavily concentrated in two cities: <Link href="/lagos" className="text-hustle-blue font-medium hover:underline">Lagos</Link> and <Link href="/abuja" className="text-hustle-blue font-medium hover:underline">Abuja</Link>. Together, they account for 742 of the most prominent businesses on the platform — but the story doesn&apos;t end there. A network of secondary and emerging cities is reshaping the commercial map.
        </p>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>City</th>
              <th>Businesses</th>
              <th>Areas/Neighbourhoods</th>
              <th>Share of Total</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td><Link href="/lagos">Lagos</Link></td><td>453</td><td>97</td><td>0.60%</td></tr>
            <tr><td>2</td><td><Link href="/abuja">Abuja</Link></td><td>289</td><td>68</td><td>0.39%</td></tr>
            <tr><td>3</td><td><Link href="/port-harcourt">Port Harcourt</Link></td><td>73</td><td>42</td><td>0.10%</td></tr>
            <tr><td>4</td><td><Link href="/enugu">Enugu</Link></td><td>25</td><td>35</td><td>0.03%</td></tr>
            <tr><td>5</td><td><Link href="/ibadan">Ibadan</Link></td><td>24</td><td>40</td><td>0.03%</td></tr>
            <tr><td>6</td><td><Link href="/kano">Kano</Link></td><td>17</td><td>38</td><td>0.02%</td></tr>
            <tr><td>7</td><td><Link href="/akure">Akure</Link></td><td>17</td><td>—</td><td>0.02%</td></tr>
            <tr><td>8</td><td>Ilorin</td><td>14</td><td>30</td><td>0.02%</td></tr>
            <tr><td>9</td><td>Owerri</td><td>11</td><td>—</td><td>0.01%</td></tr>
            <tr><td>10</td><td><Link href="/kaduna">Kaduna</Link></td><td>11</td><td>32</td><td>0.01%</td></tr>
          </tbody>
        </table>

        <p>
          Lagos&apos;s dominance is expected — it is Africa&apos;s largest city by population and Nigeria&apos;s undisputed commercial capital. With 453 businesses spread across 97 distinct areas, from the corporate towers of Victoria Island to the bustling markets of Ikeja, Lagos offers the deepest business ecosystem in the country. Abuja follows with 289 businesses across 68 areas, driven largely by government-adjacent services and a growing consumer economy.
        </p>
        <p>
          What&apos;s more revealing is the long tail. <Link href="/port-harcourt" className="text-hustle-blue font-medium hover:underline">Port Harcourt</Link> (73 businesses) continues to leverage its oil-and-gas economy, while <Link href="/enugu" className="text-hustle-blue font-medium hover:underline">Enugu</Link> (25) is emerging as the tech and commercial hub of the South-East. <Link href="/ibadan" className="text-hustle-blue font-medium hover:underline">Ibadan</Link> (24), Nigeria&apos;s largest city by land area, is seeing renewed commercial activity, and <Link href="/kano" className="text-hustle-blue font-medium hover:underline">Kano</Link> (17) remains the gateway to northern Nigeria&apos;s vast consumer market.
        </p>

        <h2 id="industry-breakdown">Industry Breakdown: What Nigerians Are Building</h2>
        <p>
          The <Link href="/categories" className="text-hustle-blue font-medium hover:underline">218 business categories</Link> on MyHustle paint a vivid picture of Nigerian entrepreneurship. The top categories reveal a nation focused on essential services, personal care, and professional consulting.
        </p>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Category</th>
              <th>Listings</th>
              <th>Top City</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td><Link href="/category/catering-services">Catering Services</Link></td><td>167</td><td>Abuja (66)</td></tr>
            <tr><td>2</td><td><Link href="/category/management-consultants">Management Consultants</Link></td><td>110</td><td>Lagos (71)</td></tr>
            <tr><td>3</td><td><Link href="/category/diagnostics-labs">Diagnostics &amp; Labs</Link></td><td>85</td><td>Lagos (26), Abuja (26)</td></tr>
            <tr><td>4</td><td><Link href="/category/beauty-cosmetics">Beauty &amp; Cosmetics</Link></td><td>76</td><td>Lagos (25)</td></tr>
            <tr><td>5</td><td><Link href="/category/banks-microfinance">Banks &amp; Microfinance</Link></td><td>71</td><td>Lagos (66)</td></tr>
            <tr><td>6</td><td>Tailors &amp; Alterations</td><td>41</td><td>Abuja (12)</td></tr>
            <tr><td>7</td><td>Hair Salons</td><td>40</td><td>Lagos (37)</td></tr>
            <tr><td>8</td><td>Property Development</td><td>37</td><td>Abuja (13)</td></tr>
            <tr><td>9</td><td>Crowdfunding &amp; Investment</td><td>31</td><td>—</td></tr>
            <tr><td>10</td><td>Contractors</td><td>29</td><td>Abuja (11)</td></tr>
          </tbody>
        </table>

        <h3 id="catering-dominance">The Catering Phenomenon</h3>
        <p>
          <Link href="/category/catering-services" className="text-hustle-blue font-medium hover:underline">Catering services</Link> top the list with 167 businesses — and the geographic split is telling. Abuja alone accounts for 66 of these, compared to just 22 in Lagos. This reflects Abuja&apos;s event-driven economy: government functions, diplomatic receptions, corporate events, and the city&apos;s thriving social scene create constant demand for catering. In Lagos, the food economy is more fragmented across restaurants, food vendors (bukkas), and delivery services.
        </p>

        <h3 id="consulting-boom">The Consulting Boom</h3>
        <p>
          <Link href="/category/management-consultants" className="text-hustle-blue font-medium hover:underline">Management consulting</Link> ranks second with 110 businesses, with Lagos commanding 71 of them — nearly two-thirds. This concentration reflects Lagos&apos;s position as Nigeria&apos;s corporate headquarters city, where multinationals, banks, and large enterprises drive demand for advisory services. Abuja contributes 34, largely serving government agencies and development organisations.
        </p>

        <h3 id="sector-analysis">Sector-Level Analysis</h3>
        <p>
          Grouping related categories into broader sectors reveals three dominant pillars of Nigerian small business:
        </p>

        <table>
          <thead>
            <tr>
              <th>Sector</th>
              <th>Total Businesses</th>
              <th>Key Categories</th>
              <th>Leading City</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Beauty &amp; Fashion</td><td>157</td><td>Beauty (76), Tailors (41), Hair Salons (40)</td><td>Lagos (62)</td></tr>
            <tr><td>Finance</td><td>102</td><td>Banks (71), Crowdfunding (31)</td><td>Lagos (66)</td></tr>
            <tr><td>Healthcare</td><td>94</td><td>Diagnostics (85), Clinics (9+)</td><td>Lagos (36)</td></tr>
          </tbody>
        </table>

        <p>
          The beauty and fashion sector is the largest by combined listings (157), reflecting Nigeria&apos;s massive personal care economy. Healthcare, led by diagnostics labs, shows strong presence in both Lagos (36) and Abuja (26), with emerging clusters in Port Harcourt (8) and Nnewi (6) — the latter notable as a manufacturing hub branching into healthcare services.
        </p>

        <h2 id="digital-readiness">Digital Readiness: How Connected Are Nigerian SMEs?</h2>
        <p>
          One of the most striking findings in our data is the digital readiness gap among Nigerian businesses. While adoption of basic contact methods is near-universal, more advanced digital presence varies dramatically.
        </p>

        <table>
          <thead>
            <tr>
              <th>Digital Metric</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Have phone numbers</td><td>74,558</td><td>99.5%</td></tr>
            <tr><td>Have business descriptions</td><td>73,279</td><td>97.8%</td></tr>
            <tr><td>Have websites</td><td>43,246</td><td>57.7%</td></tr>
            <tr><td>Have email addresses</td><td>5</td><td>&lt;0.01%</td></tr>
          </tbody>
        </table>

        <p>
          The phone number is king in Nigerian business. At 99.5% adoption, it&apos;s the universal contact method — and in practice, most of these are WhatsApp-enabled mobile numbers. The near-total absence of email as a listed contact method (just 5 businesses out of 74,901) is remarkable and reflects a broader truth about Nigerian commerce: business is conducted via calls and WhatsApp messages, not email threads.
        </p>
        <p>
          Website adoption at 57.7% is encouraging but masks significant variation. Larger businesses in Lagos&apos;s financial sector are far more likely to have websites than sole-proprietor caterers in secondary cities. This digital divide represents both a challenge and an opportunity — businesses without websites can still be discovered through directory listings like <Link href="/list-your-business" className="text-hustle-blue font-medium hover:underline">MyHustle</Link>.
        </p>

        <h2 id="lagos-vs-abuja">Lagos vs Abuja: Two Economies, Two Identities</h2>
        <p>
          The rivalry between <Link href="/insights/lagos-vs-abuja-business-comparison" className="text-hustle-blue font-medium hover:underline">Lagos and Abuja</Link> is more than geographic — it reflects fundamentally different economic models.
        </p>

        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Lagos</th>
              <th>Abuja</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Total businesses</td><td>453</td><td>289</td></tr>
            <tr><td>Areas/neighbourhoods</td><td>97</td><td>68</td></tr>
            <tr><td>Top category</td><td>Management Consultants (71)</td><td>Catering Services (66)</td></tr>
            <tr><td>Second category</td><td>Banks &amp; Microfinance (66)</td><td>Management Consultants (34)</td></tr>
            <tr><td>Third category</td><td>Hair Salons (37)</td><td>Diagnostics &amp; Labs (26)</td></tr>
          </tbody>
        </table>

        <p>
          Lagos is a corporate and financial city. Its top categories — management consulting, banking, and hair salons — reflect an economy driven by corporate services, financial intermediation, and consumer spending. Abuja is an events and services city, where catering, consulting (often government-focused), and healthcare dominate.
        </p>

        <h2 id="emerging-cities">Emerging Cities: The Next Frontier</h2>
        <p>
          Beyond the Lagos-Abuja axis, several cities are emerging as significant business centres. <Link href="/insights/emerging-business-cities-nigeria" className="text-hustle-blue font-medium hover:underline">Read our full analysis of emerging business cities</Link> for detailed profiles, but here are the highlights:
        </p>
        <ul>
          <li><strong>Port Harcourt (73 businesses):</strong> Nigeria&apos;s oil capital is diversifying beyond petroleum, with growing healthcare and professional services sectors.</li>
          <li><strong>Enugu (25 businesses):</strong> The &quot;Coal City&quot; is reinventing itself as a tech and commercial hub for South-East Nigeria.</li>
          <li><strong>Ibadan (24 businesses):</strong> Nigeria&apos;s largest city by area is leveraging its agricultural hinterland and university ecosystem.</li>
          <li><strong>Kano (17 businesses):</strong> Northern Nigeria&apos;s commercial capital offers access to a consumer market of over 20 million people.</li>
          <li><strong>Akure (17 businesses):</strong> An emerging tech city in Ondo State, punching above its weight in business registrations.</li>
        </ul>

        <h2 id="implications">Implications for Entrepreneurs and Policymakers</h2>

        <h3 id="for-entrepreneurs">For Entrepreneurs</h3>
        <ul>
          <li><strong>Location matters, but not how you think.</strong> While Lagos offers the largest market, competition is fierce. Emerging cities like Enugu, Akure, and Ibadan offer lower competition with growing demand.</li>
          <li><strong>Service businesses dominate.</strong> The top categories are all service-oriented — catering, consulting, healthcare, beauty. Product-based businesses are underrepresented, suggesting either a gap in the market or a reflection of Nigeria&apos;s service-driven informal economy.</li>
          <li><strong>Digital presence is a differentiator.</strong> With only 57.7% of businesses having websites, simply having an online presence — even a <Link href="/list-your-business" className="text-hustle-blue font-medium hover:underline">free directory listing</Link> — puts you ahead of nearly half your competitors.</li>
          <li><strong>WhatsApp is your storefront.</strong> The near-zero email adoption and near-universal phone adoption confirm that WhatsApp Business should be every Nigerian SME&apos;s primary digital tool.</li>
        </ul>

        <h3 id="for-policymakers">For Policymakers</h3>
        <ul>
          <li><strong>Decentralisation is working — slowly.</strong> While Lagos and Abuja dominate, the emergence of business clusters in secondary cities suggests that infrastructure investment and state-level incentives are having an effect.</li>
          <li><strong>Digital literacy remains a bottleneck.</strong> The gap between phone adoption (99.5%) and website adoption (57.7%) points to a need for targeted digital skills programmes, particularly for SMEs outside Lagos.</li>
          <li><strong>Healthcare distribution needs attention.</strong> Diagnostics labs and clinics are concentrated in Lagos and Abuja, leaving secondary cities underserved despite growing populations.</li>
        </ul>

        <h2 id="conclusion">Conclusion</h2>
        <p>
          Nigeria&apos;s small business landscape in 2026 is a story of concentration and emergence, of digital adoption and persistent gaps, of service-driven entrepreneurship and untapped opportunities. The 74,901 businesses in the MyHustle directory represent just a fraction of Nigeria&apos;s estimated 40 million MSMEs (according to SMEDAN), but they offer a uniquely detailed window into the formal and semi-formal business economy.
        </p>
        <p>
          As the directory grows — with a target of 100,000 listings by the end of 2026 — these insights will only become richer. For now, the data tells us that Nigerian entrepreneurs are resilient, service-oriented, and increasingly digital, even if the journey to full digital transformation is far from complete.
        </p>
        <p>
          <strong>Want to be part of this data?</strong> <Link href="/list-your-business" className="text-hustle-blue font-medium hover:underline">List your business on MyHustle</Link> — it&apos;s free, takes under 5 minutes, and puts your business in front of thousands of potential customers searching for services like yours.
        </p>
      </ArticleLayout>
    </>
  )
}
