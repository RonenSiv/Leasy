"use client";

import React from "react";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { useParams } from "next/navigation";
import ChatBot from "@/app/components/ChatBot";

export default function VideoPage() {
  const params = useParams();
  const videoId = Array.isArray(params.videoId)
    ? params.videoId[0]
    : params.videoId;
  return (
    <div className="flex gap-8 w-screen max-h-[82vh] h-full p-8">
      <div className="flex w-full h-full justify-start items-start justify-items-start">
        <div className="flex flex-col w-full h-full items-center justify-start">
          <div className="w-full min-h-[50%]">
            <VideoPlayer videoId={videoId} />
          </div>
          <ChatBot />
        </div>
      </div>
      <div className="w-full">02</div>
    </div>
  );
}
