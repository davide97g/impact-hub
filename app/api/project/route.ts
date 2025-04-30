import { sql } from "@/app/(config)/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing user name parameter" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const res =
      await sql`INSERT INTO public."Projects" (user_id,name) VALUES (${userId},${name}) RETURNING *`;
    return NextResponse.json({ res }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
