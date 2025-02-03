"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/app/components/spinner";
import { useClient } from "@/hooks/use-client";

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
}

export function VideoPlayer({ videoUrl, videoId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const client = useClient();
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      if (time - currentTime > 5) {
        updateLastWatchedTime(time);
        setCurrentTime(time);
      }

      // check if the video has ended
      if (videoRef.current.currentTime >= videoRef.current.duration - 1) {
        updateLastWatchedTime(videoRef.current.duration);
        setCurrentTime(videoRef.current.duration);
      }
    }
  };

  const updateLastWatchedTime = (time: number = currentTime) => {
    client
      .updateLastWatchedTime(videoId, time)
      .catch((err) => console.error(err));
  };

  // Fetch the video blob and convert to an object URL.
  useEffect(() => {
    let blobUrl: string | null = null;

    async function fetchVideo() {
      if (!videoUrl) return;
      try {
        const videoEndpoint = videoUrl.split("/").pop();
        const response = await fetch(`/api/video/${videoEndpoint}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }
        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);
        setVideoSrc(blobUrl);
      } catch (error) {
        console.error("API call failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="aspect-video bg-black flex-1 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Spinner />
        </div>
      )}
      <video
        ref={videoRef}
        src={videoSrc || undefined}
        controls
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setLoading(false)}
        onSeekedCapture={() => {
          handleTimeUpdate();
          setCurrentTime(Math.floor(videoRef.current?.currentTime || 0));
        }}
        className="w-full h-full"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
