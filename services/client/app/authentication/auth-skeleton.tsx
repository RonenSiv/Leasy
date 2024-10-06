import { Skeleton } from "@/components/ui/skeleton";

export const AuthenticationSkeleton = () => {
  return (
    <div className="flex sm:items-center justify-center flex-1 w-full">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2 bg-emerald-500 p-12 hidden sm:block">
            <Skeleton className="h-10 w-3/4 bg-emerald-400 mb-4" />
            <Skeleton className="h-5 w-full bg-emerald-400 mb-2" />
            <Skeleton className="h-5 w-5/6 bg-emerald-400 mb-8" />
            <Skeleton className="h-48 w-2/3 mx-auto bg-emerald-400 mb-8" />
            <Skeleton className="h-5 w-full bg-emerald-400 mb-2" />
            <Skeleton className="h-10 w-full bg-emerald-400" />
          </div>
          <div className="w-full sm:w-1/2 bg-background p-12 flex flex-col max-sm:rounded-xl">
            <Skeleton className="h-10 w-3/4 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
