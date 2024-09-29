"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for study sessions
const mockStudySessions = [
  { date: "2024-09-01", notes: 3, duration: 60, uploads: 2 },
  { date: "2024-09-02", notes: 2, duration: 45, uploads: 1 },
  { date: "2024-09-03", notes: 1, duration: 30, uploads: 2 },
  { date: "2024-09-04", notes: 4, duration: 90, uploads: 3 },
  { date: "2024-09-05", notes: 5, duration: 120, uploads: 4 },
  { date: "2024-09-06", notes: 2, duration: 60, uploads: 1 },
  { date: "2024-09-07", notes: 3, duration: 75, uploads: 2 },
];

const mockStudySummary = {
  totalNotes: 20,
  totalStudyTime: 480, // minutes
  averageStudyTime: 68, // minutes
};

export function StudyOverview() {
  const [studySessions] = useState(mockStudySessions);
  const [studySummary] = useState(mockStudySummary);

  // Chart config for styling
  const chartConfig = {
    notes: {
      label: "Notes",
      color: "hsl(var(--chart-1))",
    },
    time: {
      label: "Study Time",
      color: "hsl(var(--chart-2))",
    },
    uploads: {
      label: "Uploads",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Total Notes Card */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Total Notes Created</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {studySummary.totalNotes}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={studySessions}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="notes" fill="hsl(var(--chart-1))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Over the past 7 days, you have created{" "}
              <span className="font-medium">{studySummary.totalNotes}</span>{" "}
              notes.
            </CardDescription>
          </CardFooter>
        </Card>

        {/* Total Study Time Card */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Total Study Time</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {studySummary.totalStudyTime} mins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={studySessions}>
                  <Line
                    type="monotone"
                    dataKey="duration"
                    strokeWidth={2}
                    dot={false}
                    stroke="hsl(var(--chart-2))"
                  />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              You have studied for a total of{" "}
              <span className="font-medium">{studySummary.totalStudyTime}</span>{" "}
              minutes.
            </CardDescription>
          </CardFooter>
        </Card>

        {/* Average Study Time Card */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Average Study Time</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {studySummary.averageStudyTime} mins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={studySessions}>
                  <defs>
                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-4))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="duration"
                    fill="url(#colorTime)"
                  />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Your average study session lasts{" "}
              <span className="font-medium">
                {studySummary.averageStudyTime}
              </span>{" "}
              minutes.
            </CardDescription>
          </CardFooter>
        </Card>

        {/* Uploads Relative to Study Time Card */}
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Total videos uploaded</CardDescription>
            <CardTitle className="text-4xl tabular-nums">Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={studySessions}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="uploads"
                    fill="hsl(var(--chart-3))"
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Uploads are displayed relative to study time.
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
