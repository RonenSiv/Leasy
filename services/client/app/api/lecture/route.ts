// app/api/lecture/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort_by") || "created_at";
  const sortDirection = searchParams.get("sort_direction") || "desc";

  const token = cookies().get("LeasyToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  // forward to your real backend with these params:
  const backendUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/lecture?` +
    new URLSearchParams({
      page,
      search,
      sort_by: sortBy,
      sort_direction: sortDirection,
    });

  const backendRes = await fetch(backendUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Failed" },
      { status: backendRes.status },
    );
  }
  const data = await backendRes.json();
  return NextResponse.json(data);
}
