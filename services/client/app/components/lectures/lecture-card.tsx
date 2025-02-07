"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Heart, Play } from "lucide-react";
import React from "react";
import { Lecture } from "@/types/api-types";
import api from "@/lib/api";
import { Spinner } from "@/app/components/spinner";
import { useSWRConfig } from "swr";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

function formatDuration(seconds: any): string {
  const secs = Number(seconds);
  if (isNaN(secs)) return "0:00";
  const mins = Math.floor(secs / 60);
  const secsRem = Math.floor(secs % 60);
  return `${mins}:${secsRem < 10 ? "0" : ""}${secsRem}`;
}

export function LectureCard({ lecture }: { lecture: Lecture }) {
  const { mutate } = useSWRConfig();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const toggleFavorite = async () => {
    try {
      setIsUpdating(true);
      const newFavoriteState = !lecture.is_favorite;

      // Optimistic update
      mutate(
        (key) => typeof key === "string" && key.startsWith("/lecture"),
        (currentData: any) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              lectures: currentData.data.lectures?.map((l: Lecture) =>
                l.uuid === lecture.uuid
                  ? { ...l, is_favorite: newFavoriteState }
                  : l,
              ),
            },
          };
        },
        false,
      );

      await api.put(`/lecture/favorite/${lecture.uuid}`, {
        favorite: newFavoriteState,
      });

      // Revalidate all lecture queries
      mutate((key) => typeof key === "string" && key.startsWith("/lecture"));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Rollback on error
      mutate(
        (key) => typeof key === "string" && key.startsWith("/lecture"),
        (currentData: any) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            data: {
              ...currentData.data,
              lectures: currentData.data.lectures.map((l: Lecture) =>
                l.uuid === lecture.uuid
                  ? { ...l, is_favorite: lecture.is_favorite }
                  : l,
              ),
            },
          };
        },
        false,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
      <Card className="relative group overflow-hidden">
        <div
          className="absolute top-1 right-1 z-10 cursor-pointer hover:scale-110 transition-transform duration-300"
          onClick={toggleFavorite}
        >
          {isUpdating ? (
            <Spinner className="w-6 h-6" />
          ) : lecture.is_favorite ? (
            <Heart className="w-6 h-6 text-red-600 fill-current" />
          ) : (
            <Heart className="w-6 h-6 text-gray-400 hover:fill-red-600 hover:text-red-600 transition-colors duration-300" />
          )}
        </div>
        <Link href={`/video/${lecture.uuid}`}>
          <div className="relative">
            <img
              src={`${baseUrl}/${lecture.video.preview_image_url}`}
              alt={lecture.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-12 h-12 text-white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-1 bg-gray-300">
                <div
                  className="h-full bg-red-600"
                  style={{
                    width: `${lecture.video.progress_percentages}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 px-1 py-0.5 text-xs text-white rounded">
              {formatDuration(lecture.video.video_duration)}
            </div>
          </div>
          <CardContent className="p-2">
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {lecture.title}
            </CardTitle>
            <p className="text-xs text-gray-500 line-clamp-2">
              {lecture.description}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(lecture.video.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
