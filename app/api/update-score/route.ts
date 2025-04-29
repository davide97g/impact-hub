import { sql } from "@/app/(config)/postgres";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { computeReputationScoring } from "reputation-scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo, contributor } = body;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("github_session");

    const scoreInfo = await computeReputationScoring({
      owner,
      repo,
      token: sessionCookie?.value,
    });

    const score = scoreInfo.userScores.filter(
      (item) => item.user === contributor.login
    );

    const res = sql`SELECT * FROM public."Scores" WHERE repository = ${repo} AND owner = ${owner} AND username = ${score[0].user}`;

    if ((await res).length > 0) {
      await sql`UPDATE public."Scores" SET score = ${score[0].score}, additions= ${score[0].additions}, deletions = ${score[0].deletions}, commits = ${score[0].commit} WHERE repository = ${repo} AND username = ${contributor.login}`;
    } else {
      await sql`INSERT INTO public."Scores" (repository, owner, username, score, additions, deletions, commits) VALUES (${repo}, ${owner}, ${score[0].user}, ${score[0].score}, ${score[0].additions}, ${score[0].deletions}, ${score[0].commit})`;
    }

    return NextResponse.json(
      {
        score,
        additions: score[0].additions,
        deletions: score[0].deletions,
        commitsDataInfo: score[0].commit,
      },
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
