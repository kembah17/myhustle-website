export default function SearchLoading() {
  return (
    <div>
      {/* Blue header skeleton */}
      <section className="bg-hustle-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb placeholder */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-12 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
          </div>
          {/* Title placeholder */}
          <div className="h-9 w-72 bg-white/20 rounded-lg animate-pulse" />
          {/* Search bar placeholder */}
          <div className="mt-6 h-12 w-full max-w-2xl bg-white/10 rounded-xl animate-pulse" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results count placeholder */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Business card skeletons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                {/* Category badge */}
                <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
                {/* Title */}
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                {/* Description lines */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
                </div>
                {/* Rating + location row */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
