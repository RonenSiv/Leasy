import React, { Suspense, useRef, useState } from "react";
import { FaCompressAlt, FaExpandAlt } from "react-icons/fa";
import { VideoComponent } from "@/app/components/VideoComponent";

const VideoPlaceholder = () => (
  <div
    role="status"
    className="flex items-center justify-center h-full w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
  >
    <svg
      className="w-10 h-10 text-gray-200 dark:text-gray-600"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 20"
    >
      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

export const VideoPlayer = ({
  videoId,
  isFullScreen,
  toggleFullScreen,
}: {
  videoId: string;
  isFullScreen?: boolean;
  toggleFullScreen?: () => void;
}) => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    console.error("Video error:", e);
    setVideoError(true);
  };

  return (
    <Suspense fallback={<VideoPlaceholder />}>
      {videoError ? (
        <div>Error: The video failed to load.</div>
      ) : (
        <div
          ref={videoRef}
          className={`relative flex flex-col w-full h-full border border-gray-200 shadow bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg`}
        >
          <div className="flex items-center justify-center h-full w-full">
            <button
              className="absolute top-0 right-0 p-2 m-2 z-[5] text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-100 rounded-full"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? <FaCompressAlt /> : <FaExpandAlt />}
            </button>
            <VideoComponent />
          </div>
        </div>
      )}
    </Suspense>
  );
};
