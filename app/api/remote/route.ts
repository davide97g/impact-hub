import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the webhook payload
    const payload = await request.json();

    // Get the GitHub event type from headers
    const githubEvent = request.headers.get("x-github-event");

    console.log(`Received webhook: ${githubEvent}`, payload);

    // Here you would process the webhook data
    // For example, trigger a new analysis, update database records, etc.

    // For now, we'll just log it and return a success response
    return NextResponse.json({
      success: true,
      message: `Processed ${githubEvent} webhook`,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
