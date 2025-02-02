"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/app/api";

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
}

export function VideoPlayer({ videoUrl, videoId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Update the current time state whenever the video updates its time.
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
    }
  };

  // Debounce the API update: every time currentTime changes, wait 5 seconds,
  // then update the last watched time in the backend.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videoRef.current) {
        api.lecture
          .updateLastWatchedTime(videoId, currentTime)
          .catch((err) => console.error(err));
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [currentTime, videoId]);

  return (
    <div className="aspect-video bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
