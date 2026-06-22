import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Business Tools — MyHustle',
  description:
    'Free online tools for Nigerian business owners. PDF editor, invoice generator, QR codes, image tools, password generator, and more — all free, no signup required.',
  openGraph: {
    title: 'Free Business Tools — MyHustle',
    description:
      'Free online tools to help Nigerian businesses operate more efficiently. No signup, no downloads — works in your browser.',
    url: 'https://myhustle.space/tools',
  },
};

const tools = [
  {
    name: 'Invoice Generator',
    url: 'https://invoicegenerator.one',
    emoji: '🧾',
    description:
      'Create professional invoices for your business in seconds. Add your logo, line items, tax, and download as PDF — perfect for freelancers and SMEs.',
    tags: ['Finance', 'Documents'],
  },
  {
    name: 'PDF Tools',
    url: 'https://pdftools.one',
    emoji: '📄',
    description:
      'Merge, split, compress, and convert PDF files. Handle contracts, receipts, and business documents without installing any software.',
    tags: ['Documents', 'Productivity'],
  },
  {
    name: 'QR Code Generator',
    url: 'https://qrcodegenerator.one',
    emoji: '📲',
    description:
      'Generate QR codes for your business — link to your website, WhatsApp, menu, or payment page. Download in PNG or SVG format.',
    tags: ['Marketing', 'Design'],
  },
  {
    name: 'Image Tools',
    url: 'https://pictools.one',
    emoji: '🖼️',
    description:
      'Resize, crop, compress, and convert images for your website, social media, or product listings. Supports PNG, JPG, WebP, and more.',
    tags: ['Design', 'Social Media'],
  },
  {
    name: 'Social Media Tools',
    url: 'https://socialmediatools.one',
    emoji: '📱',
    description:
      'Tools to help manage your social media presence — image resizers, caption generators, and content planning utilities for Nigerian businesses.',
    tags: ['Social Media', 'Marketing'],
  },
  {
    name: 'Text Tools',
    url: 'https://texttools.one',
    emoji: '📝',
    description:
      'Format, clean, and transform text. Case converters, text encoders, slug generators, and more — useful for content creators and developers.',
    tags: ['Productivity', 'Content'],
  },
  {
    name: 'Word Counter',
    url: 'https://wordcount.one',
    emoji: '📊',
    description:
      'Count words, characters, sentences, and paragraphs. Estimate reading time for blog posts, proposals, and marketing copy.',
    tags: ['Content', 'Productivity'],
  },
  {
    name: 'Password Generator',
    url: 'https://passwordgenerator.one',
    emoji: '🔐',
    description:
      'Generate strong, secure passwords for your business accounts. Customise length, symbols, and complexity — keep your business safe online.',
    tags: ['Security', 'Productivity'],
  },
  {
    name: 'Percentage Calculator',
    url: 'https://percentcalc.one',
    emoji: '🧮',
    description:
      'Calculate percentages, discounts, markups, and margins. Essential for pricing, sales, and financial planning.',
    tags: ['Finance', 'Calculator'],
  },
  {
    name: 'Date Calculator',
    url: 'https://datecalculator.one',
    emoji: '📅',
    description:
      'Calculate days between dates, add or subtract days, and find deadlines. Useful for project planning, contracts, and scheduling.',
    tags: ['Productivity', 'Calculator'],
  },
  {
    name: 'GPA Calculator',
    url: 'https://gpacalculator.one',
    emoji: '🎓',
    description:
      'Calculate your GPA on the Nigerian 4.0 or 5.0 scale. Supports CGPA calculation across multiple semesters for university students.',
    tags: ['Education', 'Calculator'],
  },
  {
    name: 'Calorie Calculator',
    url: 'https://caloriecalculator.one',
    emoji: '🔥',
    description:
      'Calculate daily calorie needs based on your goals. Useful for fitness businesses, nutritionists, and health-conscious professionals.',
    tags: ['Health', 'Calculator'],
  },
  {
    name: 'Developer Tools',
    url: 'https://developertools.one',
    emoji: '👨‍💻',
    description:
      'JSON formatter, Base64 encoder, regex tester, and more. A toolkit for developers and tech businesses building digital products.',
    tags: ['Development', 'Productivity'],
  },
  {
    name: 'Random Generator',
    url: 'https://randomize.one',
    emoji: '🎲',
    description:
      'Generate random numbers, strings, colours, and more. Useful for raffles, giveaways, testing, and creative projects.',
    tags: ['Utility', 'Fun'],
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-hustle-blue px-4 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            Free Business Tools
          </h1>
          <p className="mt-4 text-lg text-blue-100 sm:text-xl">
            Powerful online tools to help you run your business — invoicing,
            documents, design, security, and more. All free, no signup required.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <a
              key={tool.url}
              href={tool.url}
              target="_blank"
              rel="noopener"
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-hustle-amber hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{tool.emoji}</div>
              <h2 className="font-heading text-lg font-semibold text-hustle-dark group-hover:text-hustle-blue">
                {tool.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-hustle-muted">
                {tool.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-hustle-blue"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm font-medium text-hustle-blue opacity-0 transition-opacity group-hover:opacity-100">
                Open tool &rarr;
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-hustle-light px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-hustle-dark">
            Built for Nigerian Businesses
          </h2>
          <p className="mt-4 text-hustle-muted">
            These tools are part of the MyHustle ecosystem — designed to help
            Nigerian SMEs operate more efficiently. Every tool works directly in
            your browser with no downloads, no signups, and no hidden fees.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/list-your-business"
              className="rounded-lg bg-hustle-blue px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              List Your Business Free
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-hustle-blue px-6 py-3 font-medium text-hustle-blue transition-colors hover:bg-hustle-blue hover:text-white"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
