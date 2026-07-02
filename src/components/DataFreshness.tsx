export default function DataFreshness({ count, label }: { count: number; label: string }) {
  const today = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <p className="text-sm text-gray-500 mt-2">
      {count.toLocaleString()} {label} listed &bull; Last updated {today}
    </p>
  )
}
