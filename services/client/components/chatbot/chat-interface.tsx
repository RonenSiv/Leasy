// components/chatbot/chat-interface.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown } from "lucide-react";
import { AIKnowledge, AIPersona } from "@/constants/content";

import MessageList from "@/components/chatbot/message-list";
import Suggestions from "@/components/chatbot/suggestions";
import FileUpload from "@/components/chatbot/file-upload";
import SettingsDialog from "@/components/chatbot/settings-dialog";
import InputForm from "@/components/chatbot/input-form";
import ChatSkeleton from "@/components/chatbot/chat-skeleton";
import { debounce } from "lodash";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

interface UploadedFile {
  name: string;
  content: string;
}

export default function ChatInterface() {
  const initialAssistantMessage = `Hi there! 👋 I'm your learning assistant from Leasy.
I'm here to help you with your studies. Let’s make learning fun and easy together! How can I assist you?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialAssistantMessage,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [knowledge, setKnowledge] = useState(AIKnowledge);
  const [aiPersona, setAiPersona] = useState(AIPersona);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsChanged, setIsSettingsChanged] = useState(false);
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true); // Tracks if user is at bottom

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);

  const mounted = useRef(false);

  // Track component mount status
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedKnowledge = localStorage.getItem("aiKnowledge");
    const savedPersona = localStorage.getItem("aiPersona");
    if (savedKnowledge) setKnowledge(savedKnowledge);
    if (savedPersona) setAiPersona(savedPersona);
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("aiKnowledge", knowledge);
    localStorage.setItem("aiPersona", aiPersona);
    setIsSettingsChanged(false);
    setIsDialogOpen(false);
  };

  // Reset settings to default
  const resetSettings = () => {
    setKnowledge(AIKnowledge);
    setAiPersona(AIPersona);
    setIsSettingsChanged(true);
  };

  // Scroll handler to determine if user is at bottom
  const handleScroll = useCallback(() => {
    if (isAutoScrollingRef.current || !viewportRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isUserAtBottom = distanceFromBottom < 50; // 50px threshold

    setIsAtBottom(isUserAtBottom);
    setShowScrollDownButton(!isUserAtBottom);
  }, []);

  // Debounced version of handleScroll to optimize performance
  const debouncedHandleScroll = useCallback(debounce(handleScroll, 100), [
    handleScroll,
  ]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current && viewportRef.current) {
      isAutoScrollingRef.current = true;
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500); // Duration matches the smooth scroll behavior
    }
  }, []);

  // Assign viewportRef and attach debounced scroll listener
  useEffect(() => {
    if (scrollAreaRef.current && !viewportRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      ) as HTMLDivElement | null;

      if (viewport) {
        viewportRef.current = viewport;
        viewportRef.current.addEventListener("scroll", debouncedHandleScroll);
        handleScroll(); // Initialize scroll state
      }
    }
  }, [scrollAreaRef, debouncedHandleScroll, handleScroll]);

  // Clean up scroll event listener on unmount
  useEffect(() => {
    return () => {
      if (viewportRef.current) {
        viewportRef.current.removeEventListener(
          "scroll",
          debouncedHandleScroll,
        );
      }
      debouncedHandleScroll.cancel();
    };
  }, [debouncedHandleScroll]);

  // Auto-scroll to bottom when new messages arrive if user is at bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // Handle message submission
  const handleSubmit = async (
    e: React.FormEvent | null,
    messageContent?: string,
  ) => {
    if (e) e.preventDefault();
    const content = messageContent || input;
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    const assistantPlaceholder: Message = { role: "assistant", content: "" };

    // Append user message and assistant placeholder in a single state update
    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setInput("");
    setIsLoading(true);

    const combinedKnowledge =
      knowledge + "\n" + uploadedFiles.map((file) => file.content).join("\n");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage], // Use previous messages without placeholder
          knowledge: combinedKnowledge,
          aiPersona,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      setUploadedFiles([]);

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + chunk },
              ];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file uploads
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, content: data.content },
      ]);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Sorry, there was an error uploading the file.",
        },
      ]);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove an uploaded file
  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Render skeleton if not mounted
  if (!mounted.current) return <ChatSkeleton />;

  return (
    <div className="flex flex-col h-full relative">
      {/* ScrollArea occupies the main chat area */}
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          aria-live="polite"
        />
        {messages.length === 1 && <Suggestions onSuggest={handleSubmit} />}
        {/* Dummy div for auto-scrolling */}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
        <FileUpload
          uploadedFiles={uploadedFiles}
          removeFile={removeUploadedFile}
        />
      )}

      {/* Input Form Section with Scroll-Down Button */}
      <div className="relative p-4">
        <InputForm
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isUploading={isUploading}
          handleFileUpload={handleFileUpload}
        />
        {showScrollDownButton && (
          <Button
            className="absolute bottom-full mb-2 right-4 rounded-full p-2 shadow-lg z-10"
            onClick={scrollToBottom}
            variant="secondary"
            size="icon"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Settings Dialog Section */}
      <div className="mt-2 text-center">
        <SettingsDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          knowledge={knowledge}
          setKnowledge={setKnowledge}
          aiPersona={aiPersona}
          setAiPersona={setAiPersona}
          isSettingsChanged={isSettingsChanged}
          setIsSettingsChanged={setIsSettingsChanged}
          saveSettings={saveSettings}
          resetSettings={resetSettings}
        />
      </div>
    </div>
  );
}
