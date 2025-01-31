"use client";

import React, { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api";
import { useAuth } from "@/context/auth-context";

interface Lecture {
  uuid: string;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  lastWatchedTime?: number;
  progress?: number;
}

interface LectureContextType {
  lectures: Lecture[];
  isLoading: boolean;
  error: Error | null;
  fetchLectures: () => void;
  createLecture: (lectureData: FormData) => Promise<void>;
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
  } = useQuery<{ data: Lecture[] }>({
    queryKey: ["lectures", user?.id],
    queryFn: () => api.lecture.getLectures(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createLectureMutation = useMutation({
    mutationFn: (lectureData: FormData) =>
      api.lecture.createLecture(lectureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });

  const updateLastWatchedTimeMutation = useMutation({
    mutationFn: ({ uuid, time }: { uuid: string; time: number }) =>
      api.lecture.updateLastWatchedTime(uuid, time),
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture", uuid] });
    },
  });

  const lectures = lecturesData?.data || [];

  const contextValue: LectureContextType = {
    lectures,
    isLoading,
    error,
    fetchLectures: () =>
      queryClient.invalidateQueries({ queryKey: ["lectures"] }),
    createLecture: async (lectureData) => {
      await createLectureMutation.mutateAsync(lectureData);
    },
    updateLastWatchedTime: async (uuid, time) => {
      await updateLastWatchedTimeMutation.mutateAsync({ uuid, time });
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
