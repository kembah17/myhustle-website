import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hustle-blue': '#1B4965',
        'hustle-amber': '#F59E0B',
        'hustle-sunset': '#EA580C',
        'hustle-dark': '#0F172A',
        'hustle-muted': '#64748B',
        'hustle-light': '#F8FAFC',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
