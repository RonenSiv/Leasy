import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function PUT(req: Request) {
  const token = cookies().get("LeasyToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }
  try {
    const { lectureId, isFavorite } = await req.json();
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lecture/favorite/${lectureId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite: isFavorite }),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to toggle favorite" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    revalidateTag(`lecture-${lectureId}`);
    revalidateTag("lectures");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error in /api/lectures/favorite route:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
