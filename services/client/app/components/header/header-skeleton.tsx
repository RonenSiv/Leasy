import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/app/components/spinner";

export function HeaderSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-40">
        <Spinner />
      </Skeleton>
    </div>
  );
}
