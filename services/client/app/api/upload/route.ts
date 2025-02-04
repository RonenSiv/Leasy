import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const token = cookies().get("LeasyToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const newFormData = new FormData();
    // @ts-ignore
    for (const [key, value] of formData.entries()) {
      newFormData.append(key, value);
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lecture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newFormData,
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error in /api/upload route:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
