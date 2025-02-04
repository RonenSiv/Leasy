"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/app/components/spinner";
import { updateWatchTime } from "@/app/actions/server-actions";

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
  startTime?: number; // last watched time in seconds
}

export function VideoPlayer({
  videoUrl,
  videoId,
  startTime = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasSetStartTimeRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      if (time - currentTime > 5) {
        updateLastWatchedTime(time);
        setCurrentTime(time);
      }
      if (videoRef.current.currentTime >= videoRef.current.duration - 1) {
        updateLastWatchedTime(videoRef.current.duration);
        setCurrentTime(videoRef.current.duration);
      }
    }
  };

  const updateLastWatchedTime = (time: number = currentTime) => {
    updateWatchTime(videoId, time).catch((err) => console.error(err));
  };

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    let blobUrl: string | null = null;
    let isMounted = true;

    const fetchVideo = async () => {
      if (!videoUrl) return;
      try {
        setLoading(true);
        const videoEndpoint = videoUrl.split("/").pop();
        const response = await fetch(`/api/video/${videoEndpoint}`, {
          signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch video");
        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setVideoSrc(blobUrl);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("API call failed:", error);
          setLoading(false);
        }
      }
    };

    fetchVideo().then(() => {
      if (isMounted && videoRef.current) {
        videoRef.current.currentTime = startTime;
        hasSetStartTimeRef.current = true;
      }
    });

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
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
        onCanPlay={() => {
          if (
            videoRef.current &&
            videoRef.current.currentTime < 1 &&
            !hasSetStartTimeRef.current
          ) {
            videoRef.current.currentTime = startTime;
            hasSetStartTimeRef.current = true;
          }
        }}
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
