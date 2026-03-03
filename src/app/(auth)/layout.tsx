import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyHustle - Account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hustle-light flex flex-col">
      {children}
    </div>
  )
}
