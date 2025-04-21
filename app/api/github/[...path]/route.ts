import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// This is a proxy for GitHub API requests to avoid exposing the token to the client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("github_session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = (await params).path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `https://api.github.com/${path}${
    searchParams ? `?${searchParams}` : ""
  }`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${sessionCookie.value}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const data = await response.json();
    console.log({ url, data });

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying GitHub API request to ${path}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch data from GitHub" },
      { status: 500 }
    );
  }
}
