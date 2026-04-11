import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-hustle-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-white.svg"
                alt="MyHustle - Nigeria's trusted SME directory"
                width={140}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-hustle-muted text-sm">
              Get Found. Get Booked. Get Paid.
            </p>
            <p className="text-hustle-muted text-sm mt-2">
              Your digital front door across Nigeria.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Cities</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/lagos" className="hover:text-hustle-amber transition-colors">Lagos</Link></li>
              <li><Link href="/abuja" className="hover:text-hustle-amber transition-colors">Abuja</Link></li>
              <li><Link href="/port-harcourt" className="hover:text-hustle-amber transition-colors">Port Harcourt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Find Businesses</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/categories" className="hover:text-hustle-amber transition-colors">All Categories</Link></li>
              <li><Link href="/near-me" className="hover:text-hustle-amber transition-colors">Near Me</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">For Business Owners</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/list-your-business" className="hover:text-hustle-amber transition-colors">List Your Business / Hustle</Link></li>
              <li><Link href="/pricing" className="hover:text-hustle-amber transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-hustle-amber transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/about" className="hover:text-hustle-amber transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-hustle-amber transition-colors">Contact</Link></li>
              <li><Link href="/help" className="hover:text-hustle-amber transition-colors">Help &amp; FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-hustle-muted">
              <li><Link href="/legal/privacy-policy" className="hover:text-hustle-amber transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms-of-service" className="hover:text-hustle-amber transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/cookie-policy" className="hover:text-hustle-amber transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-hustle-amber transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/acceptable-use" className="hover:text-hustle-amber transition-colors">Acceptable Use</Link></li>
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
