import React, { Suspense } from "react";
import { VideosContent } from "../components/browse/videos-content";
import { BrowseSkeleton } from "@/app/browse/skeleton";

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseSkeleton />}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <VideosContent />
      </div>
    </Suspense>
  );
}
