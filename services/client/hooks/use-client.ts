"use client";

import { useAuth } from "@/context/auth-context";
import { useLectures } from "@/context/lecture-context";

export function useClient() {
  const auth = useAuth();
  const lectures = useLectures();

  return {
    ...auth,
    lectures: lectures.lectures,
    recentLectures: lectures.recentLectures,
    createLecture: lectures.createLecture,
    updateLastWatchedTime: lectures.updateLastWatchedTime,
    lecturesLoading: lectures.isLoading,
    lecturesError: lectures.error,
  };
}
