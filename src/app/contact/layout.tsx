import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — MyHustle',
  description:
    "Get in touch with MyHustle. Reach us via WhatsApp, email, or our contact form. We're here to help Nigerian businesses grow.",
  openGraph: {
    title: 'Contact Us — MyHustle',
    description: "Have a question or need help? Contact the MyHustle team.",
    url: 'https://myhustle.space/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
