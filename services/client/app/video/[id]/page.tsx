"use client";

import { VideoPlayer } from "@/app/components/video/video-player";
import { VideoChat } from "@/app/components/video/video-chat";
import { VideoInfoTabs } from "@/app/components/video/video-info-tabs";
import useSWR from "swr";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { VideoSkeleton } from "@/app/components/video/video-skeleton";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function VideoPage() {
  const params = useParams();
  const {
    data: cachedData,
    error,
    isLoading,
  } = useSWR(`/lecture/${params.id}`, fetcher);
  if (isLoading) return <VideoSkeleton />;
  if (error) return <div>Failed to load lecture</div>;
  const { data } = cachedData;

  const onTimeUpdate = (time: number) => {
    api.put(`/video/last-watched-time/${data.video.uuid}`, {
      last_watched_time: time,
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <div className="flex flex-col lg:flex-row gap-6 h-[90vh] overflow-y-hidden">
        <div className="flex flex-col lg:w-1/2 gap-2">
          <VideoPlayer video={data.video} onTimeUpdate={onTimeUpdate} />
          <VideoChat chatUuid={data.chat.uuid} />
        </div>
        <div className="lg:w-1/2 h-full">
          <VideoInfoTabs videoData={data} />
        </div>
      </div>
    </div>
  );
}
