import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log(`API URL: ${baseUrl}/storage/${params.id}`);
  try {
    const response = await fetch(`${baseUrl}/storage/${params.id}`, {
      credentials: "include",
      next: { revalidate: 0 },
    });
    if (!response.ok) throw new Error("Video not found");
    const videoData = await response.blob();

    return new NextResponse(videoData, {
      headers: {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
}
