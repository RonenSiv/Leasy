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
      className={`flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-[95vw] max-h-[100vh] p-4 md:p-8 `}
    >
      {isFullScreen && (
        <StudyCardTabs vertical absolute content={studyTabsContent} />
      )}
      <div className="flex w-full h-full justify-start items-start justify-items-start">
        <div className="relative flex flex-col w-full h-full items-center justify-start">
          <div
            className={`${!isFullScreen ? "w-full min-h-[50%]" : "sticky top-0 left-0 w-full h-full z-[49] min-h-[60vh]"}`}
          >
            <VideoPlayer
              videoId={videoId}
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
            />
          </div>
          <div className={`w-full h-full rounded-lg overflow-y-hidden`}>
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
