export default function ProductSectionSkeleton() {
  return (
    <div className="bg-white border rounded-lg p-4 animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded mb-5"></div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-20 h-20 bg-gray-200 rounded"></div>

            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}