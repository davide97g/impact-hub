"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: "JavaScript", value: 45, color: "#f7df1e" },
  { name: "TypeScript", value: 30, color: "#3178c6" },
  { name: "CSS", value: 15, color: "#264de4" },
  { name: "HTML", value: 10, color: "#e34c26" },
];

const chartConfig = {
  JavaScript: {
    label: "JavaScript",
    color: "#f7df1e",
  },
  TypeScript: {
    label: "TypeScript",
    color: "#3178c6",
  },
  CSS: {
    label: "CSS",
    color: "#264de4",
  },
  HTML: {
    label: "HTML",
    color: "#e34c26",
  },
};

export function CodeDistributionChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
