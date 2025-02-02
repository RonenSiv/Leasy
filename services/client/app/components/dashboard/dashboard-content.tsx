"use client";

import { motion } from "framer-motion";
import { VideoCard } from "../video-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoProgress } from "../video-progress";
import { Clock, Eye, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardResource, VideoPreviewResource } from "@/types";
import { useClient } from "@/hooks/use-client";

const RECENT_VIDEOS_COUNT = 3;

const getTotalMinutes = (videos: VideoPreviewResource[] = []) => {
  return videos.reduce(
    (acc, video) => acc + video.video.video_duration / 60,
    0,
  );
};

const getTotalMinutesWatched = (videos: VideoPreviewResource[] = []) => {
  return videos.reduce(
    (acc, video) => acc + video.video.last_watched_time / 60,
    0,
  );
};

export function DashboardContent() {
  const [stats, setStats] = useState<Partial<DashboardResource>>({});
  const [recentVideos, setRecentVideos] = useState<VideoPreviewResource[]>([]);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  }>({ current: 0, total: 0 });

  const client = useClient();

  useEffect(() => {
    const fetchStats = async () => {
      const stats = {
        total_videos: client.lectures?.dashboard.total_videos,
        overall_progress: client.lectures?.dashboard.overall_progress,
        completed_videos: client.lectures?.dashboard.completed_videos,
      } as Partial<DashboardResource>;
      setStats(stats);
      setProgress({
        current: getTotalMinutesWatched(client.lectures?.videos),
        total: getTotalMinutes(client.lectures?.videos),
      });
    };

    const fetchRecentVideos = async () => {
      const videos =
        (
          await client.getLectures({
            page: 1,
            sortBy: "created_at",
            sortDirection: "desc",
          })
        ).data.videos.slice(0, RECENT_VIDEOS_COUNT) || [];
      setRecentVideos(videos);
    };

    fetchStats();
    fetchRecentVideos();
  }, [client.lectures]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          title="Total Videos"
          value={`${stats.total_videos} videos`}
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Completed Videos"
          value={stats.completed_videos?.toLocaleString() || "0"}
        />
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          title="Overall Progress"
          value={`${stats.overall_progress}%`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoProgress current={progress.current} total={progress.total} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Statistics</CardTitle>
            <CardDescription>
              Your performance over the last 7 days
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recent Videos</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {recentVideos.length ? (
          recentVideos.map((video) => <VideoCard key={video.uuid} {...video} />)
        ) : (
          <h2>No Videos Found</h2>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button asChild>
          <Link href="/upload">Upload New Video</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/browse">Browse All Videos</Link>
        </Button>
      </div>
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
