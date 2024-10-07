"use client";

import React from "react";
import MessageItem from "@/components/chatbot/message-item";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <>
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} isLoading={isLoading} />
      ))}
    </>
  );
}
