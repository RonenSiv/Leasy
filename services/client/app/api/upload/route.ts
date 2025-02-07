// pages/api/video/[uuid].ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { uuid: string } },
) {
  const token = cookies().get("LeasyToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const videoUuid = params.uuid;
  const range = req.headers.get("range");

  try {
    // Forward the request to your Laravel backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/video/${videoUuid}`;
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    // If range header exists, forward it
    if (range) {
      headers["Range"] = range;
    }

    const response = await fetch(backendUrl, {
      headers,
    });

    // Forward the response headers and status
    const newHeaders = new Headers();
    response.headers.forEach((value, key) => {
      newHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (error) {
    console.error("Error streaming video:", error);
    return NextResponse.json(
      { error: "Error streaming video" },
      { status: 500 },
    );
  }
}
