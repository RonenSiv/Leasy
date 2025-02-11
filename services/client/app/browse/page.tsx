import { Suspense } from "react";
import { getLectures } from "@/lib/api-server";
import { BrowseClient } from "./browse-client";
import { VideoSkeleton } from "@/app/components/video/video-skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    sort?: string;
    direction?: string;
  };
}) {
  const initialData = await getLectures({
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    searchByTitle: searchParams.search || "",
    sortBy: searchParams.sort || "created_at",
    sortDirection: searchParams.direction || "desc",
  });

  return (
    <Suspense fallback={<VideoSkeleton />}>
      <BrowseClient initialData={initialData} />
    </Suspense>
  );
}
