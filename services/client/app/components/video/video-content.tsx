"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { api } from "@/app/api";

interface VideoContentProps {
  videoData: {
    id: string;
    title: string;
    description: string;
    transcription?: string;
    summary?: string;
  };
}

export function VideoContent({ videoData }: VideoContentProps) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");

    try {
      const response = await api.lecture.sendChatMessage(videoData.id, message);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="transcription" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="transcription">
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <p className="text-sm leading-relaxed p-4">
                {videoData.transcription || "Transcription not available yet."}
              </p>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="summary">
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <p className="text-sm leading-relaxed p-4">
                {videoData.summary || "Summary not available yet."}
              </p>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="chat">
            <div className="h-[calc(100vh-24rem)] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question about the video..."
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
