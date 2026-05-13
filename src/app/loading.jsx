export default function Loading() {
  return (
    <div className="w-[90%] mx-auto py-10">
      <div className="h-80 bg-gray-200 rounded-xl animate-pulse mb-10"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-96 bg-gray-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}