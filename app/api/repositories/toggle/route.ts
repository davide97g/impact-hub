import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { setupWebhook } from "@/lib/github"

/**
 * MOCK: API route to toggle a repository for code reviews
 * In a real app, this would verify authentication and update a real database
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
      accessToken: "mock-github-token",
    }

    const { repoId, enabled } = await req.json()

    if (typeof repoId !== "number") {
      return NextResponse.json(
        {
          error: "Missing or invalid repoId",
        },
        { status: 400 },
      )
    }

    // Find if repository already exists in our database
    const existingRepo = await db.repository.findUnique({
      repoId: repoId,
      userId: session.user.id,
    })

    if (enabled) {
      // Enable repository for code reviews
      if (existingRepo) {
        // Update existing repository
        await db.repository.update(
          { id: existingRepo.id },
          {
            enabled: true,
            updatedAt: new Date(),
          },
        )
      } else {
        // Add new repository to database
        await db.repository.create({
          userId: session.user.id,
          repoId: repoId,
          name: `repo-${repoId}`, // Would get from GitHub API
          fullName: `user/repo-${repoId}`, // Would get from GitHub API
          enabled: true,
        })
      }

      // Set up webhook (if not already set up)
      if (!existingRepo?.webhookId) {
        const webhookResult = await setupWebhook(repoId, session.accessToken)

        if (webhookResult.success) {
          await db.repository.update(
            { id: existingRepo?.id || 0 }, // In a real app, this would be the correct ID
            { webhookId: webhookResult.webhookId },
          )
        }
      }

      return NextResponse.json({
        message: "Repository enabled for code reviews",
      })
    } else {
      // Disable repository for code reviews
      if (existingRepo) {
        await db.repository.update(
          { id: existingRepo.id },
          {
            enabled: false,
            updatedAt: new Date(),
          },
        )

        return NextResponse.json({
          message: "Repository disabled for code reviews",
        })
      } else {
        return NextResponse.json(
          {
            error: "Repository not found",
          },
          { status: 404 },
        )
      }
    }
  } catch (error) {
    console.error("Error toggling repository:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
