"use client";

import React, { Suspense } from "react";
import { useSWRConfig } from "swr";
import { useLectures } from "@/hooks/use-lectures";
import { DashboardSkeleton } from "@/app/dashboard/skeleton";
import { DashboardContent } from "./dashboard-content";
import { LecturesPreviewResource } from "@/types";

/**
 * The shape from your server fetch
 */

interface Props {
  fallbackData: LecturesPreviewResource;
}

/**
 * This is the top-level client wrapper.
 * We store fallbackData into SWR's cache if we like,
 * then wrap the "InnerWrapper" in Suspense.
 */
export function DashboardContentWrapper({ fallbackData }: Props) {
  const { cache } = useSWRConfig();

  // Optional: We can pre-populate SWR’s cache so the initial fetch is not needed
  // cache.set("/api/lecture?page=1&sort_by=created_at&sort_direction=desc", fallbackData);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <InnerWrapper fallbackData={fallbackData} />
    </Suspense>
  );
}

/**
 * InnerWrapper actually calls the SWR hook with fallbackData,
 * so no "Fallback data is required when using Suspense in SSR."
 * We also catch any re-fetch that might suspend in the client.
 */
function InnerWrapper({ fallbackData }: Props) {
  const { data, error, isLoading } = useLectures(
    { page: 1, sortField: "created_at", sortOrder: "desc" },
    { fallbackData },
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  console.log("DATA", data);

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
      <DashboardContent serverData={data as LecturesPreviewResource} />
    </div>
  );
}
