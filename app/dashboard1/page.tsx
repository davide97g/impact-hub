import { DashboardPage } from "@/components/dashboard-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("github_session");
  console.log({ sessionCookie });

  if (!sessionCookie) {
    redirect("/");
  }

  // Fetch user data on the server
  try {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${sessionCookie.value}`,
      },
    });

    if (!userResponse.ok) {
      // Token might be invalid, clear cookie and redirect to login
      redirect("/api/auth/logout");
    }

    const userData = await userResponse.json();

    console.log({ userData });

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: userData.login, name: userData.name }),
    });

    // Fetch repositories on the server
    const reposResponse = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=10",
      {
        headers: {
          Authorization: `token ${sessionCookie.value}`,
        },
      }
    );

    const repositories = await reposResponse.json();

    return (
      <DashboardPage
        initialUser={userData}
        initialRepositories={repositories}
      />
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    redirect("/api/auth/logout");
  }
}
