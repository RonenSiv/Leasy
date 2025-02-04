import { NextResponse } from "next/server";
import { getUser } from "@/app/actions/server-actions";

export async function GET() {
  try {
    const user = await getUser();
    console.log("User", user);
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
}
