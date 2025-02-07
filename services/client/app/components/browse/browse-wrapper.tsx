"use client";

import React, { Suspense } from "react";
import { useLectures } from "@/hooks/use-lectures";
import { DashboardSkeleton } from "@/app/dashboard/skeleton";
import { LecturesPreviewResource } from "@/types";
import { VideosContent } from "@/app/components/browse/videos-content";

interface Props {
  fallbackData: LecturesPreviewResource;
}

export function BrowseContentWrapper({ fallbackData }: Props) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <InnerWrapper fallbackData={fallbackData} />
    </Suspense>
  );
}

function InnerWrapper({ fallbackData }: Props) {
  const { data, error, isLoading } = useLectures(
    { page: 1, sortField: "created_at", sortOrder: "desc" },
    { fallbackData },
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">Failed to load dashboard data</div>
    );
  }
  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Browse Videos</h1>
      <VideosContent serverData={data as LecturesPreviewResource} />
    </div>
  );
}
