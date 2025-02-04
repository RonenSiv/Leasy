"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Eye, Users } from "lucide-react";
import { EmptyState } from "../empty-state";
import { VideoCard } from "@/app/components/video-card";
import { VideoProgress } from "../video-progress";
import { useUser } from "@/hooks/use-user";
import { LecturesPreviewResource } from "@/types";

const RECENT_VIDEOS_COUNT = 3;

interface DashboardContentProps {
  serverData: LecturesPreviewResource;
}

export function DashboardContent({ serverData }: DashboardContentProps) {
  console.log(serverData);
  const { dashboard, videos } = serverData;
  const { user } = useUser();
  const { total_videos, completed_videos, overall_progress } = dashboard;
  const recentVideos = videos.slice(0, RECENT_VIDEOS_COUNT);

  // We might greet the user by name if we have a separate user hook
  const userName = user?.full_name?.split(" ")[0] || "there";

  const progressMessage = () => {
    if (overall_progress < 20) {
      return "You're just getting started! Keep it up!";
    } else if (overall_progress < 50) {
      return "You're making good progress! Keep it up!";
    } else if (overall_progress < 80) {
      return "You're almost there! Keep it up!";
    } else {
      return "All caught up! Great job!";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <h1 className="text-3xl font-bold">Welcome back {userName} 👋</h1>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          title="Total Videos"
          value={`${total_videos} videos`}
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Completed Videos"
          value={completed_videos.toString()}
        />
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          title="Overall Progress"
          value={`${overall_progress}%`}
        />
      </div>

      {/* Progress */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>{progressMessage()}</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoProgress progress={overall_progress} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Videos</h2>
        {recentVideos.length ? (
          <div className="grid md:grid-cols-3 gap-6">
            {recentVideos.map((lecture) => (
              <div key={lecture.uuid}>
                <VideoCard
                  lectureId={lecture.uuid}
                  title={lecture.title}
                  description={lecture.description}
                  computedProgress={
                    lecture.video.video_duration
                      ? (lecture.video.last_watched_time /
                          lecture.video.video_duration) *
                        100
                      : 0
                  }
                  video={lecture.video}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <EmptyState />
          </div>
        )}
      </div>

      {/* Nav Buttons (only if we have some videos) */}
      {recentVideos.length > 0 && (
        <div className="flex justify-between items-center">
          <Button asChild>
            <Link href="/upload">Upload New Video</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/browse">Browse All Videos</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
