"use client";

import React, { useState } from "react";
import { VideoPlayer } from "@/app/components/ui/video-player/VideoPlayer";
import { useParams } from "next/navigation";
import ChatBot from "@/app/components/Chat/ChatBot";
import { StudyCardTabs } from "@/app/components/ui/cards/StudyCardTabs";
import { studyTabsContent } from "@/app/constants/constants";

export default function VideoPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const params = useParams();
  const videoId = Array.isArray(params.videoId)
    ? params.videoId[0]
    : params.videoId;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      className={`relative flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-[95vw] p-4 md:p-8 `}
    >
      <div className="flex w-full h-full justify-start items-start justify-items-start ">
        {isFullScreen && (
          <StudyCardTabs vertical absolute content={studyTabsContent} />
        )}
        <div className="relative flex flex-col w-full h-full items-center justify-start">
          <div
            className={`w-full ${!isFullScreen ? "h-[50vh]" : "md:sticky md:top-0 md:left-0 md:z-[49] md:h-[60vh] max-md:h-[50vh]"}`}
          >
            <VideoPlayer
              videoId={videoId}
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
            />
          </div>
          <div className={`w-full h-full rounded-lg `}>
            <ChatBot expanded />
          </div>
        </div>
      </div>
      {!isFullScreen && (
        <div className="w-full h-full max-md:mt-12 max-md:bg-white max-md:dark:bg-gray-800  max-md:rounded-md">
          <StudyCardTabs content={studyTabsContent} />
        </div>
      )}
    </div>
  );
}
