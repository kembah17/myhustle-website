import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — MyHustle',
  description:
    "Have a question, suggestion, or need help? Contact the MyHustle team via WhatsApp, email, or our contact form.",
  openGraph: {
    title: 'Contact Us — MyHustle',
    description: "Get in touch with the MyHustle team. We'd love to hear from you.",
    url: 'https://myhustle.space/contact',
  },
  alternates: {
    canonical: 'https://myhustle.space/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
