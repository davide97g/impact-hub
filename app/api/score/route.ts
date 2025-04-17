// /app/api/score/route.ts
import { sql } from "@/app/(config)/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await sql`SELECT * FROM public."Score"`;
    return NextResponse.json(res);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
