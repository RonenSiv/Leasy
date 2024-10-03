"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import paths based on your project structure
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface EnhancedVideoPlayerProps {
  videoId: string;
  onProgressChange: (progress: number) => void;
}

export function EnhancedVideoPlayer({
  videoId,
  onProgressChange,
}: EnhancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSkipHud, setShowSkipHud] = useState<"back" | "forward" | null>(
    null,
  );
  const [showPauseHud, setShowPauseHud] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = currentTime;
  }, [videoRef.current]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        onProgressChange(video.currentTime / video.duration);
      }
    };

    const updateDuration = () => {
      console.log("Duration updated:", video.duration);
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error("Video failed to load", e);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("canplay", updateDuration); // Changed event
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        skipBackward();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        skipForward();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("canplay", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onProgressChange]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setShowPauseHud(true);
      setTimeout(() => setShowPauseHud(false), 500);
    }
  };

  const handleSeek = (newTime: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime[0];
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume[0];
      setVolume(newVolume[0]);
      setIsMuted(newVolume[0] === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume);
      }
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 10, 0);
      videoRef.current.currentTime = newTime;
      setShowSkipHud("back");
      setTimeout(() => setShowSkipHud(null), 500);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration,
      );
      videoRef.current.currentTime = newTime;
      setShowSkipHud("forward");
      setTimeout(() => setShowSkipHud(null), 500);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card
      className="w-full h-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
      ref={containerRef}
    >
      <CardContent className="p-0 flex flex-col h-full relative">
        <div className="relative flex-grow">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={`https://storage.googleapis.com/gtv-videos-bucket/sample/${videoId}.mp4`}
            poster={`https://storage.googleapis.com/gtv-videos-bucket/sample/images/${videoId}.jpg`}
            onClick={togglePlay}
            crossOrigin="anonymous"
          />
          <AnimatePresence>
            {showSkipHud && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full"
              >
                {showSkipHud === "back" ? (
                  <SkipBack size={48} />
                ) : (
                  <SkipForward size={48} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showPauseHud && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full"
              >
                {isPlaying ? <Play size={48} /> : <Pause size={48} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
          <Slider
            value={[currentTime]}
            max={duration || 0}
            step={0.1}
            onValueChange={handleSeek}
            className="mb-2"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePlay}
                className="text-white"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={skipBackward}
                className="text-white"
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={skipForward}
                className="text-white"
              >
                <SkipForward className="h-6 w-6" />
              </Button>
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                className="text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleFullScreen}
                className="text-white"
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
