import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <Card className="border-0 bg-gray-50 overflow-hidden">
      <div className="relative h-64 w-full">
        <Skeleton className="h-full w-full rounded-t-lg" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
    </Card>
  )
}
