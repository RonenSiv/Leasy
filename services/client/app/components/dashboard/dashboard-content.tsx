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
import { BarChart, LineChart } from "@/components/ui/charts";
import { VideoProgress } from "../video-progress";
import { Clock, Eye, Users } from "lucide-react";

interface DashboardContentProps {
  recentVideos: any[];
  stats: {
    totalWatchTime: number;
    totalViews: number;
    averageEngagement: number;
  };
  weeklyStats: {
    watchTime: number[];
    views: number[];
  };
}

export function DashboardContent({
  recentVideos,
  stats,
  weeklyStats,
}: DashboardContentProps) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
          title="Total Watch Time"
          value={`${stats.totalWatchTime} mins`}
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
        />
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          title="Avg. Engagement"
          value={`${stats.averageEngagement}%`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoProgress current={120} total={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Statistics</CardTitle>
            <CardDescription>
              Your performance over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={weeklyStats.watchTime} labels={weekDays} />
            <BarChart data={weeklyStats.views} labels={weekDays} />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recent Videos</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {recentVideos ? (
          recentVideos.map((video) => <VideoCard key={video.id} {...video} />)
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
