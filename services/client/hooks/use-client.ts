"use client";

import { useAuth } from "@/context/auth-context";
import { useLectures } from "@/context/lecture-context";

export function useClient() {
  const auth = useAuth();
  const lectures = useLectures();

  return {
    ...auth,
    lectures: auth.user ? lectures.lectures : null,
    createLecture: auth.user ? lectures.createLecture : null,
    fetchLectures: auth.user ? lectures.fetchLectures : null,
    updateLastWatchedTime: auth.user ? lectures.updateLastWatchedTime : null,
    lecturesLoading: lectures.isLoading,
    lecturesError: lectures.error,
  };
}
