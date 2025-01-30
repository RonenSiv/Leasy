"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VideoCard } from "../components/video-card";
import { VideoProgress } from "../components/video-progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "@/components/ui/charts";
import { Clock, Eye, Users } from "lucide-react";

// This would typically come from an API call
const dummyRecentVideos = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the basics of React",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    description: "Dive deep into JavaScript",
    thumbnail: "/placeholder.svg?height=200&width=400",
  },
];

export default function Dashboard() {
  const [recentVideos, setRecentVideos] = useState(
    dummyRecentVideos.slice(0, 3),
  );
  const [overallProgress, setOverallProgress] = useState({
    current: 120,
    total: 300,
  }); // in minutes
  const router = useRouter();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalWatchTime: 1200, // in minutes
    totalViews: 5000,
    averageEngagement: 85, // percentage
  });

  const [weeklyStats, setWeeklyStats] = useState({
    watchTime: [30, 45, 60, 40, 55, 75, 50], // last 7 days
    views: [100, 150, 200, 180, 220, 250, 210], // last 7 days
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>

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
            <VideoProgress
              current={overallProgress.current}
              total={overallProgress.total}
            />
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
            <Tabs defaultValue="watchTime">
              <TabsList className="mb-4">
                <TabsTrigger value="watchTime">Watch Time</TabsTrigger>
                <TabsTrigger value="views">Views</TabsTrigger>
              </TabsList>
              <TabsContent value="watchTime">
                <LineChart data={weeklyStats.watchTime} labels={weekDays} />
              </TabsContent>
              <TabsContent value="views">
                <BarChart data={weeklyStats.views} labels={weekDays} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Recent Videos</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {recentVideos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
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
