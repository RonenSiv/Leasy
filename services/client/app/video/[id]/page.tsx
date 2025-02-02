import { Suspense } from "react";
import { VideoPlayer } from "../../components/video/video-player";
import { VideoSkeleton } from "../../components/video/video-skeleton";
import { VideoChat } from "../../components/video/video-chat";
import { VideoInfoTabs } from "../../components/video/video-info-tabs";
import { api } from "@/app/api/server-api";

async function getLectureData(id: string) {
  return await api.lecture.getLecture(id);
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function VideoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<VideoSkeleton />}>
      <VideoPageContent id={params.id} />
    </Suspense>
  );
}

async function VideoPageContent({ id }: { id: string }) {
  const { data } = await getLectureData(id);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data?.title}</h1>
      <div className="flex flex-col lg:flex-row gap-6 h-[90vh] overflow-y-hidden">
        {/* Left Column: Video player and Chat */}
        <div className="flex flex-col lg:w-1/2 gap-2 ">
          <VideoPlayer
            videoUrl={`${baseUrl}${data?.video?.video_url}`}
            videoId={data?.video?.uuid}
          />
          <VideoChat videoData={data} />
        </div>
        {/* Right Column: Tabs */}
        <div className="lg:w-1/2 h-full">
          <VideoInfoTabs videoData={data} />
        </div>
      </div>
    </div>
  );
}
