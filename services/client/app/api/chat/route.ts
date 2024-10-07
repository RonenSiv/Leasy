import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, knowledge, aiPersona } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "Hello!";
    const systemMessage = {
      role: "system",
      content: `You are Leasy AI Tutor. ${
        aiPersona ? `Act as: ${aiPersona}` : ""
      } ${knowledge ? `Knowledge Base: ${knowledge}` : ""}`,
    };

    const encoder = new TextEncoder();
    let stream: ReadableStream;

    if (!process.env.OPENAI_API_KEY || process.env.NODE_ENV === "development") {
      // Mock streaming response
      const mockResponseMessage = `Mock response to: "${lastUserMessage}"`;

      stream = new ReadableStream({
        async start(controller) {
          // Simulate a delay before starting to send the response
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay

          for (let i = 0; i < mockResponseMessage.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 20));
            controller.enqueue(encoder.encode(mockResponseMessage[i]));
          }
          controller.close();
        },
      });
    } else {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages],
        stream: true,
      });

      stream = new ReadableStream({
        async start(controller) {
          for await (const part of response) {
            const text = part.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        },
      });
    }

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
