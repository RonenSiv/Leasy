import React, { useState } from "react";
import { Card } from "@/app/components/Card";
import { InputCta } from "@/app/components/InputCta";
import { ChatBubble } from "@/app/components/ChatBubble";

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.choices[0].text);
  };

  return (
    <Card stretchVertically stretchHorizontally>
      <div className="flex flex-col justify-between max-h-full h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 px-1">
        <div className={"flex flex-col gap-4"}>
          <ChatBubble
            text={
              "This is a test response from the chatbot. It should be able to handle multiple lines of text and display them in a chat bubble."
            }
          />
          <ChatBubble
            text={
              "This is a user response. It should be able to handle multiple lines of text and display them in a chat bubble."
            }
            from={"user"}
          />
        </div>
        <div
          className={
            "sticky bottom-0 left-0 w-full px-4 pt-4 bg-white dark:bg-gray-800"
          }
        >
          <form onSubmit={handleSubmit}>
            <InputCta />
          </form>
        </div>
      </div>
    </Card>
  );
}
