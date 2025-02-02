"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { api } from "@/app/api";
import { Lecture } from "@/types";
import { Spinner } from "@/app/components/spinner";

type ChatMessage = {
  role: string;
  content: string;
  pending?: boolean; // used to show spinner for assistant
};

export function VideoChat({ videoData }: { videoData: Lecture }) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the chat container whenever messages change.
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Helper: Fetch all pages of chat messages.
  async function fetchAllChatMessages(chatUuid: string) {
    let page = 1;
    const allData: any[] = [];
    while (true) {
      const response = await api.lecture.getChatMessages(chatUuid, page);
      if (!response || !response.data || !response.data.length) break;
      allData.push(...response.data);
      page++;
    }
    return allData;
  }

  // Fetch chat history on mount (all pages) and reverse so oldest is at the top.
  useEffect(() => {
    async function fetchChatHistory() {
      try {
        const allMessages = await fetchAllChatMessages(videoData.chat.uuid);
        if (allMessages) {
          const transformed: ChatMessage[] = allMessages
            .map((msg: any) => ({
              role: msg.sender === "assistant" ? "assistant" : "user",
              content: msg.message,
            }))
            .reverse();
          setChatMessages(transformed);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsChatHistoryLoading(false);
      }
    }

    fetchChatHistory();
  }, [videoData.chat.uuid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || isChatHistoryLoading) return;
    // Append user's message immediately.
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    const userMessage = message;
    setMessage("");

    // Append a pending assistant message placeholder.
    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", pending: true },
    ]);

    setIsSending(true);

    try {
      const response = await api.lecture.sendChatMessage(
        videoData.chat.uuid,
        userMessage,
      );

      let assistantMessage = "";
      if (
        response &&
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Use the last element as the assistant's reply.
        assistantMessage = response.data[response.data.length - 1].message;
      } else if (response?.data) {
        assistantMessage = response.data;
      }

      // Replace the pending assistant message with the actual response.
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.pending ? { role: "assistant", content: assistantMessage } : msg,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Replace pending message with an error message.
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? { role: "assistant", content: "Error retrieving response" }
            : msg,
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-0 flex-1">
        <div className="flex flex-col h-[400px]">
          {/* Chat messages scrollable container */}
          <div className="flex-1 overflow-y-auto p-4" ref={scrollContainerRef}>
            {isChatHistoryLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, i) => {
                  const isPending = !!msg.pending;
                  return (
                    <div
                      key={i}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 flex items-center ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.content || (isPending ? "" : "")}
                        {isPending && <Spinner className={`h-4 w-4`} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Send message form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question about the video..."
              disabled={isSending || isChatHistoryLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSending || isChatHistoryLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
