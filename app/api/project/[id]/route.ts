import { sql } from "@/app/(config)/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing project ID parameter" },
        { status: 400 }
      );
    }

    const res = await sql`SELECT * FROM public."Projects" WHERE id = ${id} `;

    return NextResponse.json(res[0], { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
