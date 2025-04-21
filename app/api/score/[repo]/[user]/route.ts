import { sql } from "@/app/(config)/postgres";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(
  req: NextApiRequest,
  { params }: { params: Promise<{ repo: string; user: string }> }
) {
  try {
    const { repo, user } = await params; // 📌 Ora l'ID è corretto
    console.log({ repo, user });

    if (!repo) {
      return NextResponse.json(
        { error: "Missing repo ID parameter" },
        { status: 400 }
      );
    }

    const res =
      await sql`SELECT * FROM public."Scores" WHERE repository = ${repo} AND username = ${user}`;

    return NextResponse.json({ res: res }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
