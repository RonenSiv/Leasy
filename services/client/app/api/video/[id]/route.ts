import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const response = await fetch(`http://localhost:8000/storage/${params.id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Video not found");
    }

    const videoData = await response.blob();

    return new NextResponse(videoData, {
      headers: {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
}
