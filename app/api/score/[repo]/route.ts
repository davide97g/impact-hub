import { sql } from "@/app/(config)/postgres";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ repo: string }> }
) {
  try {
    const { repo } = await params; // 📌 Ora l'ID è corretto
    if (!repo) {
      return NextResponse.json(
        { error: "Missing pokemon ID parameter" },
        { status: 400 }
      );
    }

    const res =
      await sql`SELECT * FROM public."Scores" WHERE repository = ${repo}`;

    return NextResponse.json({ res: res[0] }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
