import { sql } from "@/app/(config)/postgres";
import { fetchCommits } from "@/services/fetchContribute";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { computeReputationScoring } from "reputation-scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo, commitsData } = body;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("github_session");

    const score = await computeReputationScoring({
      owner,
      repo,
      token: sessionCookie?.value,
    });
    console.log({ user: score[0].user, score: score[0].score, repo, owner });

    const { additions, deletions } = await fetchCommits(commitsData);
    console.log({ additions, deletions });

    const res = sql`SELECT * FROM public."Scores" WHERE repository = ${repo} AND owner = ${owner}`;

    if ((await res).length > 0) {
      await sql`UPDATE public."Scores" SET score = ${score[0].score}, additions= ${additions}, deletions = ${deletions} WHERE repository = ${repo} AND username = ${owner}`;
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
