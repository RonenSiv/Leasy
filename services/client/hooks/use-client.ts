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
