import { CommitData, Stats } from "../types/api.types";

export async function fetchCommits(commits: CommitData[]) {
  const commitsList: Stats[] = await Promise.all(
    commits.map((commit) =>
      fetch(commit.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }).then((res) => res.json())
    )
  );

  return {
    additions: commitsList.reduce(
      (acc, commit) => acc + commit.stats.additions,
      0
    ),
    deletions: commitsList.reduce(
      (acc, commit) => acc + commit.stats.deletions,
      0
    ),
  };
}
