"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown } from "lucide-react";
import { AIKnowledge, AIPersona } from "@/constants/content";
import MessageList from "@/components/chatbot/message-list";
import Suggestions from "@/components/chatbot/suggestions";
import FileUpload from "@/components/chatbot/file-upload";
import SettingsDialog from "@/components/chatbot/settings-dialog";
import InputForm from "@/components/chatbot/input-form";
import { Spinner } from "@/components/ui/spinner";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

interface UploadedFile {
  name: string;
  content: string;
}

const fetchChatResponse = async (
  messages: Message[],
  knowledge: string,
  aiPersona: string,
) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, knowledge, aiPersona }),
  });

  if (!response.ok) throw new Error(response.statusText);

  return response.body;
};

export default function ChatInterface() {
  const initialAssistantMessage = `Hi there! 👋 I'm your learning assistant from Leasy.
I'm here to help you with your studies. Let's make learning fun and easy together! How can I assist you?`;

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: initialAssistantMessage },
  ]);
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [knowledge, setKnowledge] = useState(AIKnowledge);
  const [aiPersona, setAiPersona] = useState(AIPersona);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsChanged, setIsSettingsChanged] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
  });

  const chatMutation = useMutation({
    mutationFn: (newMessage: Message) =>
      fetchChatResponse([...messages, newMessage], knowledge, aiPersona),
    onMutate: (newMessage) => {
      setMessages((prev) => [
        ...prev,
        newMessage,
        { role: "assistant", content: "" },
      ]);
    },
    onSuccess: async (stream) => {
      if (!stream) return;

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedResponse += chunkValue;

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: accumulatedResponse },
            ];
          }
          return prev;
        });
      }
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    },
    onSuccess: (data, file) => {
      setUploadedFiles((prev) => [
        ...prev,
        { name: file.name, content: data.content },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Sorry, there was an error uploading the file.",
        },
      ]);
    },
  });

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!inView) {
      scrollToBottom();
    }
  }, [messages, inView, scrollToBottom]);

  useEffect(() => {
    const savedKnowledge = localStorage.getItem("aiKnowledge");
    const savedPersona = localStorage.getItem("aiPersona");
    if (savedKnowledge) setKnowledge(savedKnowledge);
    if (savedPersona) setAiPersona(savedPersona);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("aiKnowledge", knowledge);
    localStorage.setItem("aiPersona", aiPersona);
    setIsSettingsChanged(false);
    setIsDialogOpen(false);
  };

  const resetSettings = () => {
    setKnowledge(AIKnowledge);
    setAiPersona(AIPersona);
    setIsSettingsChanged(true);
  };

  const handleSubmit = async (
    e: React.FormEvent | null,
    messageContent?: string,
  ) => {
    if (e) e.preventDefault();
    const content = messageContent || input;
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    setInput("");
    chatMutation.mutate(userMessage);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    uploadFileMutation.mutate(file);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (queryClient.isFetching()) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-full relative">
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <MessageList
          messages={messages}
          isLoading={chatMutation.isPending}
          aria-live="polite"
        />
        {messages.length === 1 && <Suggestions onSuggest={handleSubmit} />}
        <div ref={bottomRef} />
        <div ref={inViewRef} style={{ height: 1 }} />
      </ScrollArea>

      {uploadedFiles.length > 0 && (
        <FileUpload
          uploadedFiles={uploadedFiles}
          removeFile={removeUploadedFile}
        />
      )}

      <div className="relative p-4">
        <InputForm
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={chatMutation.isPending}
          isUploading={uploadFileMutation.isPending}
          handleFileUpload={handleFileUpload}
        />
        <AnimatePresence>
          {!inView && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 right-4"
            >
              <Button
                onClick={scrollToBottom}
                variant="secondary"
                size="icon"
                className="rounded-full p-2 shadow-lg"
                aria-label="Scroll to bottom"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
