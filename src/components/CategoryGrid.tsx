import Link from 'next/link'
import type { Category } from '@/lib/types'

interface CategoryGridProps {
  categories: (Category & { business_count?: number })[]
  basePath?: string
  columns?: 2 | 3 | 4 | 5
}

export default function CategoryGrid({ categories, basePath = '/category', columns = 5 }: CategoryGridProps) {
  const colClasses: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-4 md:gap-6`}>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`${basePath}/${cat.slug}`}
          className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-hustle-amber group"
        >
          <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
            {cat.icon || '📁'}
          </span>
          <h3 className="font-heading font-semibold text-hustle-dark group-hover:text-hustle-blue transition-colors">
            {cat.name}
          </h3>
          {typeof cat.business_count === 'number' && (
            <p className="text-sm text-hustle-muted mt-1">
              {cat.business_count} {cat.business_count === 1 ? 'business' : 'businesses'}
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}
