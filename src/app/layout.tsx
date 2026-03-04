import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'

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
  metadataBase: new URL('https://myhustle.com'),
  title: 'MyHustle.com — Find & Book Trusted Businesses in Lagos',
  description:
    'Discover trusted businesses in Lagos. Browse by area, category, or landmark. Read real reviews and book appointments directly.',
  keywords: [
    'Lagos business directory',
    'Nigerian SME directory',
    'find businesses in Lagos',
    'book appointments Lagos',
    'Lagos services',
    'MyHustle',
    'business listing Nigeria',
  ],
  openGraph: {
    title: 'MyHustle.com — Find & Book Trusted Businesses in Lagos',
    description:
      'Discover trusted businesses in Lagos. Browse by area, category, or landmark. Read real reviews and book appointments directly.',
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
    title: 'MyHustle.com — Find & Book Trusted Businesses in Lagos',
    description:
      'Discover trusted businesses in Lagos. Browse by area, category, or landmark.',
  },
  alternates: {
    canonical: 'https://myhustle.com',
  },
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
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
      <body className="font-body bg-white text-hustle-dark min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}
