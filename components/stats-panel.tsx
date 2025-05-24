"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

// Mock data for stats
const reviewStats = {
  totalReviews: 42,
  totalRepositories: 5,
  averageScores: {
    complexity: 7.4,
    readability: 8.1,
    cleanliness: 7.8,
    robustness: 6.9,
  },
  recentReviews: [
    { date: "May 16", count: 3 },
    { date: "May 17", count: 5 },
    { date: "May 18", count: 2 },
    { date: "May 19", count: 7 },
    { date: "May 20", count: 4 },
    { date: "May 21", count: 8 },
    { date: "May 22", count: 6 },
  ],
}

// Convert average scores to array for bar chart
const scoreData = [
  { name: "Complexity", score: reviewStats.averageScores.complexity },
  { name: "Readability", score: reviewStats.averageScores.readability },
  { name: "Cleanliness", score: reviewStats.averageScores.cleanliness },
  { name: "Robustness", score: reviewStats.averageScores.robustness },
]

export function StatsPanel() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Reviews"
        value={reviewStats.totalReviews.toString()}
        description="All-time code reviews performed"
      />
      <StatCard
        title="Active Repositories"
        value={reviewStats.totalRepositories.toString()}
        description="Repositories with enabled reviews"
      />
      <StatCard
        title="Average Score"
        value={getOverallAverageScore().toFixed(1)}
        description="Across all code metrics"
      />
      <StatCard
        title="Last 7 Days"
        value={getTotalReviewsLast7Days().toString()}
        description="Code reviews performed recently"
      />

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Review Metrics</CardTitle>
          <CardDescription>Average scores across all repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip formatter={(value) => [`${value} / 10`, "Score"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                <Bar dataKey="score" fill="#22c55e" radius={[4, 4, 0, 0]}>
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorForScore(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Code reviews in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reviewStats.recentReviews} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function getOverallAverageScore() {
  const scores = reviewStats.averageScores
  return (scores.complexity + scores.readability + scores.cleanliness + scores.robustness) / 4
}

function getTotalReviewsLast7Days() {
  return reviewStats.recentReviews.reduce((sum, day) => sum + day.count, 0)
}

function getColorForScore(score: number) {
  if (score >= 8) return "#22c55e" // Green
  if (score >= 6) return "#eab308" // Yellow
  if (score >= 4) return "#f97316" // Orange
  return "#ef4444" // Red
}
