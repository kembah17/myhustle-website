import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-hustle-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">
              My<span className="text-hustle-amber">Hustle</span>
            </h3>
            <p className="text-hustle-muted text-sm">
              Get Found. Get Booked. Get Paid.
            </p>
            <p className="text-hustle-muted text-sm mt-2">
              Nigeria&apos;s #1 SME Directory &amp; Digital Office.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/categories" className="hover:text-hustle-amber transition-colors">All Categories</Link></li>
              <li><Link href="/areas" className="hover:text-hustle-amber transition-colors">Lagos Areas</Link></li>
              <li><Link href="/near-me" className="hover:text-hustle-amber transition-colors">Near Me</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">For Business</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/list-business" className="hover:text-hustle-amber transition-colors">List Your Business</Link></li>
              <li><Link href="/pricing" className="hover:text-hustle-amber transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-hustle-amber transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/about" className="hover:text-hustle-amber transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-hustle-amber transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-hustle-amber transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-hustle-muted">
          <p>&copy; {new Date().getFullYear()} MyHustle.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
