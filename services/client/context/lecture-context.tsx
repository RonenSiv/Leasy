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

const LectureContext = createContext<LectureContextType | undefined>(undefined);

export const LectureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: lecturesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lectures", user?.uuid],
    queryFn: () => api.lecture.getLectures(),
    enabled: !!user?.uuid,
    staleTime: 1000 * 60 * 5,
  });

  const createLectureMutation = useMutation({
    mutationFn: (lectureData: FormData) =>
      api.lecture.createLecture(lectureData),
    onSuccess: async (newLecture) => {
      // Get the current lectures data
      const currentData = queryClient.getQueryData<{
        data: LecturesPreviewResource;
      }>(["lectures", user?.uuid]);

      if (currentData) {
        // Create a new lectures object with the updated data
        const updatedData = {
          data: {
            dashboard: {
              ...currentData.data.dashboard,
              total_videos: (currentData.data.dashboard.total_videos || 0) + 1,
            },
            videos: [newLecture, ...(currentData.data.videos || [])],
          },
        };

        // Update the cache immediately
        queryClient.setQueryData(["lectures", user?.uuid], updatedData);
      }

      // Still refetch in the background to ensure consistency
      await queryClient.invalidateQueries({
        queryKey: ["lectures", user?.uuid],
        exact: true,
      });
    },
  });

  const updateLastWatchedTimeMutation = useMutation({
    mutationFn: ({ uuid, time }: { uuid: string; time: number }) =>
      api.lecture.updateLastWatchedTime(uuid, time),
    onSuccess: async (_, { uuid, time }) => {
      // Get the current lectures data
      const currentData = queryClient.getQueryData<{
        data: LecturesPreviewResource;
      }>(["lectures", user?.uuid]);

      if (currentData) {
        const updatedData = {
          data: {
            ...currentData.data,
            videos: currentData.data.videos.map((video) =>
              video.uuid === uuid
                ? {
                    ...video,
                    video: { ...video.video, last_watched_time: time },
                  }
                : video,
            ),
          },
        };

        // Update the cache immediately
        queryClient.setQueryData(["lectures", user?.uuid], updatedData);
      }

      // Invalidate queries to refetch in background
      await queryClient.invalidateQueries({
        queryKey: ["lectures", user?.uuid],
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: ["lecture", uuid],
        exact: true,
      });
    },
  });

  const lectures = lecturesData?.data || { dashboard: {}, videos: [] };

  const contextValue: LectureContextType = {
    lectures,
    isLoading,
    error,
    fetchLectures: () =>
      queryClient.invalidateQueries({ queryKey: ["lectures", user?.uuid] }),
    createLecture: async (lectureData) => {
      if (!user?.uuid) throw new Error("User not authenticated");
      return createLectureMutation.mutateAsync(lectureData);
    },
    updateLastWatchedTime: async (uuid, time) => {
      await updateLastWatchedTimeMutation.mutateAsync({ uuid, time });
    },
    getLectures: async ({
      page,
      sortBy,
      sortDirection,
    }: {
      page?: number;
      sortBy?: string;
      sortDirection?: string;
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
