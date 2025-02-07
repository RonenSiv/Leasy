"use client";

import useSWR, { useSWRConfig } from "swr";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";

interface VideoChatProps {
  chatUuid: string;
}

export function VideoChat({ chatUuid }: VideoChatProps) {
  const { mutate } = useSWRConfig();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], mutate: mutateMessages } = useSWR(
    `/chat/${chatUuid}/messages`,
    (url) => api.get(url).then((res) => res.data.messages),
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await api.post(`/chat/${chatUuid}`, { message });
      setMessage("");
      mutateMessages();
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="h-[400px] flex flex-col border rounded-lg overflow-hidden">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.map((msg: any) => (
          <div
            key={msg.uuid}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-white" : "bg-muted"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSend} className="flex gap-2 p-4 border-t">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question..."
          disabled={isSending}
        />
        <Button type="submit" size="icon" disabled={isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
