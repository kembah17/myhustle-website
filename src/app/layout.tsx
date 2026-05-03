import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://myhustle.space'),
  title: 'MyHustle.com — Find & Book Trusted Businesses Across Nigeria',
  description:
    'Find and book trusted businesses near you in Nigeria. Over 73,000 listings across 39 cities — salons, mechanics, restaurants, clinics and more. Search free, book instantly.',
  keywords: [
    'Nigeria business directory',
    'Nigerian SME directory',
    'find businesses in Nigeria',
    'book appointments Nigeria',
    'Nigeria services',
    'MyHustle',
    'business listing Nigeria',
  ],
  openGraph: {
    title: 'MyHustle.com — Find & Book Trusted Businesses Across Nigeria',
    description:
      'Find and book trusted businesses near you in Nigeria. Over 73,000 listings across 39 cities — salons, mechanics, restaurants, clinics and more. Search free, book instantly.',
    siteName: 'MyHustle.com',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/logo-dark.png',
        width: 512,
        height: 512,
        alt: "MyHustle.com - Nigeria's trusted SME directory",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myhustle_ng',
    title: 'MyHustle.com — Find & Book Trusted Businesses Across Nigeria',
    description:
      'Find and book trusted businesses near you in Nigeria. Over 73,000 listings across 39 cities — search free, book instantly.',
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '',
  },
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-dark.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <GoogleAnalytics />
        <body className="font-body bg-white text-hustle-dark min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}
