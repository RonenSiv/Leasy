import useSWR from "swr";
import { fetcher } from "@/app/actions/fetcher";
import type { LectureResponse } from "@/types/api-types";

export function useLectures({
  page = 1,
  onlyFavorites = false,
  searchByTitle = "",
  sortBy = "created_at",
  sortDirection = "desc",
  limit,
  fallbackData,
}: {
  page?: number;
  onlyFavorites?: boolean;
  searchByTitle?: string;
  sortBy?: string;
  sortDirection?: string;
  limit?: number;
  fallbackData?: LectureResponse;
}) {
  const query = `/lecture?page=${page}&only_favorites=${onlyFavorites}&search_by_title=${searchByTitle}&sort_by=${sortBy}&sort_direction=${sortDirection}`;

  const { data, error, mutate } = useSWR<LectureResponse>(query, fetcher.get, {
    fallbackData,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    lectures: !limit
      ? data?.data.lectures
      : data?.data.lectures.slice(0, limit),
    dashboard: data?.data.dashboard,
    isLoading: !error && !data && !fallbackData,
    isError: error,
    mutate,
  };
}
