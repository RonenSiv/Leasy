"use client";

import React, { useState } from "react";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { useParams } from "next/navigation";
import ChatBot from "@/app/components/ChatBot";
import { StudyCardTabs } from "@/app/components/StudyCardTabs";

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
    <div className={`flex gap-8 w-[95vw] max-h-[80vh] p-8`}>
      {isFullScreen && <StudyCardTabs vertical absolute />}
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
          <div className={`w-full max-h-[50%]`}>
            <ChatBot expanded />
          </div>
        </div>
      </div>
      {!isFullScreen && (
        <div className="w-full h-full">
          <StudyCardTabs />
        </div>
      )}
    </div>
  );
}
