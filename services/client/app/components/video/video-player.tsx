"use client";

import { useEffect, useRef } from "react";
import { Video } from "@/types/api-types";
import { updateWeeklyProgress } from "@/app/utils/weekly-progress";

interface VideoPlayerProps {
  video: Video;
  onTimeUpdate?: (time: number) => void;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export function VideoPlayer({ video, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Store the last time that we updated the weekly progress (in seconds)
  const lastUpdateTimeRef = useRef<number>(video.last_watched_time || 0);
  // Use this ref to throttle the callback (in seconds)
  const lastThrottleCallRef = useRef<number>(0);
  // Throttle interval (in seconds)
  const THROTTLE_INTERVAL = 5;

  useEffect(() => {
    if (videoRef.current && video.last_watched_time > 0) {
      videoRef.current.currentTime = video.last_watched_time;
      lastUpdateTimeRef.current = video.last_watched_time;
      lastThrottleCallRef.current = video.last_watched_time;
    }
  }, [video.last_watched_time]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    onTimeUpdate?.(Math.floor(currentTime));

    // Throttle: only update if THROTTLE_INTERVAL seconds have passed since last throttle call
    if (currentTime - lastThrottleCallRef.current >= THROTTLE_INTERVAL) {
      const delta = currentTime - lastUpdateTimeRef.current;
      console.log("Delta computed:", delta);
      // Only update if there's at least a 0.5-second increase
      if (delta >= 0.5) {
        // Round the delta to the nearest whole number
        updateWeeklyProgress({
          videoId: video.uuid,
          timeSpent: Math.round(delta),
        });
        lastUpdateTimeRef.current = currentTime;
      }
      lastThrottleCallRef.current = currentTime;
    }
  };

  const videoUrl = `/video/stream/${video.uuid}`;
  return (
    <div className="w-full aspect-video relative">
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg"
        controls
        poster={video.preview_image_url}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={`${baseURL}${videoUrl}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
