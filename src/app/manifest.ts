import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyHustle.com',
    short_name: 'MyHustle',
    description: 'Find and book trusted businesses across Nigeria',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B4965',
    icons: [
      { src: '/logo-icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/logo-dark.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
