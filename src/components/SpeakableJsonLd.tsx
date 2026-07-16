import JsonLd from '@/components/JsonLd'

interface SpeakableJsonLdProps {
  name: string
  url: string
  cssSelectors?: string[]
}

export default function SpeakableJsonLd({ name, url, cssSelectors = ['h1', '[data-speakable]'] }: SpeakableJsonLdProps) {
  return (
    <JsonLd data={{
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name,
      url,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: cssSelectors,
      },
    }} />
  )
}
