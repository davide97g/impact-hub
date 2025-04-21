import { sql } from "@/app/(config)/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ repo: string; user: string }> }
) {
  try {
    const { repo, user } = await params; // 📌 Ora l'ID è corretto

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
