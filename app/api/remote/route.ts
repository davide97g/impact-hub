import { sql } from "@/app/(config)/postgres";
import { NextResponse } from "next/server";
import { computeReputationScoring } from "reputation-scoring";

export async function POST(request: Request) {
  try {
    // Parse the webhook payload
    const payload = await request.json();

    // Get the GitHub event type from headers
    const githubEvent = request.headers.get("x-github-event");

    console.log(`Received webhook: ${githubEvent}`, payload);

    // Here you would process the webhook data
    // For example, trigger a new analysis, update database records, etc.
    const scores = await computeReputationScoring({
      repo: payload.repository.name,
      owner: payload.repository.owner.login,
      token: process.env.GITHUB_TOKEN,
    });

    try {
      await sql(
        `INSERT INTO public."Scores" (repository, user, score) VALUES ${scores
          .map(
            (score) =>
              `('${payload.repository.name}', '${score.user}', ${score.score})`
          )
          .join(
            ", "
          )} ON CONFLICT (repository, user) DO UPDATE SET score = EXCLUDED.score;`
      );
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    // Handle the webhook based on the event type

    // For now, we'll just log it and return a success response
    return NextResponse.json({
      success: true,
      message: `Updated ${githubEvent} webhook for ${
        payload.repository.name
      }: ${scores.map((score) => `${score.user}: ${score.score}`)}`,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
