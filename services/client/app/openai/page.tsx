"use server";

const apiKey = process.env.OPENAI_API_KEY;
export default async function OpenAIChat() {
  const completion = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Whats the meaning of life?",
              },
            ],
          },
        ],
      }),
    },
  );

  const data = await completion.json();
  console.log("DATA", data.choices[0].message);
  return (
    <div>
      <h1>OpenAI Chat</h1>
      <p>{data.choices[0].message.content}</p>
    </div>
  );
}
