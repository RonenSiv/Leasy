"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, Send } from "lucide-react";
import { Spinner } from "@/app/components/spinner";
import api from "@/lib/api";
import type { ChatMessage } from "@/types/api-types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface VideoChatProps {
  chatUuid: string;
  showCase?: boolean;
  summary: string;
}

interface ChatMessageWithPending extends ChatMessage {
  pending?: boolean;
}

interface QuickActionCard {
  title: string;
  message: string;
}

export function VideoChat({
  chatUuid,
  showCase = false,
  summary,
}: VideoChatProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [allMessages, setAllMessages] = useState<ChatMessageWithPending[]>([]);
  const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showCaseComplete, setShowCaseComplete] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  const generateQuickActionCards = useCallback((): QuickActionCard[] => {
    const cards: QuickActionCard[] = [
      {
        title: "Key Points 🔍",
        message: "What are the key points of this lecture?",
      },
      {
        title: "Clarify 🤔",
        message: "Can you explain any complex concepts in this lecture?",
      },
      {
        title: "Apply 🔗",
        message: "How can I apply the concepts from this lecture to real life?",
      },
      {
        title: "Explore 📚",
        message:
          "What are some additional resources to learn more about this lecture?",
      },
    ];
    return cards;
  }, []);

  const [quickActionCards] = useState<QuickActionCard[]>(
    generateQuickActionCards(),
  );

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      ) as HTMLElement;
      if (viewport) {
        viewport.scroll({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const handleScroll = useCallback((event: Event) => {
    const viewport = event.target as HTMLElement;
    const isScrolledUp =
      viewport.scrollTop < viewport.scrollHeight - viewport.clientHeight - 100;
    setShowScrollButton(isScrolledUp);
  }, []);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;

    if (viewport) {
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (showCase) {
      setAllMessages([
        {
          uuid: "1",
          sender: "assistant",
          message: "Hi there! 👋 I'm Leasy's assistant. How can I help you? 😊",
        },
      ]);
      setIsChatHistoryLoading(false);
      return;
    }
    const fetchAllMessages = async () => {
      try {
        let page = 1;
        const allData: ChatMessageWithPending[] = [];

        while (true) {
          const response = await api.get(
            `/chat/messages/${chatUuid}?page=${page}`,
          );
          if (!response.data?.data || response.data.data.length === 0) break;
          allData.push(...response.data.data);
          page++;
        }

        const messages = allData.reverse();
        setAllMessages(messages);
        setHasUserSentMessage(messages.some((msg) => msg.sender === "user"));
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsChatHistoryLoading(false);
        scrollToBottom();
      }
    };

    fetchAllMessages();
  }, [chatUuid, showCase, scrollToBottom]);

  useEffect(() => {
    if (allMessages.length > 0) {
      scrollToBottom();
    }
  }, [allMessages, scrollToBottom]);

  const handleSendMessage = async (e: React.FormEvent | string) => {
    if (typeof e !== "string") {
      e?.preventDefault();
    }
    const messageToSend = typeof e === "string" ? e : message;
    if (!messageToSend.trim() || isSending) return;

    setHasUserSentMessage(true);

    if (showCase) {
      setAllMessages((prev) => [
        ...prev,
        {
          uuid: Date.now().toString(),
          sender: "user",
          message: messageToSend,
        },
        {
          uuid: (Date.now() + 1).toString(),
          sender: "assistant",
          message: "",
          pending: true,
        },
      ]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAllMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? {
                ...msg,
                message:
                  "I'm sorry, I'm just a demo bot 😔. I can't help you with that. If you'd like to experience the full functionality, please sign up! 👇",
                pending: false,
              }
            : msg,
        ),
      );
      setMessage("");
      setShowCaseComplete(true);
      return;
    }

    const userMessage: ChatMessageWithPending = {
      uuid: Date.now().toString(),
      sender: "user",
      message: messageToSend,
    };
    const pendingMessage: ChatMessageWithPending = {
      uuid: (Date.now() + 1).toString(),
      sender: "assistant",
      message: "",
      pending: true,
    };

    setAllMessages((prev) => [...prev, userMessage, pendingMessage]);
    setMessage("");
    setIsSending(true);

    try {
      const response = await api.post(`/chat/send-message/${chatUuid}`, {
        message: messageToSend,
      });

      const assistantMessage = response.data?.data;

      setAllMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? {
                uuid: response.data.uuid || msg.uuid,
                sender: "assistant",
                message: assistantMessage || "No response received",
              }
            : msg,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setAllMessages((prev) =>
        prev.map((msg) =>
          msg.pending
            ? {
                ...msg,
                message: "Error retrieving response",
                pending: false,
              }
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
        <div className="flex flex-col h-96 relative">
          <ScrollArea ref={scrollAreaRef} className="flex-1 h-full">
            <div className="p-4 space-y-4">
              {isChatHistoryLoading ? (
                <div className="flex items-center justify-center h-96">
                  <Spinner />
                </div>
              ) : (
                <>
                  {allMessages.map((msg) => (
                    <div
                      key={msg.uuid}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 flex items-center ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <span className="whitespace-pre-wrap">
                          {msg.message || ""}
                        </span>
                        {msg.pending && <Spinner className="ml-2 h-4 w-4" />}
                      </div>
                    </div>
                  ))}

                  {/* Quick Action Cards - Only show if no user messages and after assistant's greeting */}
                  {!hasUserSentMessage && allMessages.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {quickActionCards.map((card, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-4 text-left flex flex-col items-start gap-1 whitespace-normal"
                          onClick={() => handleSendMessage(card.message)}
                        >
                          <div className="font-semibold">{card.title}</div>
                          <div className="text-sm text-muted-foreground break-words">
                            {card.message}
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}

                  {showCase && showCaseComplete && (
                    <div className="flex justify-start">
                      <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="mt-2"
                      >
                        <Link href={"/signup"}>
                          Sign Up to Continue Chatting
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <AnimatePresence>
            {showScrollButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-20 right-4"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full shadow-lg"
                  onClick={scrollToBottom}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 p-4 border-t"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question about the video..."
              disabled={
                isSending ||
                isChatHistoryLoading ||
                (showCase && showCaseComplete)
              }
            />
            <Button
              type="submit"
              size="icon"
              className="bg-primary hover:bg-primary/90"
              disabled={
                isSending ||
                isChatHistoryLoading ||
                (showCase && showCaseComplete)
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
