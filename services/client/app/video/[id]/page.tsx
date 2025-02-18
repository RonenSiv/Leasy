"use client";

import { Suspense, useRef, useState } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/app/components/video/video-player";
import { VideoChat } from "@/app/components/video/video-chat";
import { VideoInfoTabs } from "@/app/components/video/video-info-tabs";
import { VideoSkeleton } from "@/app/components/video/video-skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fetcher } from "@/app/actions/fetcher";

export default function VideoPage() {
  const params = useParams();
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const {
    data: cachedData,
    error,
    isLoading,
  } = useSWR(`/lecture/${params.id}`, fetcher.get);

  // We'll use a ref to measure the chat element's rendered height.
  const chatRef = useRef(null);

  if (isLoading) return <VideoSkeleton />;
  if (error) return <div>Failed to load lecture</div>;
  const { data } = cachedData;

  const onTimeUpdate = async (time: number) => {
    try {
      // If you worry about the unload, you can use navigator.sendBeacon here
      await fetcher.put(`/video/last-watched-time/${data.video.uuid}`, {
        last_watched_time: time,
      });
    } catch (error) {
      console.error("Failed to update last watched time", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <motion.div
        className={cn(
          "grid gap-4 transition-all duration-500",
          "grid-cols-1 xl:grid-cols-2 xl:grid-rows-2 max-xl:gap-8",
          !isTheaterMode && "xl:max-h-screen",
        )}
      >
        {/* Cell "1": Video */}
        <motion.div
          className={cn(
            "row-span-1 col-span-1",
            isTheaterMode && "xl:col-span-2",
          )}
        >
          <Suspense fallback={<VideoSkeleton />}>
            <VideoPlayer
              video={data.video}
              onTimeUpdate={onTimeUpdate}
              onTheaterModeChange={setIsTheaterMode}
            />
          </Suspense>
        </motion.div>

        {/* Cell "2": Chat */}
        <motion.div layout ref={chatRef} className="col-start-1 row-start-2">
          <VideoChat chatUuid={data.chat.uuid} summary={data.summary} />
        </motion.div>

        {/* Cell "3": Info Tabs */}
        <motion.div
          layout
          className={cn(
            "xl:col-span-1 xl:row-span-2 overflow-auto ",
            isTheaterMode ? "h-96" : "h-[820px]",
          )}
        >
          <VideoInfoTabs videoData={data} />
        </motion.div>
      </motion.div>
    </div>
  );
}
