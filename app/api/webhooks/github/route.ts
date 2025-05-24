import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { analyzePullRequest } from "@/lib/analyze"

/**
 * MOCK: This route handles GitHub webhook events for pull requests
 * In a real app, this would verify the webhook signature and process real GitHub events
 */
export async function POST(req: NextRequest) {
  try {
    // MOCK: For preview, we'll skip signature verification
    // In production, this would verify the webhook signature with GitHub's secret

    /*
    // Real implementation would verify the signature:
    const signature = req.headers.get("x-hub-signature-256")
    if (!verifyWebhookSignature(signature, await req.text(), process.env.GITHUB_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    */

    const payload = await req.json()

    // Only process pull request events
    if (req.headers.get("x-github-event") !== "pull_request") {
      return NextResponse.json({ message: "Ignored non-pull-request event" })
    }

    // Only process opened or synchronized events
    const action = payload.action
    if (action !== "opened" && action !== "synchronize") {
      return NextResponse.json({ message: `Ignored pull_request.${action} event` })
    }

    const repoId = payload.repository.id
    const repoFullName = payload.repository.full_name
    const prNumber = payload.pull_request.number
    const prTitle = payload.pull_request.title

    // Find repository in our database
    const repository = await db.repository.findUnique({ repoId })

    if (!repository || !repository.enabled) {
      return NextResponse.json({ message: "Repository not enabled for code reviews" })
    }

    // Create or update a review
    let review = await db.review.findUnique({
      id: `${repoId}-${prNumber}`, // Use a composite key
    })

    if (review) {
      // Update existing review
      review = await db.review.update(
        { id: review.id },
        {
          status: "in_progress",
          prTitle: prTitle,
          updatedAt: new Date(),
        },
      )
    } else {
      // Create new review
      review = await db.review.create({
        id: `${repoId}-${prNumber}`,
        userId: repository.userId,
        repoId: repoId,
        prNumber: prNumber,
        prTitle: prTitle,
        status: "in_progress",
      })
    }

    // Queue analysis job (or perform directly for MVP)
    analyzePullRequest(repoFullName, prNumber, review.id)

    return NextResponse.json({
      message: "Pull request queued for analysis",
      reviewId: review.id,
    })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// MOCK: Helper function to verify webhook signature
// In a real app, this would use crypto to verify the signature
function verifyWebhookSignature(signature: string | null, payload: string, secret: string) {
  // MOCK: For preview, always return true
  // In production, this would verify the signature using crypto
  return true
}
