import { Suspense } from "react";
import { VideoPlayer } from "../../components/video/video-player";
import { VideoContent } from "../../components/video/video-content";
import { VideoSkeleton } from "../../components/video/video-skeleton";
import { api } from "@/app/api";

async function getVideoData(id: string) {
  return await api.lecture.getLecture(id);
}

export default function VideoPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<VideoSkeleton />}>
      <VideoPageContent id={params.id} />
    </Suspense>
  );
}

async function VideoPageContent({ id }: { id: string }) {
  const videoData = await getVideoData(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{videoData.title}</h1>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <VideoPlayer videoUrl={videoData.video_url} videoId={videoData.id} />
          <VideoContent videoData={videoData} />
        </div>
        <div className="lg:col-span-2">{/* Sidebar content */}</div>
      </div>
    </div>
  );
}
