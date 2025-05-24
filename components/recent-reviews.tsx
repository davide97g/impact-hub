"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { GitPullRequest, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock data for reviews - in a real app, this would be fetched from an API
const mockReviews = [
  {
    id: "review_1",
    repository: "acme/website",
    prNumber: 123,
    prTitle: "Add new landing page components",
    status: "completed",
    createdAt: "2025-05-21T14:30:00Z",
    scores: {
      complexity: 8.2,
      readability: 7.5,
      cleanliness: 9.0,
      robustness: 6.8,
    },
  },
  {
    id: "review_2",
    repository: "acme/api",
    prNumber: 87,
    prTitle: "Refactor authentication middleware",
    status: "completed",
    createdAt: "2025-05-20T10:15:00Z",
    scores: {
      complexity: 6.4,
      readability: 8.2,
      cleanliness: 7.9,
      robustness: 8.5,
    },
  },
  {
    id: "review_3",
    repository: "acme/mobile-app",
    prNumber: 45,
    prTitle: "Fix navigation issues in settings screen",
    status: "in_progress",
    createdAt: "2025-05-22T09:45:00Z",
    scores: null,
  },
]

export function RecentReviews() {
  // Use state to manage reviews - in a real app, you'd fetch this data
  const [reviews] = useState(mockReviews)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Code Reviews</CardTitle>
        <CardDescription>Latest pull request reviews across your repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pull Request</TableHead>
              <TableHead>Repository</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Overall Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No reviews found. Enable repositories to start getting code reviews.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <GitPullRequest className="h-4 w-4 mr-2 text-gray-500" />
                      <div className="font-medium">#{review.prNumber}</div>
                      <div className="ml-2 truncate max-w-[200px] text-gray-500">{review.prTitle}</div>
                    </div>
                  </TableCell>
                  <TableCell>{review.repository}</TableCell>
                  <TableCell>
                    <ReviewStatusBadge status={review.status} />
                  </TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {review.scores ? (
                      <div className="flex items-center">
                        <ScoreIndicator score={getAverageScore(review.scores)} />
                        <span className="ml-2">{getAverageScore(review.scores).toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/reviews/${review.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ReviewStatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
      <AlertCircle className="h-3 w-3 mr-1" />
      In Progress
    </Badge>
  )
}

function ScoreIndicator({ score }: { score: number }) {
  let color = "bg-red-500"

  if (score >= 8) {
    color = "bg-green-500"
  } else if (score >= 6) {
    color = "bg-yellow-500"
  } else if (score >= 4) {
    color = "bg-orange-500"
  }

  return <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
}

function getAverageScore(scores: Record<string, number>) {
  const values = Object.values(scores)
  return values.reduce((sum, score) => sum + score, 0) / values.length
}
