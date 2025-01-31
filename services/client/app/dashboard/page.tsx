import { Suspense } from "react";
import { DashboardSkeleton } from "./skeleton";
import { api } from "@/app/api";
import { DashboardContent } from "../components/dashboard/dashboard-content";

async function getRecentVideos() {
  const response = await api.lecture.getLectures(1, "date", "desc");
  return response?.data?.slice(0, 3);
}

async function getStats() {
  return {
    totalWatchTime: 1200,
    totalViews: 5000,
    averageEngagement: 85,
  };
}

async function getWeeklyStats() {
  return {
    watchTime: [30, 45, 60, 40, 55, 75, 50],
    views: [100, 150, 200, 180, 220, 250, 210],
  };
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContentWrapper />
    </Suspense>
  );
}

async function DashboardContentWrapper() {
  const recentVideos = await getRecentVideos();
  const stats = await getStats();
  const weeklyStats = await getWeeklyStats();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <DashboardContent
        recentVideos={recentVideos}
        stats={stats}
        weeklyStats={weeklyStats}
      />
    </div>
  );
}
