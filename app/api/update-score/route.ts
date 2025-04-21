import { sql } from "@/app/(config)/postgres";
import { fetchCommits } from "@/services/fetchContribute";
import { CommitData } from "@/types/api.types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { computeReputationScoring } from "reputation-scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo, commitsData, contributor } = body;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("github_session");
    let commitsDataInfo: CommitData[] = [];

    // Fetch commit stats for this contributor
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?author=${contributor.login}&per_page=100`,
      {
        headers: {
          Authorization: `token ${sessionCookie?.value}`,
        },
      }
    );

    if (!commitsResponse.ok) {
      commitsDataInfo = [];
    } else commitsDataInfo = await commitsResponse.json();

    const scoreInfo = await computeReputationScoring({
      owner,
      repo,
      token: sessionCookie?.value,
    });

    const score = scoreInfo.filter((item) => item.user === contributor.login);

    const { additions, deletions } = await fetchCommits(commitsData);

    const res = sql`SELECT * FROM public."Scores" WHERE repository = ${repo} AND owner = ${owner} AND username = ${score[0].user}`;

    if ((await res).length > 0) {
      await sql`UPDATE public."Scores" SET score = ${score[0].score}, additions= ${additions}, deletions = ${deletions}, commits = ${commitsDataInfo.length} WHERE repository = ${repo} AND username = ${contributor.login}`;
    } else {
      await sql`INSERT INTO public."Scores" (repository, owner, username, score, additions, deletions, commits) VALUES (${repo}, ${owner}, ${score[0].user}, ${score[0].score}, ${additions}, ${deletions}, ${commitsDataInfo.length})`;
    }

    return NextResponse.json(
      { score, additions, deletions, commitsDataInfo: commitsDataInfo.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
