import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader } from "@/components/ui/card"

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {/* Back link skeleton */}
        <Skeleton className="h-6 w-40 mb-6" />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <Skeleton className="aspect-square w-full rounded-lg" />

          {/* Details skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />

            <div className="pt-4 border-t border-gray-100">
              <Skeleton className="h-7 w-32 mb-3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Skeleton className="h-7 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div className="pt-4">
              <Skeleton className="h-7 w-32 mb-3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-gray-100">
                <Skeleton className="aspect-square w-full" />
                <CardHeader className="p-4 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
