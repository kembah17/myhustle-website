"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRelatedArticles, type Article } from '@/lib/articles'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface ArticleLayoutProps {
  article: Article
  children: React.ReactNode
}

function ArticleShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState(`https://myhustle.space/insights/${slug}`)

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const shareText = `${title} — MyHustle Insights`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-hustle-muted mr-1">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-black/5 hover:bg-black text-gray-700 hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter/X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          copied
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}

export default function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const relatedArticles = getRelatedArticles(article.slug, 3)

  useEffect(() => {
    const headings = document.querySelectorAll('article h2, article h3')
    const items: TOCItem[] = []
    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
      if (!heading.id) heading.id = id
      items.push({
        id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      })
    })
    setToc(items)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    const headings = document.querySelectorAll('article h2, article h3')
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [toc])

  const formattedDate = new Date(article.date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-hustle-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <span>/</span>
            <span className="text-white truncate">{article.title}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${article.categoryColor}`}>
              {article.category}
            </span>
            <span className="text-blue-200 text-sm">{article.readingTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl">{article.description}</p>
          <div className="flex items-center gap-4 mt-6 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-hustle-amber/20 flex items-center justify-center text-hustle-amber font-bold text-xs">M</div>
              <span>MyHustle Research Team</span>
            </div>
            <span>•</span>
            <time dateTime={article.date}>{formattedDate}</time>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <ArticleShareButtons title={article.title} slug={article.slug} />
            </div>
            <article className="prose prose-lg max-w-none
              prose-headings:font-heading prose-headings:text-hustle-dark
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-hustle-blue prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:text-hustle-dark
              prose-li:text-gray-700
              prose-table:border-collapse
              prose-th:bg-hustle-blue prose-th:text-white prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold
              prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-100 prose-td:text-sm
              prose-tr:hover:bg-gray-50
              prose-blockquote:border-l-hustle-amber prose-blockquote:bg-amber-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-img:rounded-lg
            ">
              {children}
            </article>

            {/* Bottom share */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <ArticleShareButtons title={article.title} slug={article.slug} />
            </div>

            {/* CTA Banner */}
            <div className="mt-10 bg-gradient-to-r from-hustle-blue to-hustle-blue/90 rounded-2xl p-8 md:p-10 text-white">
              <h3 className="text-2xl font-heading font-bold mb-3">List Your Business on MyHustle</h3>
              <p className="text-blue-100 mb-6 max-w-xl">
                Join 74,900+ businesses already on Nigeria&apos;s fastest-growing directory. Get found by customers searching for services like yours.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/list-your-business"
                  className="inline-flex items-center gap-2 bg-hustle-amber text-hustle-dark px-6 py-3 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
                >
                  List Your Business — It&apos;s Free
                  <svg className="w-4 h-4" width="16" height="16" style={{width:'16px',height:'16px',flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-heading font-bold text-hustle-dark mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((ra) => (
                    <Link
                      key={ra.slug}
                      href={`/insights/${ra.slug}`}
                      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-hustle-blue/20 transition-all"
                    >
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${ra.categoryColor}`}>
                        {ra.category}
                      </span>
                      <h4 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors line-clamp-2 mb-2">
                        {ra.title}
                      </h4>
                      <p className="text-sm text-hustle-muted line-clamp-2">{ra.excerpt}</p>
                      <span className="text-xs text-hustle-muted mt-3 block">{ra.readingTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24">
                <h4 className="text-sm font-heading font-bold text-hustle-dark uppercase tracking-wider mb-4">On This Page</h4>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm py-1 border-l-2 transition-colors ${
                        item.level === 3 ? 'pl-6' : 'pl-3'
                      } ${
                        activeId === item.id
                          ? 'border-hustle-blue text-hustle-blue font-medium'
                          : 'border-transparent text-hustle-muted hover:text-hustle-dark hover:border-gray-300'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 p-4 bg-hustle-light rounded-lg">
                  <p className="text-sm font-semibold text-hustle-dark mb-2">Own a business?</p>
                  <p className="text-xs text-hustle-muted mb-3">Get listed on MyHustle and reach thousands of customers.</p>
                  <Link
                    href="/list-your-business"
                    className="block text-center bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-hustle-blue/90 transition-colors"
                  >
                    List Your Business
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
