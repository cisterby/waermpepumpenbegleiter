// Skeleton loading state for Bundesland pages — improves perceived performance
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="bg-[#1A4731] py-14 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-5">
            <div className="h-4 bg-white/20 rounded w-20" />
            <div className="h-4 bg-white/20 rounded w-4" />
            <div className="h-4 bg-white/20 rounded w-24" />
            <div className="h-4 bg-white/20 rounded w-4" />
            <div className="h-4 bg-white/20 rounded w-32" />
          </div>
          {/* Title Skeleton */}
          <div className="h-10 bg-white/20 rounded-lg w-3/4 mb-4" />
          {/* Description Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-white/20 rounded w-full" />
            <div className="h-4 bg-white/20 rounded w-5/6" />
            <div className="h-4 bg-white/20 rounded w-4/5" />
          </div>
          {/* Förderung Box Skeleton */}
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-3 w-64">
            <div className="flex-1">
              <div className="h-3 bg-white/20 rounded w-20 mb-2" />
              <div className="h-4 bg-white/20 rounded w-32 mb-1" />
              <div className="h-3 bg-white/20 rounded w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Cities Grid Skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Section Title Skeleton */}
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>

        {/* Cross-Links Section Skeleton */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-8">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-lg w-28" />
            ))}
          </div>
        </div>

        {/* Back Link Skeleton */}
        <div className="h-5 bg-gray-200 rounded w-40" />
      </div>
    </div>
  );
}
