"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("User fetch failed");
    return res.json();
  });

export function useUser() {
  const { data, error } = useSWR("/api/user", fetcher);

  return {
    user: data,
    isLoading: !data && !error,
    isError: !!error,
  };
}
