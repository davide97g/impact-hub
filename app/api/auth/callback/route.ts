import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the code from the URL
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error("No access token returned");
    }

    // Verify the token by making a request to GitHub API
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Invalid token");
    }

    // Set the token in a secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("github_session", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    });

    const installations = await fetch(
      "https://api.github.com/user/installations",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const { installations: apps } = await installations.json();

    const yourAppInstalled = apps.some(
      (app: any) => app.app_slug === "impact-hub-test"
    );

    console.log("Your app installed:", yourAppInstalled);

    if (!yourAppInstalled) {
      // Redirect to install page
      const installUrl = `https://github.com/apps/impact-hub-test/installations/new?redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
      return NextResponse.redirect(installUrl);
    }

    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.redirect(
      new URL("/?error=authentication_failed", request.url)
    );
  }
}
