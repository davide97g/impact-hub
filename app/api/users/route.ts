import { sql } from "@/app/(config)/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, name } = body;

    if (!user) {
      return NextResponse.json(
        { error: "Missing user name parameter" },
        { status: 400 }
      );
    }

    const res = await sql`SELECT * FROM public."Users" WHERE id = ${user}`;

    if (res.length === 0) {
      const userCreation =
        await sql`INSERT INTO public."Users" (id,name) VALUES (${user},${name}) RETURNING *`;
      return NextResponse.json({ userCreation }, { status: 200 });
    }

    return NextResponse.json(res[0], { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
