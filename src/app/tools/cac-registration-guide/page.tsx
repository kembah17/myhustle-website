'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';


interface ChecklistItem {
  id: string;
  step: number;
  title: string;
  description: string;
  details: string[];
  cost?: string;
  tip?: string;
}

const BUSINESS_NAME_CHECKLIST: ChecklistItem[] = [
  {
    id: 'bn-1',
    step: 1,
    title: 'Create a CAC Account',
    description: 'Register on the CAC Company Registration Portal (CRP).',
    details: [
      'Visit https://pre.cac.gov.ng/ and click "Create Account"',
      'Provide your email address, phone number, and create a password',
      'Verify your email address via the confirmation link',
      'Complete your profile with personal details and NIN',
    ],
    tip: 'Use a business email if you have one. You\'ll receive all CAC correspondence here.',
  },
  {
    id: 'bn-2',
    step: 2,
    title: 'Reserve Your Business Name',
    description: 'Search for and reserve your preferred business name.',
    details: [
      'Log in to the CRP portal',
      'Navigate to "Business Name Registration"',
      'Search to check if your preferred name is available',
      'Submit up to 2 name choices (in order of preference)',
      'Pay the name reservation fee',
    ],
    cost: '\u20A6500',
    tip: 'Avoid names with restricted words like "Federal", "National", "Bank", or "Insurance" unless you have special approval.',
  },
  {
    id: 'bn-3',
    step: 3,
    title: 'Complete Registration Form',
    description: 'Fill in the BN1 registration form with business details.',
    details: [
      'Enter the approved business name',
      'Provide business address (must be a physical address in Nigeria)',
      'Specify the nature of business / business activities',
      'Enter proprietor(s) details: full name, address, nationality, occupation, date of birth, NIN, phone, email',
      'Add additional proprietors if applicable (for partnership)',
      'Specify commencement date of business',
    ],
    tip: 'Your business address will appear on your CAC certificate. Use a proper business address, not a P.O. Box.',
  },
  {
    id: 'bn-4',
    step: 4,
    title: 'Upload Required Documents',
    description: 'Attach all necessary supporting documents.',
    details: [
      'Valid government-issued ID (NIN slip, International Passport, or Driver\'s License)',
      'Passport photograph (white background, recent)',
      'Signature specimen',
      'Proof of business address (utility bill or tenancy agreement)',
    ],
    tip: 'Ensure all documents are clear, legible scans in PDF or JPEG format. Max file size is usually 2MB per document.',
  },
  {
    id: 'bn-5',
    step: 5,
    title: 'Pay Registration Fee',
    description: 'Make payment for business name registration.',
    details: [
      'Review your application summary',
      'Pay the registration fee online via the portal',
      'Payment can be made with debit card, bank transfer, or USSD',
      'Save your payment receipt / reference number',
    ],
    cost: '\u20A610,000',
    tip: 'Total cost is approximately \u20A610,500 (\u20A6500 name reservation + \u20A610,000 registration). Prices may vary slightly.',
  },
  {
    id: 'bn-6',
    step: 6,
    title: 'Receive Your Certificate',
    description: 'Download your Business Name registration certificate.',
    details: [
      'CAC reviews your application (typically 1-3 business days)',
      'You\'ll receive an email notification when approved',
      'Log in to download your BN certificate',
      'Your business is now officially registered with CAC',
    ],
    tip: 'Keep digital and physical copies of your certificate. You\'ll need it for opening a business bank account.',
  },
];

