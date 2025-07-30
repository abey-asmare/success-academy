import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
        </div>

        {/* Alert Skeleton */}
        <Skeleton className="h-16 w-full rounded-lg" />

        {/* Devices Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
