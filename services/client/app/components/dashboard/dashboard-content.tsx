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
import { VideoPreviewResource } from "@/types";
import { useClient } from "@/hooks/use-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { EmptyState } from "../empty-state";

const RECENT_VIDEOS_COUNT = 3;

function useRecentVideos() {
  const client = useClient();
  return useSuspenseQuery<VideoPreviewResource[]>({
    queryKey: ["recentVideos"],
    queryFn: async () => {
      const response = await client.getLectures({
        page: 1,
        sortBy: "created_at",
        sortDirection: "desc",
      });
      return response.data.videos.slice(0, RECENT_VIDEOS_COUNT);
    },
  });
}

export function DashboardContent() {
  const { data: recentVideos } = useRecentVideos();
  const client = useClient();
  const [stats, setStats] = useState({
    total_videos: 0,
    completed_videos: 0,
    overall_progress: 0,
  });
  // Use numbers (seconds) for progress.
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
  });

  useEffect(() => {
    const { dashboard, videos } = client.lectures;
    setStats({
      total_videos: dashboard.total_videos,
      completed_videos: dashboard.completed_videos,
      overall_progress: dashboard.overall_progress,
    });
    const currentSeconds = videos.reduce(
      (acc, videoData) => acc + videoData.video.last_watched_time,
      0,
    );
    const totalSeconds = videos.reduce(
      (acc, videoData) => acc + videoData.video.video_duration,
      0,
    );

    setProgress({
      current: currentSeconds,
      total: totalSeconds,
    });
  }, [recentVideos, client.lectures]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <h1 className="text-3xl font-bold">Welcome back!</h1>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
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

      {/* Progress & Weekly Stats */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoProgress current={progress.current} total={progress.total} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Videos</h2>
        {recentVideos.length ? (
          <div className="grid md:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <VideoCard key={video.uuid} {...video} />
            ))}
          </div>
        ) : (
          // Center the empty state within the section
          <div className="flex items-center justify-center py-20">
            <EmptyState />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
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
