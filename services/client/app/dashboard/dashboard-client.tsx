"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLectures } from "@/hooks/use-lectures";
import { LectureCard } from "@/app/components/lectures/lecture-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, GraduationCap, Heart, Play } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LectureResponse } from "@/types/api-types";
import { useAuth } from "@/context/auth-context";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function WelcomeMessage({ name }: { name: string }) {
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";

  return (
    <h1 className="text-4xl font-bold mb-6">
      {greeting}, {name}!
    </h1>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function getMotivationalQuote(progress: number): string {
  if (progress === 100)
    return "Congratulations! You've completed all your lectures. What's next on your learning journey?";
  if (progress > 75)
    return "You're almost there! Keep up the great work and finish strong!";
  if (progress > 50)
    return "Halfway there and going strong. Your dedication is paying off!";
  if (progress > 25)
    return "Great start! You're making solid progress. Keep that momentum going!";
  return "Every journey begins with a single step. You've taken that step - now keep moving forward!";
}

function formatSecondsToHMS(seconds: number) {
  const sec = Math.floor(seconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getWeekKey(date = new Date()) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
  );
  return `${date.getFullYear()}-W${weekNumber}`;
}

interface DashboardClientProps {
  initialData: LectureResponse;
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { lectures, dashboard, isError } = useLectures({
    limit: 3,
    fallbackData: initialData,
  });

  const [weeklyProgressData, setWeeklyProgressData] = useState([
    { name: "Sun", progress: 0 },
    { name: "Mon", progress: 0 },
    { name: "Tue", progress: 0 },
    { name: "Wed", progress: 0 },
    { name: "Thu", progress: 0 },
    { name: "Fri", progress: 0 },
    { name: "Sat", progress: 0 },
  ]);

  const [uniqueVideosWatched, setUniqueVideosWatched] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem("weeklyProgress");
    if (storedData) {
      const weeklyData = JSON.parse(storedData);
      const weekKey = getWeekKey();
      const currentWeek = weeklyData[weekKey] || {};

      const newWeeklyData = dayNames.map((day) => {
        const dayStats = currentWeek[day] || { timeSpent: 0 };
        return {
          name: day.substring(0, 3),
          progress: dayStats.timeSpent,
        };
      });
      setWeeklyProgressData(newWeeklyData);

      const videoIdSet = new Set<string>();
      dayNames.forEach((day) => {
        const dayStats = currentWeek[day];
        if (dayStats && dayStats.watchedVideoIds) {
          dayStats.watchedVideoIds.forEach((id: string) => videoIdSet.add(id));
        }
      });
      setUniqueVideosWatched(videoIdSet.size);
    }
  }, []);

  if (isError) {
    return (
      <div className="text-center py-10">Error loading dashboard data</div>
    );
  }

  if (!dashboard || !user) {
    return null;
  }

  const {
    total_lectures,
    overall_progress,
    completed_lectures,
    incomplete_lectures,
  } = dashboard;

  const progressData = [
    { name: "Completed", value: completed_lectures },
    { name: "Incomplete", value: incomplete_lectures },
  ];

  return (
    <div className="container mx-auto py-10">
      <WelcomeMessage name={user.full_name.split(" ")[0]} />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {getMotivationalQuote(overall_progress)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overall_progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {overall_progress.toFixed(1)}% Complete
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard
          title="Total Lectures"
          value={total_lectures}
          icon={BookOpen}
        />
        <StatCard
          title="Completed Lectures"
          value={completed_lectures}
          icon={GraduationCap}
          description={`${((completed_lectures / total_lectures) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Incomplete Lectures"
          value={incomplete_lectures}
          icon={Clock}
          description={`${((incomplete_lectures / total_lectures) * 100).toFixed(1)}% remaining`}
        />
        <StatCard
          title="Favorite Lectures"
          value={lectures?.filter((lecture) => lecture.is_favorite).length || 0}
          icon={Heart}
          description="From recent lectures"
        />
        <StatCard
          title="Videos Watched"
          value={uniqueVideosWatched}
          icon={Play}
          description="Distinct videos watched this week"
        />
      </div>

      <Tabs defaultValue="progress" className="mb-8">
        <TabsList>
          <TabsTrigger value="progress">Progress Overview</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Your lecture completion status</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {progressData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Time watched per day (hh:mm:ss)</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyProgressData}>
                    <defs>
                      <linearGradient
                        id="progressColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatSecondsToHMS} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={formatSecondsToHMS} />
                    <Area
                      type="monotone"
                      dataKey="progress"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#progressColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Lectures</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/browse")}
            >
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lectures?.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lectures.map((lecture) => (
                <LectureCard key={lecture.uuid} lecture={lecture} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No recent lectures available.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={() => router.push("/browse")} className="mr-4">
          Browse All Lectures
        </Button>
        <Button onClick={() => router.push("/upload")} variant="outline">
          Upload New Lecture
        </Button>
      </div>
    </div>
  );
}