const LLC_CHECKLIST: ChecklistItem[] = [
  {
    id: 'llc-1',
    step: 1,
    title: 'Create CAC Account & Reserve Name',
    description: 'Same process as Business Name, but select "Company Registration".',
    details: [
      'Register/login at https://pre.cac.gov.ng/',
      'Select "Company Registration" (not Business Name)',
      'Search and reserve your company name',
      'Company names must end with "Limited" or "Ltd"',
    ],
    cost: '\u20A6500',
    tip: 'LLC names must include "Limited" or "Ltd" at the end. E.g., "Swift Logistics Limited".',
  },
  {
    id: 'llc-2',
    step: 2,
    title: 'Prepare Incorporation Documents',
    description: 'Draft the required legal documents for incorporation.',
    details: [
      'Memorandum of Association (MEMART) - defines company objectives',
      'Articles of Association - internal rules and regulations',
      'Statement of Compliance (Form CAC 1.1)',
      'Particulars of Directors (minimum 1 director)',
      'Particulars of Secretary (must be different from sole director)',
      'Notice of Registered Address',
      'Statement of Share Capital (minimum \u20A6100,000 for private company)',
    ],
    tip: 'You can use CAC\'s standard MEMART template or draft a custom one. Standard template is faster and cheaper.',
  },
  {
    id: 'llc-3',
    step: 3,
    title: 'Complete Online Forms',
    description: 'Fill in all required company registration forms on the CRP.',
    details: [
      'Company details: name, registered address, nature of business',
      'Share capital structure: number of shares, value per share',
      'Director(s) details: full name, address, nationality, NIN, occupation, date of birth',
      'Secretary details: full name, address, qualifications',
      'Subscriber(s) details: shareholders and their share allocation',
      'Registered office address',
    ],
    tip: 'A private company can have 1-50 shareholders. You need at least 1 director and 1 secretary (can be same person if 2+ directors).',
  },
  {
    id: 'llc-4',
    step: 4,
    title: 'Upload Documents & Pay',
    description: 'Upload all incorporation documents and make payment.',
    details: [
      'Upload signed MEMART',
      'Upload Form CAC 1.1 (Statement of Compliance)',
      'Upload valid IDs for all directors and subscribers',
      'Upload passport photographs for all directors',
      'Upload proof of registered office address',
      'Pay the incorporation fee',
    ],
    cost: '\u20A615,000 - \u20A628,000',
    tip: 'Fee depends on share capital. \u20A615,000 for share capital up to \u20A61M. Stamp duty is 0.75% of share capital.',
  },
  {
    id: 'llc-5',
    step: 5,
    title: 'Receive Certificate of Incorporation',
    description: 'Get your company officially incorporated.',
    details: [
      'CAC reviews application (3-7 business days typically)',
      'May request corrections or additional documents',
      'Once approved, download Certificate of Incorporation',
      'Also receive certified copies of MEMART and Form CAC 1.1',
      'Your RC (Registration Certificate) number is assigned',
    ],
    tip: 'Your RC number is your company\'s unique identifier. You\'ll use it for tax registration, bank accounts, and contracts.',
  },
  {
    id: 'llc-6',
    step: 6,
    title: 'Post-Incorporation Steps',
    description: 'Complete essential steps after incorporation.',
    details: [
      'Register for TIN (Tax Identification Number) with FIRS',
      'Open a corporate bank account',
      'Register for VAT if applicable (turnover above \u20A625M)',
      'Obtain necessary industry-specific licenses/permits',
      'Set up proper accounting and bookkeeping',
      'File annual returns with CAC (due every year)',
    ],
    tip: 'Annual returns must be filed within 42 days of your company\'s anniversary date. Late filing attracts penalties.',
  },
];

const COMMON_MISTAKES = [
  'Using a name too similar to an existing registered business',
  'Providing a P.O. Box instead of a physical address',
  'Uploading blurry or expired identification documents',
  'Not including "Limited" or "Ltd" for company registration',
  'Incorrect share capital structure or allocation',
  'Forgetting to file annual returns after registration',
  'Using restricted words without prior approval',
  'Not keeping copies of registration documents',
];

