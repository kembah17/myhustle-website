export const revalidate = 86400;

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CAC Business Registration Guide Nigeria 2025 — Free Checklist | MyHustle',
  description:
    'Step-by-step interactive checklist for registering your business with CAC in Nigeria. Covers Business Name and LLC registration with current 2025 fees, required documents, and tips.',
  openGraph: {
    title: 'CAC Business Registration Guide Nigeria 2025 | MyHustle',
    description:
      'Complete guide to registering a business with CAC in Nigeria. Interactive checklist with fees, documents, and common mistakes to avoid.',
    url: 'https://myhustle.space/tools/cac-registration-guide',
  },
  alternates: {
    canonical: 'https://myhustle.space/tools/cac-registration-guide',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
