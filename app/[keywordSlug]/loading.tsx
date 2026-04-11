// Skeleton loading state for keyword index pages — improves perceived performance
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="bg-[#1A4731] h-[40vh] w-full" />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
