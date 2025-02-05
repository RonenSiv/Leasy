import { VideoPlayer } from "@/app/components/video/video-player";
import { VideoChat } from "@/app/components/video/video-chat";
import { VideoInfoTabs } from "@/app/components/video/video-info-tabs";
import { getFullLectureData } from "@/app/actions/fetch-all-lecture-data";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const lectureData = await getFullLectureData(params.id);
  console.log(lectureData);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{lectureData.title}</h1>
      <div className="flex flex-col lg:flex-row gap-6 h-[90vh] overflow-y-hidden">
        {/* Left Column: Video player and Chat */}
        <div className="flex flex-col lg:w-1/2 gap-2">
          <VideoPlayer
            videoUrl={lectureData.video.video_url}
            videoId={lectureData.video.uuid}
            startTime={lectureData.video?.last_watched_time || 0}
          />
          <VideoChat
            videoData={lectureData}
            initialMessages={lectureData.chatHistory}
          />
        </div>
        {/* Right Column: Info Tabs */}
        <div className="lg:w-1/2 h-full">
          <VideoInfoTabs videoData={lectureData} />
        </div>
      </div>
    </div>
  );
}
