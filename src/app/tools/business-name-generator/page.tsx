'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';


const PREFIXES = [
  'Swift', 'Prime', 'Royal', 'Golden', 'Elite', 'Mega', 'Super', 'Grand',
  'Alpha', 'Nova', 'Apex', 'Zenith', 'Bright', 'True', 'First', 'Top',
  'Smart', 'Pro', 'Best', 'Star', 'Crown', 'Peak', 'Ace', 'Blue',
];

const NIGERIAN_WORDS = [
  'Oga', 'Naija', 'Jollof', 'Aso', 'Ankara', 'Suya', 'Amala', 'Owambe',
  'Wahala', 'Sabi', 'Baba', 'Mama', 'Eko', 'Abuja', 'Calabar', 'Benin',
  'Kano', 'Enugu', 'Warri', 'Ibadan',
];

const SUFFIXES = [
  'Hub', 'Works', 'Pro', 'Plus', 'Express', 'Connect', 'Solutions',
  'Services', 'Group', 'Global', 'Nigeria', 'NG', 'Africa', 'Labs',
  'Studio', 'House', 'Place', 'Zone', 'Central', 'Direct',
];

const INDUSTRIES: Record<string, string[]> = {
  'Restaurant / Food': ['Kitchen', 'Grill', 'Bistro', 'Eats', 'Chops', 'Cuisine', 'Diner', 'Foods', 'Catering', 'Pepper Soup'],
  'Fashion / Clothing': ['Styles', 'Fabrics', 'Couture', 'Threads', 'Wears', 'Fashion', 'Apparel', 'Designs', 'Tailoring', 'Stitches'],
  'Technology / IT': ['Tech', 'Digital', 'Systems', 'Software', 'Innovations', 'Computing', 'Networks', 'Data', 'Cloud', 'Cyber'],
  'Logistics / Delivery': ['Logistics', 'Express', 'Movers', 'Dispatch', 'Courier', 'Freight', 'Haulage', 'Transport', 'Delivery', 'Fleet'],
  'Beauty / Salon': ['Beauty', 'Glam', 'Salon', 'Spa', 'Glow', 'Hair', 'Nails', 'Skincare', 'Aesthetics', 'Looks'],
  'Real Estate': ['Properties', 'Realty', 'Homes', 'Estates', 'Land', 'Housing', 'Apartments', 'Developers', 'Builders', 'Spaces'],
  'Education / Training': ['Academy', 'Institute', 'Learning', 'School', 'Tutors', 'Education', 'Training', 'College', 'Scholars', 'Skills'],
  'Health / Medical': ['Health', 'Clinic', 'Medical', 'Care', 'Wellness', 'Pharmacy', 'Diagnostics', 'Hospital', 'Medics', 'Healing'],
  'Finance / Fintech': ['Finance', 'Capital', 'Pay', 'Money', 'Credit', 'Invest', 'Savings', 'Funds', 'Banking', 'Wealth'],
  'Agriculture / Farming': ['Farms', 'Agro', 'Harvest', 'Seeds', 'Green', 'Organic', 'Livestock', 'Crops', 'Garden', 'Plantation'],
  'General / Other': ['Ventures', 'Enterprises', 'Company', 'Associates', 'Partners', 'Trading', 'Merchants', 'Business', 'Commerce', 'Outfit'],
};

const LOCATIONS = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Benin City',
  'Calabar', 'Warri', 'Owerri', 'Abeokuta', 'Jos', 'Kaduna', 'Uyo', 'Asaba',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNames(industry: string, location: string, keywords: string): string[] {
  const industryWords = INDUSTRIES[industry] || INDUSTRIES['General / Other'];
  const names = new Set<string>();
  const kw = keywords.trim();

  // Pattern 1: Prefix + IndustryWord
  for (let i = 0; i < 3; i++) {
    names.add(`${pickRandom(PREFIXES)} ${pickRandom(industryWords)}`);
  }

  // Pattern 2: Keyword + Suffix
  if (kw) {
    names.add(`${kw} ${pickRandom(SUFFIXES)}`);
    names.add(`${kw} ${pickRandom(industryWords)}`);
  }

  // Pattern 3: Location + IndustryWord + Suffix
  if (location) {
    names.add(`${location} ${pickRandom(PREFIXES)} ${pickRandom(industryWords)}`);
    names.add(`${location} ${pickRandom(industryWords)} ${pickRandom(SUFFIXES)}`);
  }

  // Pattern 4: Nigerian flavour
  for (let i = 0; i < 3; i++) {
    names.add(`${pickRandom(NIGERIAN_WORDS)} ${pickRandom(industryWords)}`);
  }

  // Pattern 5: Prefix + Nigerian + Suffix
  for (let i = 0; i < 2; i++) {
    names.add(`${pickRandom(PREFIXES)} ${pickRandom(NIGERIAN_WORDS)} ${pickRandom(industryWords)}`);
  }

  // Pattern 6: Keyword + Nigerian
  if (kw) {
    names.add(`${pickRandom(NIGERIAN_WORDS)} ${kw}`);
    names.add(`${kw} ${pickRandom(NIGERIAN_WORDS)} ${pickRandom(SUFFIXES)}`);
  }

  // Fill to at least 10
  while (names.size < 10) {
    const pattern = Math.floor(Math.random() * 4);
    switch (pattern) {
      case 0: names.add(`${pickRandom(PREFIXES)} ${pickRandom(industryWords)} ${pickRandom(SUFFIXES)}`); break;
      case 1: names.add(`${pickRandom(NIGERIAN_WORDS)} ${pickRandom(industryWords)} ${pickRandom(SUFFIXES)}`); break;
      case 2: names.add(`${pickRandom(PREFIXES)} ${pickRandom(NIGERIAN_WORDS)} ${pickRandom(industryWords)}`); break;
      default: names.add(`${location || pickRandom(LOCATIONS)} ${pickRandom(industryWords)} ${pickRandom(SUFFIXES)}`); break;
    }
  }

  return Array.from(names).slice(0, 12);
}

