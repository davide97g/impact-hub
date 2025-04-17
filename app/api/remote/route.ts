import { WebhookPayload } from "@/types/api.types";
import { type NextRequest, NextResponse } from "next/server";

// This is a proxy for GitHub API requests to avoid exposing the token to the client
export async function POST(request: NextRequest) {
  try {
    console.info("Received webhook data", request);
    const body = (await request.json()) as WebhookPayload;
    console.log("Webhook data received:", body);

    const repository = body.repository;
    const user = body.sender;
    const commitMessage = body.head_commit.message;
    const commitUrl = body.head_commit.url;
    const commitId = body.head_commit.id;
    const commitAuthor = body.head_commit.author.name;
    const commitTimestamp = body.head_commit.timestamp;
    const commitEmail = body.head_commit.author.email;

    const responeMessage = `Repository: ${repository}, User: ${user}, Commit ID: ${commitId}, Commit Message: ${commitMessage}, Commit URL: ${commitUrl}, Commit Author: ${commitAuthor}, Commit Timestamp: ${commitTimestamp}, Commit Email: ${commitEmail}`;

    return NextResponse.json({ message: responeMessage }, { status: 200 });
  } catch (error) {
    console.error("Error logging webhook data:", error);
    return NextResponse.json({ error: "Failed to log data" }, { status: 500 });
  }
}
