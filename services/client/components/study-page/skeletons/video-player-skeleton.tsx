import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const VideoPlayerCardSkeleton: React.FC = () => (
  <div className="w-full h-full bg-gray-800 rounded-lg flex flex-col justify-between p-4">
    {/* Video container */}
    <Skeleton className="flex-1 rounded-lg mb-4" />

    {/* Controls */}
    <div className="flex items-center justify-between">
      {/* Play/Pause button */}
      <Skeleton className="w-10 h-10 rounded-full" />

      {/* Progress Bar */}
      <Skeleton className="h-2 flex-1 mx-4 rounded-full" />

      {/* Volume Control */}
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

export default VideoPlayerCardSkeleton;