export default function BusinessNameGeneratorPage() {
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [keywords, setKeywords] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    const selected = industry || 'General / Other';
    setResults(generateNames(selected, location, keywords));
  }, [industry, location, keywords]);

  const handleCopy = useCallback((name: string, idx: number) => {
    navigator.clipboard.writeText(name);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            Nigerian Business Name Generator
          </h1>
          <p className="mt-4 text-lg text-emerald-100 sm:text-xl">
            Generate unique, memorable business name ideas for your Nigerian company.
            Get inspired with names that blend local flavour with professional appeal.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-6">Generate Business Names</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry / Business Type *</label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                <option value="">Select your industry...</option>
                {Object.keys(INDUSTRIES).map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                <option value="">Any location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">Keywords (optional)</label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. your name, a word you like..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-200"
            >
              Generate Business Names
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-8">
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-4">Your Business Name Ideas</h3>
              <div className="space-y-2">
                {results.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:bg-emerald-50 hover:border-emerald-200"
                  >
                    <span className="font-medium text-gray-900">{name}</span>
                    <button
                      onClick={() => handleCopy(name, idx)}
                      className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                    >
                      {copied === idx ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleGenerate}
                className="mt-4 w-full rounded-lg border border-emerald-600 px-6 py-2.5 font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Regenerate Names
              </button>
            </div>
          )}
        </div>

        {/* CAC Tips */}
        <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">Tips for CAC Business Name Registration</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">1.</span>
              <span><strong>Check availability first</strong> &mdash; Search the <a href="https://pre.cac.gov.ng/" target="_blank" rel="noopener" className="text-emerald-600 underline">CAC portal</a> to confirm your chosen name is not already taken.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">2.</span>
              <span><strong>Prepare alternatives</strong> &mdash; CAC allows you to submit 2 name choices. Have backups ready.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">3.</span>
              <span><strong>Avoid restricted words</strong> &mdash; Words like &ldquo;Federal,&rdquo; &ldquo;National,&rdquo; &ldquo;Bank,&rdquo; or &ldquo;Insurance&rdquo; require special approval.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">4.</span>
              <span><strong>Keep it unique</strong> &mdash; Names too similar to existing registered businesses will be rejected.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500 font-bold">5.</span>
              <span><strong>Name reservation costs N500</strong> &mdash; Valid for 60 days. Full Business Name registration is N10,000; LLC is N15,000.</span>
            </li>
          </ul>
          <div className="mt-6">
            <Link
              href="/tools/cac-registration-guide"
              className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-800"
            >
              View full CAC Registration Guide &rarr;
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-center text-white sm:p-8">
          <h2 className="font-heading text-xl font-bold sm:text-2xl">Already Registered Your Business?</h2>
          <p className="mt-2 text-emerald-100">List it free on MyHustle and get discovered by customers across Nigeria.</p>
          <Link
            href="/list-your-business"
            className="mt-4 inline-block rounded-lg bg-amber-400 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-amber-300"
          >
            List Your Business Free
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Nigerian Business Name Generator',
            description: 'Generate unique business name ideas for Nigerian companies. Get inspired with names that blend local flavour with professional appeal.',
            url: 'https://myhustle.space/tools/business-name-generator',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'NGN' },
            provider: {
              '@type': 'Organization',
              name: 'MyHustle',
              url: 'https://myhustle.space',
            },
          }),
        }}
      />
    </main>
  );
}
