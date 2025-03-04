"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

export function LineChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const chartData: ChartData[] = data.map((value, index) => ({
    name: labels[index],
    value,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            className="text-muted-foreground fill-muted-foreground"
          />
          <YAxis className="text-muted-foreground fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--popover-foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const chartData: ChartData[] = data.map((value, index) => ({
    name: labels[index],
    value,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            className="text-muted-foreground fill-muted-foreground"
          />
          <YAxis className="text-muted-foreground fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--popover-foreground))",
            }}
          />
          <Bar dataKey="value" fill="hsl(var(--primary))" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
