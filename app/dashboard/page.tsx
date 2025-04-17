import { DashboardPage } from "@/components/dashboard-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("github_session");

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
