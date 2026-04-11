import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  message?: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'This spot is waiting for its first business. Could be yours!',
  actionLabel = 'List Your Business / Hustle',
  actionHref = '/list-your-business',
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="font-heading text-xl font-semibold text-hustle-dark mb-2">{title}</h3>
      <p className="text-hustle-muted mb-6 max-w-md mx-auto">{message}</p>
      <Link
        href={actionHref}
        className="inline-block bg-hustle-amber text-hustle-dark px-6 py-3 rounded-lg font-bold hover:bg-hustle-sunset hover:text-white transition-colors"
      >
        {actionLabel}
      </Link>
    </div>
  )
}
