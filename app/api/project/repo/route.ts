import { sql } from "@/app/(config)/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { repo_name, id, owner } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing project id parameter" },
        { status: 400 }
      );
    }

    if (!repo_name) {
      return NextResponse.json(
        { error: "Missing repo_name parameter" },
        { status: 400 }
      );
    }

    const res =
      await sql`UPDATE public."Projects" SET repo_name = ${repo_name}, owner = ${owner} WHERE id = ${id}  RETURNING *`;
    return NextResponse.json({ res }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
