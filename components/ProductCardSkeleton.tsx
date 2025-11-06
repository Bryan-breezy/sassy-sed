export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg border shadow-sm flex flex-col h-full">
      <div className="bg-gray-200 w-full aspect-square rounded-t-lg" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-12 bg-gray-200 rounded" />
          <div className="h-5 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
