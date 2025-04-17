import { type NextRequest, NextResponse } from "next/server";

// This is a proxy for GitHub API requests to avoid exposing the token to the client
export async function POST(request: NextRequest) {
  try {
    console.info("Received webhook data", request);
    const body = await request.json();
    console.log("Webhook data received:", body);
    return NextResponse.json({ message: "Data logged successfully" });
  } catch (error) {
    console.error("Error logging webhook data:", error);
    return NextResponse.json({ error: "Failed to log data" }, { status: 500 });
  }
}
