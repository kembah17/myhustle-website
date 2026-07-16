export interface Article {
  slug: string
  title: string
  description: string
  excerpt: string
  category: string
  categoryColor: string
  date: string
  dateModified: string
  readingTime: string
  keywords: string[]
}

export const articles: Article[] = [
  {
    slug: 'state-of-small-business-nigeria-2026',
    title: 'State of Small Business in Nigeria 2026: Insights from 74,900+ Listings',
    description: 'Comprehensive data report on Nigeria\'s small business landscape in 2026, covering 74,901 businesses across 39 cities, 218 categories, and 1,500 neighborhoods.',
    excerpt: 'Our analysis of 74,901 verified business listings reveals the true state of Nigerian SMEs in 2026 — from geographic distribution across 39 cities to digital readiness and sector trends.',
    category: 'Research',
    categoryColor: 'bg-purple-100 text-purple-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '12 min read',
    keywords: ['small business Nigeria 2026', 'Nigerian SME statistics', 'business landscape Nigeria'],
  },
  {
    slug: 'popular-business-categories-nigeria-2026',
    title: "Nigeria's Most Popular Business Categories: What Entrepreneurs Are Starting in 2026",
    description: 'Data-driven analysis of the most popular business categories in Nigeria for 2026, based on 74,901 listings across 218 categories.',
    excerpt: 'Catering services lead with 167 listings, followed by management consulting (110) and diagnostics labs (85). Here\'s what Nigerian entrepreneurs are building in 2026.',
    category: 'Data Analysis',
    categoryColor: 'bg-blue-100 text-blue-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '10 min read',
    keywords: ['popular businesses Nigeria', 'what business to start Nigeria', 'trending businesses Nigeria 2026'],
  },
  {
    slug: 'lagos-vs-abuja-business-comparison',
    title: "Lagos vs Abuja: Comparing Nigeria's Two Biggest Business Hubs",
    description: 'Head-to-head comparison of Lagos and Abuja as business destinations, with data on 453 Lagos businesses and 289 Abuja businesses across key metrics.',
    excerpt: 'Lagos leads with 453 businesses across 97 areas, while Abuja hosts 289 across 68 areas. But the real story is in what each city specialises in.',
    category: 'Comparison',
    categoryColor: 'bg-green-100 text-green-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '9 min read',
    keywords: ['Lagos vs Abuja business', 'best city for business Nigeria', 'Lagos Abuja comparison'],
  },
  {
    slug: 'how-to-register-business-nigeria-cac-guide',
    title: 'How to Register a Business in Nigeria: Complete CAC Guide (2026)',
    description: 'Step-by-step guide to registering a business with the Corporate Affairs Commission (CAC) in Nigeria, including costs, documents, and timelines for 2026.',
    excerpt: 'Everything you need to register your business with CAC in 2026 — from choosing a business structure to post-registration steps, with current fees and timelines.',
    category: 'Guide',
    categoryColor: 'bg-amber-100 text-amber-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '11 min read',
    keywords: ['how to register business Nigeria', 'CAC registration', 'business registration Nigeria 2026'],
  },
  {
    slug: 'starting-catering-business-nigeria',
    title: 'Starting a Catering Business in Nigeria: The Complete Guide',
    description: 'Complete guide to starting a catering business in Nigeria, with market data from 167 catering businesses, startup costs, licensing, and marketing strategies.',
    excerpt: 'With 167 catering businesses listed across Nigeria — the largest category on MyHustle — here\'s your complete roadmap to entering this thriving sector.',
    category: 'Industry Guide',
    categoryColor: 'bg-orange-100 text-orange-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '10 min read',
    keywords: ['catering business Nigeria', 'how to start catering business', 'catering business plan Nigeria'],
  },
  {
    slug: 'how-to-find-reliable-business-nigeria',
    title: 'How to Find and Choose a Reliable Business in Nigeria',
    description: 'Practical consumer guide to finding and vetting reliable businesses in Nigeria, with tips on verification, red flags, and using online directories.',
    excerpt: 'Finding trustworthy service providers in Nigeria can be challenging. Here\'s a practical framework for vetting businesses before you commit your money.',
    category: 'Consumer Guide',
    categoryColor: 'bg-teal-100 text-teal-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '7 min read',
    keywords: ['find business Nigeria', 'reliable businesses Nigeria', 'how to choose service provider Nigeria'],
  },
  {
    slug: 'beauty-wellness-businesses-nigeria',
    title: 'The Rise of Beauty and Wellness Businesses in Nigeria',
    description: 'Industry report on Nigeria\'s beauty and wellness sector, covering 157 businesses across beauty, hair salons, and tailoring with regional analysis.',
    excerpt: 'With 157 businesses spanning beauty, hair salons, and tailoring, Nigeria\'s beauty and wellness sector is booming — especially in Lagos, Abuja, and emerging cities.',
    category: 'Industry Report',
    categoryColor: 'bg-pink-100 text-pink-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '9 min read',
    keywords: ['beauty business Nigeria', 'wellness industry Nigeria', 'hair salon business Nigeria'],
  },
  {
    slug: 'healthcare-diagnostics-labs-clinics-nigeria',
    title: 'Healthcare Access in Nigeria: A Directory of Diagnostics Labs and Clinics Across 39 Cities',
    description: 'Data report on healthcare access in Nigeria, mapping 94 diagnostics labs and clinics across 39 cities with analysis of urban-rural gaps.',
    excerpt: 'Our directory maps 94 healthcare businesses across 39 Nigerian cities, revealing significant gaps in diagnostics and clinical services outside Lagos and Abuja.',
    category: 'Public Interest',
    categoryColor: 'bg-red-100 text-red-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '9 min read',
    keywords: ['diagnostics labs Nigeria', 'clinics Nigeria', 'healthcare Nigeria directory'],
  },
  {
    slug: 'banking-financial-services-nigeria',
    title: "Nigeria's Banking and Financial Services Landscape: From Traditional Banks to Microfinance",
    description: 'Industry report on Nigeria\'s banking and financial services sector, covering 102 financial institutions from traditional banks to microfinance and crowdfunding.',
    excerpt: 'With 102 financial services businesses listed — 71 banks and microfinance institutions plus 31 crowdfunding platforms — Lagos dominates with 66 of the total.',
    category: 'Industry Report',
    categoryColor: 'bg-emerald-100 text-emerald-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '9 min read',
    keywords: ['banks Nigeria', 'microfinance Nigeria', 'financial services Nigeria'],
  },
  {
    slug: 'doing-business-in-lagos-guide',
    title: "Doing Business in Lagos: A Complete Guide to Africa's Largest Economy",
    description: 'Comprehensive guide to doing business in Lagos, Nigeria, covering 453 businesses across 97 areas, key industries, costs, and practical tips.',
    excerpt: 'Lagos hosts 453 businesses across 97 distinct areas — from Victoria Island\'s corporate towers to Ikeja\'s bustling commercial district. Here\'s your complete guide.',
    category: 'City Guide',
    categoryColor: 'bg-indigo-100 text-indigo-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '11 min read',
    keywords: ['doing business Lagos', 'Lagos business guide', 'business opportunities Lagos'],
  },
  {
    slug: 'abuja-business-guide-opportunities',
    title: "Abuja Business Guide: Opportunities in Nigeria's Capital City",
    description: 'Complete guide to business opportunities in Abuja, covering 289 businesses across 68 areas, government-adjacent sectors, and key industries.',
    excerpt: 'Abuja\'s 289 businesses across 68 areas tell a story of government-driven commerce, with catering (66) and consulting (34) leading the charge.',
    category: 'City Guide',
    categoryColor: 'bg-indigo-100 text-indigo-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '9 min read',
    keywords: ['business Abuja', 'Abuja business guide', 'business opportunities Abuja'],
  },
  {
    slug: 'emerging-business-cities-nigeria',
    title: 'Emerging Business Cities in Nigeria: Beyond Lagos and Abuja',
    description: 'Analysis of emerging business cities in Nigeria beyond Lagos and Abuja, covering Port Harcourt, Enugu, Ibadan, Kano, and Akure with data-driven insights.',
    excerpt: 'Port Harcourt (73 businesses), Enugu (25), Ibadan (24), Kano (17), and Akure (17) are emerging as viable alternatives to Lagos and Abuja for entrepreneurs.',
    category: 'Regional Guide',
    categoryColor: 'bg-cyan-100 text-cyan-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '9 min read',
    keywords: ['business cities Nigeria', 'emerging cities Nigeria', 'best cities business Nigeria'],
  },
  {
    slug: 'digital-presence-nigerian-smes-online-listing',
    title: 'Digital Presence for Nigerian SMEs: Why Your Business Needs an Online Listing',
    description: 'Practical guide for Nigerian SMEs on building digital presence, with data showing 57.7% of businesses have websites and actionable steps for getting online.',
    excerpt: 'Only 57.7% of Nigerian businesses have websites, yet 99.5% have phone numbers. Here\'s why an online listing is the fastest path to digital visibility.',
    category: 'Advice',
    categoryColor: 'bg-violet-100 text-violet-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '7 min read',
    keywords: ['online listing Nigeria', 'digital presence SME Nigeria', 'business listing Nigeria'],
  },
  {
    slug: 'top-business-opportunities-nigeria-2026',
    title: 'Top 10 Business Opportunities in Nigeria for 2026',
    description: 'Data-backed list of the top 10 business opportunities in Nigeria for 2026, based on analysis of 74,901 listings and market trends.',
    excerpt: 'From catering (167 listings) to IT consulting (just 10 listings — a massive gap), here are the top 10 business opportunities in Nigeria backed by real data.',
    category: 'Opportunities',
    categoryColor: 'bg-yellow-100 text-yellow-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '10 min read',
    keywords: ['business opportunities Nigeria 2026', 'best business Nigeria', 'profitable business Nigeria'],
  },
  {
    slug: 'nigerian-businesses-going-digital-trends',
    title: 'How Nigerian Businesses Are Going Digital: Trends and Insights from 74,900+ Listings',
    description: 'Trend analysis of digital transformation among Nigerian businesses, with data on website adoption, contact methods, and digital readiness across sectors.',
    excerpt: '57.7% of listed businesses have websites, 99.5% have phones, but email adoption is near zero. Here\'s how Nigerian businesses are navigating the digital shift.',
    category: 'Trend Analysis',
    categoryColor: 'bg-sky-100 text-sky-800',
    date: '2026-07-16',
    dateModified: '2026-07-16',
    readingTime: '9 min read',
    keywords: ['digital transformation Nigeria', 'Nigerian business trends', 'SME digital Nigeria'],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getRelatedArticles(currentSlug: string, count: number = 3): Article[] {
  const current = getArticleBySlug(currentSlug)
  if (!current) return articles.slice(0, count)
  
  // Prioritize same category, then different
  const sameCategory = articles.filter(a => a.slug !== currentSlug && a.category === current.category)
  const different = articles.filter(a => a.slug !== currentSlug && a.category !== current.category)
  
  return [...sameCategory, ...different].slice(0, count)
}
