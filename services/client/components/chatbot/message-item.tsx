"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ClientImage } from "@/components/client-image";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

interface MessageItemProps {
  message: Message;
  isLoading: boolean;
}

export default function MessageItem({ message, isLoading }: MessageItemProps) {
  return (
    <div
      className={`flex items-start space-x-2 mb-4 ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      {message.role !== "user" && (
        <ClientImage src="/quiz.png" alt="AI Tutor" className="h-8 w-8" />
      )}
      <div
        className={`p-2 rounded-md max-w-small break-words whitespace-pre-wrap ${
          message.role === "user"
            ? "bg-blue-500 text-white"
            : message.role === "error"
              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              : "bg-gray-100 dark:bg-gray-700"
        }`}
        style={{
          wordBreak: "break-word",
        }}
      >
        {message.role === "error" && (
          <AlertTriangle className="inline-block mr-2 h-4 w-4 text-red-500" />
        )}
        {message.content ||
          (isLoading && message.role === "assistant" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null)}
      </div>
    </div>
  );
}
