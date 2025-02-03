import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { route: string[] } },
) {
  const token = cookies().get("LeasyToken")?.value;
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const path = params.route.join("/");

  const res = await fetch(`${apiURL}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: { route: string[] } },
) {
  const token = cookies().get("LeasyToken")?.value;
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const path = params.route.join("/");

  const res = await fetch(`${apiURL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(await req.json()),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: { route: string[] } },
) {
  const token = cookies().get("LeasyToken")?.value;
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const path = params.route.join("/");

  const res = await fetch(`${apiURL}/${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(await req.json()),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
