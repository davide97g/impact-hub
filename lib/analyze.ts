import { db } from "@/lib/db"
import { getPullRequestDetails } from "@/lib/github"
import { analyzeWithLLM } from "@/lib/llm"

/**
 * MOCK: Main function to analyze a pull request
 * In a real app, this would use real LLM services and GitHub API
 */
export async function analyzePullRequest(repoFullName: string, prNumber: number, reviewId: string) {
  try {
    // Update review status
    await db.review.update({ id: reviewId }, { status: "in_progress" })

    // MOCK: For preview, use a mock token
    // In a real app, get from user record
    const accessToken = "mock-token"

    // Get PR details and diff
    const prDetails = await getPullRequestDetails(repoFullName, prNumber, accessToken)

    // Prepare context for LLM
    const context = {
      repoName: repoFullName,
      prNumber: prNumber,
      prTitle: prDetails.title,
      prDescription: prDetails.description,
      files: prDetails.files.map((file) => ({
        filename: file.filename,
        diff: file.diff,
      })),
    }

    // MOCK: Analyze with LLM
    console.log("Analyzing PR with LLM...")
    const analysisResult = await analyzeWithLLM(context)

    // Update review with results
    await db.review.update(
      { id: reviewId },
      {
        status: "completed",
        complexity: analysisResult.scores.complexity,
        readability: analysisResult.scores.readability,
        cleanliness: analysisResult.scores.cleanliness,
        robustness: analysisResult.scores.robustness,
        summary: analysisResult.summary,
        recommendations: analysisResult.recommendations,
      },
    )

    return analysisResult
  } catch (error) {
    console.error("Error analyzing PR:", error)

    // Update review status to failed
    await db.review.update({ id: reviewId }, { status: "failed" })

    throw error
  }
}
