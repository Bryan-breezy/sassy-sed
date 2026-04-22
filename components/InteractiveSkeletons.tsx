import { Skeleton } from "@/components/ui/skeleton"
import { CardContent } from "@/components/ui/card"

export function SearchHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-6 w-full max-w-md mb-6" />
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-32 lg:hidden" />
        </div>
      </div>
      <Skeleton className="h-5 w-48 mt-4" />
    </div>
  )
}

export function FilterSidebarSkeleton() {
  return (
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </CardContent>
  )
}

export function PaginationSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <Skeleton className="h-10 w-24" />
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9" />
        ))}
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  )
}
