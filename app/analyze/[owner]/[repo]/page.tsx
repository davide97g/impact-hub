import { RepositoryAnalyzerPage } from "@/components/repository-analyzer-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AnalyzePage({
  params,
}: {
  params: { owner: string; repo: string };
}) {
  const { owner, repo } = params;

  // Check if user is authenticated
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("github_session");

  if (!sessionCookie) {
    redirect("/");
  }

  try {
    // Fetch repository details on the server
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${sessionCookie.value}`,
        },
      }
    );

    if (!repoResponse.ok) {
      throw new Error("Failed to fetch repository details");
    }

    const repoDetails = await repoResponse.json();

    // Fetch contributors on the server
    const contributorsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      {
        headers: {
          Authorization: `token ${sessionCookie.value}`,
        },
      }
    );

    if (!contributorsResponse.ok) {
      throw new Error("Failed to fetch contributors");
    }

    const contributors = await contributorsResponse.json();

    return (
      <RepositoryAnalyzerPage
        owner={owner}
        repo={repo}
        initialRepoDetails={repoDetails}
        initialContributors={contributors}
      />
    );
  } catch (error) {
    console.error("Error fetching repository data:", error);
    // In case of error, we'll let the client component handle it
    return (
      <RepositoryAnalyzerPage
        owner={owner}
        repo={repo}
        initialRepoDetails={null}
        initialContributors={[]}
      />
    );
  }
}
