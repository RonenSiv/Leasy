"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/app/components/video/video-player";
import { VideoChat } from "@/app/components/video/video-chat";
import { VideoInfoTabs } from "@/app/components/video/video-info-tabs";
import api from "@/lib/api";
import { VideoSkeleton } from "@/app/components/video/video-skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function VideoPage() {
  const params = useParams();
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const {
    data: cachedData,
    error,
    isLoading,
  } = useSWR(`/lecture/${params.id}`, fetcher);

  // We'll use a ref to measure the chat element's rendered height.
  const chatRef = useRef(null);

  if (isLoading) return <VideoSkeleton />;
  if (error) return <div>Failed to load lecture</div>;
  const { data } = cachedData;

  const onTimeUpdate = (time: number) => {
    api.put(`/video/last-watched-time/${data.video.uuid}`, {
      last_watched_time: time,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <motion.div
        className={cn(
          "grid grid-cols-2 grid-rows-2 gap-4 transition-all duration-500",
          !isTheaterMode && "max-h-screen",
        )}
      >
        {/* Cell "1": Video */}
        <motion.div
          className={cn("col-span-1 row-span-1", isTheaterMode && "col-span-2")}
        >
          <VideoPlayer
            video={data.video}
            onTimeUpdate={onTimeUpdate}
            onTheaterModeChange={setIsTheaterMode}
          />
        </motion.div>
        {/* Cell "2": Chat */}
        <motion.div layout ref={chatRef} className="col-start-1 row-start-2">
          <VideoChat chatUuid={data.chat.uuid} />
        </motion.div>
        {/* Cell "3": Info Tabs (spanning both rows) */}
        <motion.div
          layout
          className={cn(
            "row-span-2 col-start-2 overflow-auto ",
            isTheaterMode ? "h-96" : "h-[820px]",
          )}
        >
          <VideoInfoTabs videoData={data} />
        </motion.div>
      </motion.div>
    </div>
  );
}
