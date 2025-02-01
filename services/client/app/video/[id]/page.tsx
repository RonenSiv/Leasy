import { Suspense } from "react";
import { VideoPlayer } from "../../components/video/video-player";
import { VideoContent } from "../../components/video/video-content";
import { VideoSkeleton } from "../../components/video/video-skeleton";
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
  console.log("id:", id);
  const { data } = await getLectureData(id);
  console.log(data);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data?.title}</h1>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <VideoPlayer
            videoUrl={`${baseUrl}${data?.video?.video_url}`}
            videoId={data?.video?.uuid}
          />
          <VideoContent videoData={data} />
        </div>
        <div className="lg:col-span-2">{/* Sidebar content */}</div>
      </div>
    </div>
  );
}
