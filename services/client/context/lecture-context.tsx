"use client";

import React, { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api";
import { useAuth } from "@/context/auth-context";
import { LecturesPreviewResource } from "@/types";

interface LectureContextType {
  lectures: LecturesPreviewResource;
  isLoading: boolean;
  error: Error | null;
  fetchLectures: () => Promise<void>;
  getLectures: (params: {
    page?: number;
    sortBy?: string;
    sortDirection?: string;
  }) => Promise<{ data: LecturesPreviewResource }>;
  createLecture: (lectureData: FormData) => Promise<{ uuid: string }>;
  updateLastWatchedTime: (uuid: string, time: number) => Promise<void>;
}

const queryKeys = {
  lectures: (userId?: string) => ["lectures", userId],
  allLectures: ["allLectures"],
  recentVideos: ["recentVideos"],
  dashboardData: ["dashboardData"],
  lecture: (id: string) => ["lecture", id],
} as const;

const LectureContext = createContext<LectureContextType | undefined>(undefined);

export const LectureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Helper function to update all relevant caches
  const invalidateAllLectureQueries = () => {
    return queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey[0] as string;
        return (
          queryKey === "allLectures" ||
          queryKey === "lectures" ||
          queryKey === "recentVideos" ||
          queryKey === "dashboardData" ||
          queryKey === "lecture"
        );
      },
    });
  };

  const {
    data: lecturesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.lectures(user?.uuid),
    queryFn: () => api.lecture.getLectures(),
    enabled: !!user?.uuid,
    staleTime: 1000 * 60 * 5,
  });

  const createLectureMutation = useMutation({
    mutationFn: (lectureData: FormData) =>
      api.lecture.createLecture(lectureData),
    onSuccess: (newLecture) => {
      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: queryKeys.lectures(user?.uuid) },
        (old: any) => ({
          data: {
            dashboard: {
              ...old.data.dashboard,
              total_videos: (old.data.dashboard.total_videos || 0) + 1,
            },
            videos: [newLecture, ...(old.data.videos || [])],
          },
        }),
      );

      // Invalidate all queries to ensure consistency
      return invalidateAllLectureQueries();
    },
  });

  const updateLastWatchedTimeMutation = useMutation({
    mutationFn: ({ uuid, time }: { uuid: string; time: number }) =>
      api.lecture.updateLastWatchedTime(uuid, time),
    onMutate: async ({ uuid, time }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.lectures(user?.uuid),
      });

      // Update the video in all relevant queries
      const updateVideo = (data: any) => {
        if (!data?.videos) return data;
        return {
          ...data,
          videos: data.videos.map((video: any) =>
            video.uuid === uuid
              ? {
                  ...video,
                  video: { ...video.video, last_watched_time: time },
                }
              : video,
          ),
        };
      };

      queryClient.setQueriesData(
        { queryKey: queryKeys.lectures(user?.uuid) },
        (old: any) => updateVideo(old),
      );

      queryClient.setQueriesData(
        { queryKey: queryKeys.recentVideos },
        (old: any) => updateVideo(old),
      );
    },
    onSettled: () => {
      return invalidateAllLectureQueries();
    },
  });

  const lectures = lecturesData?.data || { dashboard: {}, videos: [] };

  const contextValue: LectureContextType = {
    lectures,
    isLoading,
    error,
    fetchLectures: invalidateAllLectureQueries,
    createLecture: async (lectureData) => {
      if (!user?.uuid) throw new Error("User not authenticated");
      return createLectureMutation.mutateAsync(lectureData);
    },
    updateLastWatchedTime: async (uuid, time) => {
      await updateLastWatchedTimeMutation.mutateAsync({ uuid, time });
    },
    getLectures: async ({
      page = 1,
      sortBy = "created_at",
      sortDirection = "desc",
    }) => {
      return api.lecture.getLectures(page, sortBy, sortDirection);
    },
  };

  return (
    <LectureContext.Provider value={contextValue}>
      {children}
    </LectureContext.Provider>
  );
};

export const useLectures = () => {
  const context = useContext(LectureContext);
  if (context === undefined) {
    throw new Error("useLectures must be used within a LectureProvider");
  }
  return context;
};
