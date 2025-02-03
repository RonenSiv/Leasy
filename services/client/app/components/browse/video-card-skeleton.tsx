import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";

export function VideoCardSkeleton() {
  return (
    <div>
      <div className="border">
        <div className="relative">
          <SVGSkeleton className="object-cover w-full h-48" />
          <div className="absolute bottom-1 right-1 px-1 py-0.5">
            <Skeleton className="w-[32px] max-w-full" />
          </div>
        </div>
        <div className="p-2">
          <div className="tracking-tight line-clamp-2">
            <Skeleton className="w-[88px] max-w-full" />
          </div>
          <div className="line-clamp-2">
            <Skeleton className="w-[504px] max-w-full" />
          </div>
          <div>
            <Skeleton className="w-[80px] max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
