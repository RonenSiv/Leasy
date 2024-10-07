import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  let content;

  if (process.env.NODE_ENV === "development") {
    // Mock behavior in development mode
    content = `Mock content for file: ${file.name}`;
  } else {
    // Production behavior: process the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join("/tmp", file.name);
    await writeFile(path, buffer);

    // Here you would typically process the file and extract its content
    // For this example, we'll just return the file name as content
    content = `Uploaded file: ${file.name}`;
  }

  return NextResponse.json({ content });
}
