import { type NextRequest, NextResponse } from "next/server"
import { analyzePullRequest } from "@/lib/analyze"

/**
 * MOCK: This route allows triggering analysis on demand
 * In a real app, this would verify authentication and use real LLM services
 */
export async function POST(req: NextRequest) {
  try {
    // MOCK: For preview, we'll skip the real authentication check
    // In production, this would verify the user is authenticated

    // MOCK: Create a mock session for preview
    const session = {
      user: {
        id: "mock-user-id",
      },
    }

    const { repoFullName, prNumber } = await req.json()

    if (!repoFullName || !prNumber) {
      return NextResponse.json(
        {
          error: "Missing required fields: repoFullName, prNumber",
        },
        { status: 400 },
      )
    }

    // Generate a review ID
    const reviewId = `manual-${Date.now()}`

    // Start analysis process
    const analysisResult = await analyzePullRequest(repoFullName, prNumber, reviewId)

    return NextResponse.json({
      message: "Analysis completed",
      reviewId: reviewId,
      result: analysisResult,
    })
  } catch (error) {
    console.error("Error analyzing PR:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
