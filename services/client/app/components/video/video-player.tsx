"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/api";

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
}

export function VideoPlayer({ videoUrl, videoId }: VideoPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  console.log("videoId:", videoId);
  console.log("videoUrl:", videoUrl);
  useEffect(() => {
    const interval = setInterval(() => {
      api.lecture.updateLastWatchedTime(videoId, currentTime).then();
    }, 5000);

    return () => clearInterval(interval);
  }, [videoId, currentTime]);

  return (
    <video
      controls
      className="w-full aspect-video"
      src={videoUrl}
      onTimeUpdate={(e) =>
        setCurrentTime(Math.floor(e.currentTarget.currentTime))
      }
    >
      Your browser does not support the video tag.
    </video>
  );
}
