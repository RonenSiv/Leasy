"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useParams, usePathname } from "next/navigation";
import { VideoPlayer } from "@/app/components/video/video-player";
import { VideoChat } from "@/app/components/video/video-chat";
import { VideoInfoTabs } from "@/app/components/video/video-info-tabs";
import { VideoSkeleton } from "@/app/components/video/video-skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fetcher } from "@/app/actions/fetcher";
import api from "@/lib/api";

export default function VideoPage() {
  const params = useParams();
  const pathname = usePathname();
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const currentTimeRef = useRef(0); // This ref will hold the current time for event handlers
  const lastUpdatedTimeRef = useRef(0); // Track the last time we updated the server
  const isUnmountingRef = useRef(false); // Track if we're unmounting
  const hasVideoDataRef = useRef(false); // Track if we have loaded video data

  const {
    data: cachedData,
    error,
    isLoading,
  } = useSWR(`/lecture/${params.id}`, fetcher.get);
  const videoPlayerRef = useRef<{ seekTo: (time: number) => void } | null>(
    null,
  );

  // We'll use a ref to measure the chat element's rendered height.
  const chatRef = useRef(null);

  // Update hasVideoDataRef when data changes
  useEffect(() => {
    if (cachedData?.data?.video?.uuid) {
      hasVideoDataRef.current = true;
    }
  }, [cachedData]);

  // Function to update the last watched time via API
  const updateLastWatchedTime = async (force = false) => {
    if (!hasVideoDataRef.current || !cachedData?.data?.video?.uuid) return;

    // Only update if the time has changed significantly (more than 5 seconds)
    // or if we're forcing an update (like on unmount)
    const currentTime = Math.floor(currentTimeRef.current);
    if (!force && Math.abs(currentTime - lastUpdatedTimeRef.current) < 5)
      return;

    try {
      console.log("Updating last watched time to:", currentTime);
      await fetcher.put(
        `/video/last-watched-time/${cachedData.data.video.uuid}`,
        {
          last_watched_time: currentTime,
        },
      );
      lastUpdatedTimeRef.current = currentTime;
    } catch (error) {
      console.error("Failed to update last watched time", error);
    }
  };

  // Function for the beforeunload event
  const handleBeforeUnload = () => {
    // We can't use async functions with beforeunload
    if (!hasVideoDataRef.current || !cachedData?.data?.video?.uuid) return;

    const currentTime = Math.floor(currentTimeRef.current);
    console.log("Handling beforeunload, time:", currentTime);

    // Use navigator.sendBeacon for better reliability during page unload
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        last_watched_time: currentTime,
      });
      const beaconUrl = `${api.defaults.baseURL}/video/last-watched-time/${cachedData.data.video.uuid}`;
      console.log("Sending beacon to:", beaconUrl);
      navigator.sendBeacon(
        beaconUrl,
        new Blob([data], { type: "application/json" }),
      );
    } else {
      // Fallback to synchronous XHR if sendBeacon is not available
      try {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "PUT",
          `${api.defaults.baseURL}/video/last-watched-time/${cachedData.data.video.uuid}`,
          false,
        );
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(
          JSON.stringify({
            last_watched_time: currentTime,
          }),
        );
      } catch (e) {
        console.error("Failed to send XHR during page unload", e);
      }
    }
  };

  // Set up event listeners for browser/tab close
  useEffect(() => {
    if (!hasVideoDataRef.current || !cachedData?.data?.video?.uuid) return;

    // Add event listener for page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        updateLastWatchedTime(true);
      }
    };

    // Add event listener for page refresh using the pagehide event
    // This is more reliable than beforeunload for refresh scenarios
    const handlePageHide = (e: { persisted: any }) => {
      // persisted flag will be true if the page is being cached for later reuse
      // (like in the back-forward cache)
      console.log("Page hide event, persisted:", e.persisted);
      handleBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Periodic updates every 30 seconds while the video is being watched
    const intervalId = setInterval(() => {
      updateLastWatchedTime();
    }, 30000);

    return () => {
      isUnmountingRef.current = true;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);

      // Final update when unmounting
      updateLastWatchedTime(true);
    };
  }, [cachedData?.data?.video?.uuid]);

  // Handle route changes
  useEffect(() => {
    // This will run whenever the pathname changes
    return () => {
      // Only update if we're navigating away from this video page
      if (pathname.startsWith(`/video/${params.id}`)) {
        console.log("Updating last watched time on route change");
        updateLastWatchedTime(true);
      }
    };
  }, [pathname]);

  const onTimeUpdate = async (time: number) => {
    setCurrentVideoTime(time);
    currentTimeRef.current = time; // Update the ref with the current time
  };

  const handleSeekTo = (time: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(time);
    }
  };

  if (isLoading) return <VideoSkeleton />;
  if (error) return <div>Failed to load lecture</div>;
  const { data } = cachedData;

  // Handle both cases: when transcription is already an object or when it's a JSON string
  const parsedTranscription = (() => {
    if (typeof data.transcription === "string") {
      try {
        return JSON.parse(data.transcription);
      } catch (error) {
        console.error("Failed to parse transcription:", error);
        return [];
      }
    }
    return data.transcription; // It's already an object
  })();

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
              ref={videoPlayerRef}
              video={data.video}
              onTimeUpdate={onTimeUpdate}
              onTheaterModeChange={setIsTheaterMode}
              transcription={parsedTranscription}
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
          <VideoInfoTabs
            videoData={data}
            currentTime={currentVideoTime}
            onSeekTo={handleSeekTo}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
