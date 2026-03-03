import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-hustle-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading text-2xl font-bold">
              My<span className="text-hustle-amber">Hustle</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-sm font-medium hover:text-hustle-amber transition-colors">
              Categories
            </Link>
            <Link href="/areas" className="text-sm font-medium hover:text-hustle-amber transition-colors">
              Areas
            </Link>
            <Link href="/near-me" className="text-sm font-medium hover:text-hustle-amber transition-colors">
              Near Me
            </Link>
            <Link
              href="/list-business"
              className="bg-hustle-amber text-hustle-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
            >
              List Your Business
            </Link>
          </nav>
          <button className="md:hidden text-white" aria-label="Menu">
            <svg className="w-6 h-6" width="24" height="24" style={{width:"24px",height:"24px",maxWidth:"24px",maxHeight:"24px",flexShrink:0}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
