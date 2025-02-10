import useSWR from "swr";
import api from "@/lib/api";
import { LectureResponse } from "@/types/api-types";
import { revalidateLecture } from "@/app/actions/mutations";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useLectures({
  page = 1,
  onlyFavorites = false,
  searchByTitle = "",
  sortBy = "date",
  sortDirection = "desc",
  limit,
}: {
  page?: number;
  onlyFavorites?: boolean;
  searchByTitle?: string;
  sortBy?: string;
  sortDirection?: string;
  limit?: number;
}) {
  const query = `/lecture?page=${page}&only_favorites=${onlyFavorites}&search_by_title=${searchByTitle}&sort_by=${sortBy}&sort_direction=${sortDirection}`;
  const { data, error } = useSWR<LectureResponse>(query, fetcher);

  return {
    lectures: !limit
      ? data?.data.lectures
      : data?.data.lectures.slice(0, limit),
    dashboard: data?.data.dashboard,
    isLoading: !error && !data,
    isError: error,
    mutate: revalidateLecture,
  };
}
