// Skeleton loading state for city pages — improves perceived performance
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-[#1A4731] h-[52vh] w-full" />

      {/* Content skeleton */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-72 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
