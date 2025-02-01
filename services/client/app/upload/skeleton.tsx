import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function UploadSkeleton() {
  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/3" />
      </CardContent>
    </Card>
  );
}
