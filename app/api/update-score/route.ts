import { sql } from "@/app/(config)/postgres";
import { fetchCommits } from "@/services/fetchContribute";
import { CommitData } from "@/types/api.types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { computeReputationScoring } from "reputation-scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo, commitsData, contributorsData } = body;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("github_session");

    // const contributorsWithStats = await Promise.all(
    //   contributorsData.map(async (contributor: any) => {
    //     // Fetch commit stats for this contributor
    //     const commitsResponse = await fetch(
    //       `/api/github/repos/${owner}/${repo}/commits?author=${contributor.login}&per_page=100`
    //     );

    //     if (!commitsResponse.ok) {
    //       return {
    //         ...contributor,
    //         additions: 0,
    //         deletions: 0,
    //         commits: 0,
    //         impactScore: 0,
    //       };
    //     }

    //     const commitsDataInfo: CommitData[] = await commitsResponse.json();

    //     // Calculate impact score (this is a simplified formula)
    //     // In a real app, you might use a more sophisticated algorithm
    //     const res = await fetch(`/api/score/${repo}`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     const contributionScore = await res.json();

    //     return {
    //       login: contributor.login,
    //       avatar_url: contributor.avatar_url,
    //       contributions: contributor.contributions,
    //       additions: contributionScore.res.additions,
    //       deletions: contributionScore.res.deletions,
    //       commits: commitsDataInfo.length,
    //       impactScore: contributionScore.res.score,
    //     };
    //   })
    // );

    const scoreInfo = await computeReputationScoring({
      owner,
      repo,
      token: sessionCookie?.value,
    });

    const score = scoreInfo.filter(
      (item) => item.user === commitsData[0].author.login
    );

    const { additions, deletions } = await fetchCommits(commitsData);
    console.log({ additions, deletions });

    const res = sql`SELECT * FROM public."Scores" WHERE repository = ${repo} AND owner = ${owner} AND username = ${score[0].user}`;

    if ((await res).length > 0) {
      await sql`UPDATE public."Scores" SET score = ${score[0].score}, additions= ${additions}, deletions = ${deletions} WHERE repository = ${repo} AND username = ${commitsData[0].author.login}`;
    } else {
      await sql`INSERT INTO public."Scores" (repository, owner, username, score, additions, deletions) VALUES (${repo}, ${owner}, ${score[0].user}, ${score[0].score}, ${additions}, ${deletions})`;
    }

    return NextResponse.json({ score, additions, deletions }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
