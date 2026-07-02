export const revalidate = 86400;

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nigerian Business Name Generator — Free Tool | MyHustle',
  description:
    'Generate unique, memorable business name ideas for your Nigerian company. Get inspired with names that blend local flavour with professional appeal. Free, no signup required.',
  openGraph: {
    title: 'Nigerian Business Name Generator — Free Tool | MyHustle',
    description:
      'Generate unique business name ideas for Nigerian companies. Includes tips for CAC name registration.',
    url: 'https://myhustle.space/tools/business-name-generator',
  },
  alternates: {
    canonical: 'https://myhustle.space/tools/business-name-generator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
