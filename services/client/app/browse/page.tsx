import { Suspense } from "react";
import { fetchAllVideos } from "@/app/actions/fetch-all-lectures";
import { VideosContent } from "../components/browse/videos-content";

export default async function BrowsePage() {
  const initialData = await fetchAllVideos();
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      }
    >
      <VideosContent initialData={initialData} />
    </Suspense>
  );
}
