import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function VideoSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-12 w-3/4 mb-6" />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="w-full aspect-video" />
          <Card>
            <CardContent className="p-0">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[calc(100vh-24rem)] w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[calc(100vh-10rem)] w-full" />
        </div>
      </div>
    </div>
  );
}
