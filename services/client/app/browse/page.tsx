import React, { Suspense } from "react";
import { VideosContent } from "../components/browse/videos-content";

export default function BrowsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <VideosContent />
      </div>
    </Suspense>
  );
}