function ChecklistSection({ items, title }: { items: ChecklistItem[]; title: string }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm font-medium text-emerald-600">{progress}% complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border p-5 transition-colors ${
              checked[item.id]
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex gap-4">
              <button
                onClick={() => toggle(item.id)}
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  checked[item.id]
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-300 hover:border-emerald-400'
                }`}
                aria-label={`Mark step ${item.step} as ${checked[item.id] ? 'incomplete' : 'complete'}`}
              >
                {checked[item.id] && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {item.step}
                  </span>
                  <h4 className={`font-semibold ${checked[item.id] ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                  {item.cost && (
                    <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      {item.cost}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-emerald-400 mt-1 shrink-0">&bull;</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                {item.tip && (
                  <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-sm text-blue-800">
                    <strong>Tip:</strong> {item.tip}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CACRegistrationGuidePage() {
  const [activeTab, setActiveTab] = useState<'bn' | 'llc'>('bn');

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            CAC Business Registration Guide
          </h1>
          <p className="mt-4 text-lg text-emerald-100 sm:text-xl">
            Step-by-step interactive checklist for registering your business with
            the Corporate Affairs Commission (CAC) in Nigeria. Updated for 2025.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* Tab Selector */}
        <div className="flex rounded-xl border border-gray-200 p-1 mb-8">
          <button
            onClick={() => setActiveTab('bn')}
            className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${
              activeTab === 'bn'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Business Name (BN)
          </button>
          <button
            onClick={() => setActiveTab('llc')}
            className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${
              activeTab === 'llc'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Limited Company (LLC)
          </button>
        </div>

        {/* Quick Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {activeTab === 'bn' ? (
            <>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">\u20A610.5K</div>
                <div className="text-xs text-gray-500 mt-1">Total Cost</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">1-3</div>
                <div className="text-xs text-gray-500 mt-1">Business Days</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">6</div>
                <div className="text-xs text-gray-500 mt-1">Steps</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">Online</div>
                <div className="text-xs text-gray-500 mt-1">100% Digital</div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">\u20A615K+</div>
                <div className="text-xs text-gray-500 mt-1">Starting Cost</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">3-7</div>
                <div className="text-xs text-gray-500 mt-1">Business Days</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">6</div>
                <div className="text-xs text-gray-500 mt-1">Steps</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">Online</div>
                <div className="text-xs text-gray-500 mt-1">100% Digital</div>
              </div>
            </>
          )}
        </div>

        {/* Checklist */}
        {activeTab === 'bn' ? (
          <ChecklistSection items={BUSINESS_NAME_CHECKLIST} title="Business Name Registration Steps" />
        ) : (
          <ChecklistSection items={LLC_CHECKLIST} title="LLC Incorporation Steps" />
        )}

        {/* Common Mistakes */}
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">Common Mistakes to Avoid</h2>
          <ul className="space-y-2">
            {COMMON_MISTAKES.map((mistake, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700">
                <span className="text-red-400 shrink-0">&#10007;</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Useful Links */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">Useful Links</h2>
          <ul className="space-y-3">
            <li>
              <a href="https://pre.cac.gov.ng/" target="_blank" rel="noopener" className="text-emerald-600 font-medium hover:text-emerald-800 underline">
                CAC Company Registration Portal (CRP)
              </a>
              <span className="text-sm text-gray-500 ml-2">&mdash; Official registration portal</span>
            </li>
            <li>
              <a href="https://search.cac.gov.ng/" target="_blank" rel="noopener" className="text-emerald-600 font-medium hover:text-emerald-800 underline">
                CAC Public Search
              </a>
              <span className="text-sm text-gray-500 ml-2">&mdash; Search existing registered businesses</span>
            </li>
            <li>
              <Link href="/tools/business-name-generator" className="text-emerald-600 font-medium hover:text-emerald-800 underline">
                Business Name Generator
              </Link>
              <span className="text-sm text-gray-500 ml-2">&mdash; Generate name ideas for your business</span>
            </li>
          </ul>
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

      {/* JSON-LD HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Register a Business with CAC in Nigeria',
            description: 'Step-by-step guide to registering a Business Name or Limited Liability Company (LLC) with the Corporate Affairs Commission (CAC) in Nigeria. Updated for 2025.',
            totalTime: 'P3D',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'NGN',
              value: '10500',
            },
            step: BUSINESS_NAME_CHECKLIST.map((item) => ({
              '@type': 'HowToStep',
              position: item.step,
              name: item.title,
              text: item.description,
              itemListElement: item.details.map((d, i) => ({
                '@type': 'HowToDirection',
                position: i + 1,
                text: d,
              })),
            })),
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
