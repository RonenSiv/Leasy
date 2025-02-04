// app/api/quiz/questions/[uuid]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const token = cookies().get("LeasyToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const backendRes = await fetch(`${API_URL}/quiz/questions/${params.uuid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch quiz questions" },
      { status: backendRes.status },
    );
  }

  const data = await backendRes.json();
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const token = cookies().get("LeasyToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  try {
    const body = await request.json();
    const backendRes = await fetch(`${API_URL}/quiz/answer/${params.uuid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to submit quiz answers" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 },
    );
  }
}
