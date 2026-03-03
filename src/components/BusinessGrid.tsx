import BusinessCard from './BusinessCard'
import EmptyState from './EmptyState'
import type { Business, Category, Area, Review } from '@/lib/types'

interface BusinessGridProps {
  businesses: (Business & {
    category?: Category
    area?: Area
    reviews?: Review[]
  })[]
  emptyTitle?: string
  emptyMessage?: string
}

export default function BusinessGrid({ businesses, emptyTitle, emptyMessage }: BusinessGridProps) {
  if (businesses.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  )
}
