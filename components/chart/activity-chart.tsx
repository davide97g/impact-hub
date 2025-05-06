"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { date: "01/05", commits: 5, pullRequests: 1 },
  { date: "02/05", commits: 8, pullRequests: 0 },
  { date: "03/05", commits: 12, pullRequests: 2 },
  { date: "04/05", commits: 3, pullRequests: 1 },
  { date: "05/05", commits: 7, pullRequests: 0 },
  { date: "06/05", commits: 10, pullRequests: 3 },
  { date: "07/05", commits: 15, pullRequests: 1 },
  { date: "08/05", commits: 9, pullRequests: 2 },
  { date: "09/05", commits: 6, pullRequests: 1 },
  { date: "10/05", commits: 8, pullRequests: 0 },
  { date: "11/05", commits: 14, pullRequests: 2 },
  { date: "12/05", commits: 11, pullRequests: 1 },
  { date: "13/05", commits: 7, pullRequests: 0 },
  { date: "14/05", commits: 5, pullRequests: 1 },
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
};

export function ActivityChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
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
          <Line
            type="monotone"
            dataKey="commits"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            stroke="var(--color-commits)"
          />
          <Line
            type="monotone"
            dataKey="pullRequests"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            stroke="var(--color-pullRequests)"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
