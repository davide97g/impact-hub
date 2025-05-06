"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: "Marco", commits: 45, pullRequests: 8, reviews: 12 },
  { name: "Laura", commits: 32, pullRequests: 5, reviews: 18 },
  { name: "Giovanni", commits: 58, pullRequests: 12, reviews: 7 },
  { name: "Sofia", commits: 27, pullRequests: 3, reviews: 9 },
  { name: "Luca", commits: 41, pullRequests: 7, reviews: 15 },
];

const chartConfig = {
  commits: {
    label: "Commit",
    color: "hsl(var(--chart-1))",
  },
  pullRequests: {
    label: "Pull Request",
    color: "hsl(var(--chart-2))",
  },
  reviews: {
    label: "Code Review",
    color: "hsl(var(--chart-3))",
  },
};

export function ContributionsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            stroke="#888888"
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            stroke="#888888"
            fontSize={12}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="commits"
            fill="var(--color-commits)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="pullRequests"
            fill="var(--color-pullRequests)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="reviews"
            fill="var(--color-reviews)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
