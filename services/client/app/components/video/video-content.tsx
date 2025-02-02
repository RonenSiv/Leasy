"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { api } from "@/app/api";
import type { Lecture } from "@/types";

export function VideoContent({ videoData }: { videoData: Lecture }) {
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
      const response = await api.lecture.sendChatMessage(
        videoData.chat.uuid,
        message,
      );
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <Tabs
          defaultValue="transcription"
          className="w-full h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="quizlets">Quizlets</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-hidden">
            <TabsContent value="transcription" className="h-full">
              <ScrollArea className="h-full">
                <div className="p-4 text-sm">
                  {videoData?.transcription ||
                    "Transcription not available yet."}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="summary" className="h-full">
              <ScrollArea className="h-full">
                <div className="p-4 text-sm">
                  {videoData?.summary || "Summary not available yet."}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="quizlets" className="h-full">
              <ScrollArea className="h-full">
                <div className="p-4 text-sm">Quizlets not available yet.</div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="chat" className="h-full flex flex-col">
              <ScrollArea className="flex-grow p-4">
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
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
