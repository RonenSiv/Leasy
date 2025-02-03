import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // 1) Check if we have an HttpOnly cookie
  const token = cookies().get("LeasyToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // 2) Parse the entire form data from 'req'. This buffers it into memory.
    const formData = await req.formData();

    // 3) Create a new FormData to forward to your backend
    const newFormData = new FormData();
    // @ts-ignore
    for (const [key, value] of formData.entries()) {
      // If 'value' is a Blob/File, this will preserve it as a file
      newFormData.append(key, value);
    }

    // 4) POST to your real backend, e.g. "http://localhost:8000/api/lecture"
    //    or from an env variable: process.env.NEXT_PUBLIC_API_URL
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lecture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set "Content-Type", fetch will do it automatically w/ boundary
        },
        body: newFormData,
        // no "duplex" needed because we're not streaming directly from req.body
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: backendRes.status },
      );
    }

    // 5) Return the backend's JSON to the client
    const data = await backendRes.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error in /api/upload route:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
