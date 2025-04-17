import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("github_session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Missing required parameters: owner and repo" },
        { status: 400 }
      );
    }

    // Get the domain from environment variable or use a placeholder
    const domain = "https://impact.dacoder.it";

    // Create the webhook
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/hooks`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${sessionCookie.value}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "web",
          active: true,
          events: ["push"],
          config: {
            url: `${domain}/api/remote`,
            content_type: "json",
            insecure_ssl: "0",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Check if the error is due to insufficient permissions
      if (response.status === 403) {
        return NextResponse.json(
          {
            error: "Permission denied",
            message:
              "Your GitHub token doesn't have the required permissions to create webhooks. You need the 'admin:repo_hook' scope.",
            details: data,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to create webhook",
          message: data.message,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating webhook:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
