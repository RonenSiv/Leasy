"use client";

import { useEffect, useState } from "react";
import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";

export const BrowseSkeleton = () => {
  // Use a flag to know when we're on the client.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Until mounted, render null (or a minimal placeholder)
  if (!isMounted) return null;

  return (
    <div className="flex-grow mt-4">
      <div className="container mx-auto px-4">
        <h1 className="mb-6">
          <Skeleton className="w-[104px] max-w-full" />
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <div className="flex h-9 w-full border border-input px-3 py-1 shadow-sm transition-colors file:border-0 mb-4 md:mb-0">
            <Skeleton className="w-[128px] max-w-full" />
          </div>
          <div className="flex space-x-4">
            <div className="flex h-9 items-center justify-between border border-input px-3 py-2 shadow-sm [&>span]:line-clamp-1 w-[150px]">
              <span>
                <Skeleton className="w-[32px] max-w-full" />
              </span>
              <SVGSkeleton className="w-[24px] h-[24px]" />
            </div>
            <div className="flex h-9 items-center justify-between border border-input px-3 py-2 shadow-sm [&>span]:line-clamp-1 w-[150px]">
              <span>
                <Skeleton className="w-[80px] max-w-full" />
              </span>
              <SVGSkeleton className="w-[24px] h-[24px]" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group">
              <div>
                <div className="border">
                  <div className="relative">
                    <SVGSkeleton className="object-cover w-full h-48" />
                    <div className="absolute bottom-0 left-0 right-0">
                      <div className="h-1">
                        <div className="h-full"></div>
                      </div>
                    </div>
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
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-8 gap-2">
          <div className="inline-flex items-center justify-center gap-2 transition-colors [&_svg]:size-4 [&_svg]:shrink-0 border border-input shadow-sm h-9 px-4 py-2">
            <Skeleton className="w-[40px] max-w-full" />
            <SVGSkeleton className="lucide-chevron-left mr-1 w-[24px] h-[24px]" />
          </div>
          <div className="inline-flex items-center justify-center gap-2 transition-colors [&_svg]:size-4 [&_svg]:shrink-0 border border-input h-9 px-3 py-1">
            <Skeleton className="w-[14px] max-w-full" />
          </div>
          <div className="inline-flex items-center justify-center gap-2 transition-colors [&_svg]:size-4 [&_svg]:shrink-0 border border-input shadow-sm h-9 px-4 py-2">
            <Skeleton className="w-[40px] max-w-full" />
            <SVGSkeleton className="lucide-chevron-right ml-1 w-[24px] h-[24px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
