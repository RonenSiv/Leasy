"use client";

import React from "react";
import MotionCardComponent from "./motion-card-component";
import { Youtube } from "lucide-react";
import { EnhancedVideoPlayer } from "@/components/enhanced-video-player";

interface VideoPlayerCardProps {
  handleVideoProgress: (progress: number) => void;
}

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  handleVideoProgress,
}) => (
  <MotionCardComponent
    title="Video Player"
    icon={Youtube}
    headerClasses="bg-gradient-to-r from-purple-500 to-indigo-500"
    contentClasses="p-0 h-[calc(100%-4rem)]"
  >
    <EnhancedVideoPlayer
      videoId="BigBuckBunny"
      onProgressChange={handleVideoProgress}
    />
  </MotionCardComponent>
);

export default VideoPlayerCard;
