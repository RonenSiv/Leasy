"use client";

import useSWR, { SWRConfiguration } from "swr";
import { Video } from "@/types";

/** The shape from /api/lecture. */
interface LectureAPIResponse {
  data: {
    dashboard: {
      total_videos: number;
      overall_progress: number;
      completed_videos: number;
      num_of_pages: number;
    };
    videos: Video[];
  };
}

async function fetchLectures(url: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Lecture fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<LectureAPIResponse>;
}

interface UseLecturesParams {
  page?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Additional SWR options, including fallbackData
 */
interface UseLecturesOptions extends SWRConfiguration {
  fallbackData?: LectureAPIResponse;
}

/**
 * A single SWR hook that:
 * - Defaults to page=1, sort_by=created_at, sort_direction=desc
 * - Uses Suspense
 * - Accepts fallbackData for SSR
 */
export function useLectures(
  {
    page = 1,
    search = "",
    sortField = "created_at",
    sortOrder = "desc",
  }: UseLecturesParams = {},
  options: UseLecturesOptions = {},
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (sortField) params.set("sort_by", sortField);
  if (sortOrder) params.set("sort_direction", sortOrder);

  const url = `/api/lecture?${params.toString()}`;

  const { data, error, isLoading, isValidating } = useSWR<LectureAPIResponse>(
    url,
    fetchLectures,
    {
      suspense: true,
      fallbackData: options.fallbackData,
      ...options,
    },
  );

  return { data, error, isLoading, isValidating };
}
