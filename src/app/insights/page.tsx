import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/articles'
import JsonLd from '@/components/JsonLd'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Insights — Data-Driven Business Intelligence for Nigeria | MyHustle',
  description:
    'Research reports, industry guides, and data analysis from 74,900+ Nigerian business listings. Actionable insights for entrepreneurs, investors, and policymakers.',
  openGraph: {
    title: 'Insights — Data-Driven Business Intelligence for Nigeria | MyHustle',
    description:
      'Research reports, industry guides, and data analysis from 74,900+ Nigerian business listings.',
    type: 'website',
    url: 'https://myhustle.space/insights',
    images: [{ url: '/logo-dark.png', width: 512, height: 512, alt: 'MyHustle Insights' }],
  },
  alternates: {
    canonical: 'https://myhustle.space/insights',
  },
}

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://myhustle.space' },
          { name: 'Insights', url: 'https://myhustle.space/insights' },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'MyHustle Insights',
          description:
            'Research reports, industry guides, and data analysis from 74,900+ Nigerian business listings.',
          url: 'https://myhustle.space/insights',
          publisher: {
            '@type': 'Organization',
            name: 'MyHustle',
            url: 'https://myhustle.space',
          },
        }}
      />

      {/* Hero */}
      <div className="bg-hustle-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Insights</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            MyHustle Insights
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Data-driven research, industry reports, and practical guides drawn from
            74,900+ verified Nigerian business listings across 39 cities.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured article (first one) */}
        <div className="mb-12">
          <Link
            href={`/insights/${articles[0].slug}`}
            className="group block bg-gradient-to-r from-hustle-light to-white border border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-xl hover:border-hustle-blue/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${articles[0].categoryColor}`}>
                {articles[0].category}
              </span>
              <span className="text-sm text-hustle-muted">{articles[0].readingTime}</span>
              <span className="text-xs bg-hustle-amber/10 text-hustle-amber px-2 py-0.5 rounded-full font-semibold">Featured</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-hustle-dark group-hover:text-hustle-blue transition-colors mb-3">
              {articles[0].title}
            </h2>
            <p className="text-hustle-muted text-lg max-w-3xl mb-4">{articles[0].excerpt}</p>
            <div className="flex items-center gap-2 text-sm text-hustle-muted">
              <time dateTime={articles[0].date}>
                {new Date(articles[0].date).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>MyHustle Research Team</span>
            </div>
          </Link>
        </div>

        {/* Rest of articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-hustle-blue/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${article.categoryColor}`}>
                  {article.category}
                </span>
                <span className="text-xs text-hustle-muted">{article.readingTime}</span>
              </div>
              <h2 className="text-lg font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-sm text-hustle-muted line-clamp-3 mb-4">{article.excerpt}</p>
              <time dateTime={article.date} className="text-xs text-hustle-muted">
                {new Date(article.date).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-hustle-light rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-heading font-bold text-hustle-dark mb-3">
              Want Your Business Featured?
            </h3>
            <p className="text-hustle-muted max-w-xl mx-auto mb-6">
              Join 74,900+ businesses on Nigeria’s fastest-growing directory.
              Get discovered by customers actively searching for your services.
            </p>
            <Link
              href="/list-your-business"
              className="inline-flex items-center gap-2 bg-hustle-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-hustle-blue/90 transition-colors"
            >
              List Your Business — It’s Free
              <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
