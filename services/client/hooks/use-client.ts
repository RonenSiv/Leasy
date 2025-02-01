// /hooks/use-client.ts
"use client";

import { useAuth } from "@/context/auth-context";
import { useLectures } from "@/context/lecture-context";

export function useClient() {
  const auth = useAuth();
  const lectures = useLectures();

  return {
    ...auth,
    lectures: lectures.lectures,
    createLecture: lectures.createLecture,
    fetchLectures: lectures.fetchLectures,
    // Instead of returning null when there’s no user,
    // always return a function. If the user isn’t loaded,
    // this function will immediately throw.
    getLectures:
      lectures.getLectures ??
      (async () => {
        throw new Error(
          "Not authenticated or getLectures function is not available",
        );
      }),
    updateLastWatchedTime: lectures.updateLastWatchedTime,
    lecturesLoading: lectures.isLoading,
    lecturesError: lectures.error,
  };
}
