import { VideoPlayer } from "@/app/components/video/video-player";
import { VideoChat } from "@/app/components/video/video-chat";
import { VideoInfoTabs } from "@/app/components/video/video-info-tabs";
import { getFullLectureData } from "@/app/actions/fetch-all-lecture-data";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const videoData = await getFullLectureData(params.id);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{videoData.title}</h1>
      <div className="flex flex-col lg:flex-row gap-6 h-[90vh] overflow-y-hidden">
        {/* Left Column: Video player and Chat */}
        <div className="flex flex-col lg:w-1/2 gap-2">
          <VideoPlayer
            videoUrl={videoData.video.video_url}
            videoId={videoData.video.uuid}
            startTime={videoData.video?.last_watched_time || 0}
          />
          <VideoChat
            videoData={videoData}
            initialMessages={videoData.chatHistory}
          />
        </div>
        {/* Right Column: Info Tabs */}
        <div className="lg:w-1/2 h-full">
          <VideoInfoTabs videoData={videoData} />
        </div>
      </div>
    </div>
  );
}
