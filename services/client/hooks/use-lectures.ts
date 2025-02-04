"use client";

import useSWR, { SWRConfiguration } from "swr";
import { getLectures } from "@/app/actions/server-actions";
import { LecturesPreviewResource } from "@/types";

interface UseLecturesParams {
  page?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

interface UseLecturesOptions extends SWRConfiguration {
  fallbackData?: Partial<LecturesPreviewResource>;
}

function fetchServerLecturesWithAbort(
  params: UseLecturesParams,
  signal: AbortSignal,
): Promise<Partial<LecturesPreviewResource>> {
  return new Promise((resolve, reject) => {
    const abortHandler = () => {
      reject(new Error("Fetch aborted"));
    };

    signal.addEventListener("abort", abortHandler);

    getLectures({
      page: params.page,
      search: params.search,
      // Convert sortField "date" to "created_at" as in your original code.
      sortField: params.sortField === "date" ? "created_at" : params.sortField,
      sortOrder: params.sortOrder,
    })
      .then((response) => {
        signal.removeEventListener("abort", abortHandler);
        resolve(response.data as any);
      })
      .catch((error) => {
        signal.removeEventListener("abort", abortHandler);
        reject(error);
      });
  });
}

export function useLectures(
  {
    page = 1,
    search = "",
    sortField = "created_at",
    sortOrder = "desc",
  }: UseLecturesParams = {},
  options: UseLecturesOptions = {},
) {
  const params = { page, search, sortField, sortOrder };

  // Our custom fetcher creates an AbortController for each request.
  const fetcher = () => {
    const controller = new AbortController();
    // Wrap the getLectures call with support for abort.
    const promise = fetchServerLecturesWithAbort(params, controller.signal);
    // Attach a cancel method so SWR can abort if the key changes.
    (promise as any).cancel = () => controller.abort();
    return promise;
  };

  const {
    data: lecture,
    error,
    isLoading,
    isValidating,
  } = useSWR(JSON.stringify(params), fetcher, {
    suspense: true,
    fallbackData: options.fallbackData,
    ...options,
  });

  return { data: lecture, error, isLoading, isValidating };
}
