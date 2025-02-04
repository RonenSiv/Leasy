"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { LectureResource } from "@/types";
import { Spinner } from "@/app/components/spinner";
import { getChatMessages, sendChatMessage } from "@/app/actions/server-actions";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ChatMessage = {
  role: string;
  content: string;
  pending?: boolean;
};

interface VideoChatProps {
  videoData: LectureResource;
  initialMessages?: ChatMessage[];
  isShowcase?: boolean;
}

export function VideoChat({
  videoData,
  initialMessages = [],
  isShowcase = false,
}: VideoChatProps) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(
    initialMessages.length === 0,
  );
  const [isSending, setIsSending] = useState(false);
  // Flag to mark that the conversation is complete (after the first exchange in showcase mode)
  const [conversationCompleted, setConversationCompleted] = useState(false);

  // Attach the ref to the ScrollArea (its root)
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-viewport]",
      ) as HTMLElement;
      if (viewport) {
        viewport.scroll({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  // Auto-scroll whenever chatMessages change.
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (initialMessages.length === 0 && !isShowcase) {
      const fetchChatHistory = async () => {
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
      };

      fetchChatHistory();
    }
  }, [videoData.chat.uuid, initialMessages, isShowcase]);

  async function fetchAllChatMessages(chatUuid: string) {
    let page = 1;
    const allData: any[] = [];
    while (true) {
      const response = await getChatMessages(chatUuid, page);
      if (!response || !response.data || !response.data.length) break;
      allData.push(...response.data);
      page++;
    }
    return allData;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !message.trim() ||
      isSending ||
      isChatHistoryLoading ||
      conversationCompleted
    )
      return;
    // Add user's message
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    const userMessage = message;
    setMessage("");

    // Add a pending assistant message
    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", pending: true },
    ]);
    setIsSending(true);

    if (isShowcase) {
      // Simulate a delay for the showcase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setChatMessages((prev) =>
        prev.map((msg) => {
          if (msg.pending) {
            return {
              role: "assistant",
              content:
                "I'm sorry, I'm just a demo assistant. You can sign up to chat with a real assistant! 😊",
            };
          }
          return msg;
        }),
      );
      setIsSending(false);
      // Mark conversation as complete, disabling further message sending
      setConversationCompleted(true);
    } else {
      try {
        const response = await sendChatMessage(
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
          assistantMessage = response.data[response.data.length - 1].message;
        } else if (response?.data) {
          assistantMessage = response.data;
        }
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.pending
              ? { role: "assistant", content: assistantMessage }
              : msg,
          ),
        );
      } catch (error) {
        console.error("Error sending message:", error);
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
    }
  };

  return (
    <Card>
      <CardContent className="p-0 flex-1">
        <div className="flex flex-col h-[400px]">
          <ScrollArea ref={scrollAreaRef} className="flex-1 h-full">
            <div className="p-4">
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
                          {msg.content}
                          {isPending && <Spinner className="h-4 w-4 ml-2" />}
                        </div>
                      </div>
                    );
                  })}
                  {conversationCompleted && (
                    // Add an extra bubble on the user side that is styled as a distinct button.
                    <div className="flex justify-start">
                      <Button
                        variant="default"
                        onClick={() => (window.location.href = "/signup")}
                        className="rounded-lg px-4 py-2"
                      >
                        Sign Up Now
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question about the video..."
              disabled={
                isSending || isChatHistoryLoading || conversationCompleted
              }
            />
            <Button
              type="submit"
              size="icon"
              disabled={
                isSending || isChatHistoryLoading || conversationCompleted
              }
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
