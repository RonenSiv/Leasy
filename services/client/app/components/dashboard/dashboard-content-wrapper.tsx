"use client";

import React, { Suspense } from "react";
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

export function DashboardContentWrapper({ fallbackData }: Props) {
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
      <DashboardContent serverData={data as LecturesPreviewResource} />
    </div>
  );
}
