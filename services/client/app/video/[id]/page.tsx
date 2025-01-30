"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { fakeDb } from "@/lib/fakeDb";
import { Loader2, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/settings-context";

export default function VideoPage({ params }: { params: { id: string } }) {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transcription");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const router = useRouter();
  const { user } = useAuth();
  const { enhancedScreenReader } = useSettings();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const video = fakeDb.getVideoById(params.id);
        if (video) {
          setVideoData(video);
        } else {
          toast.error("Video not found");
          router.push("/browse");
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        toast.error("Error loading video");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchVideo();
    } else {
      setLoading(false);
    }
  }, [user, params.id, router]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "This is a simulated AI response." },
      ]);
    }, 1000);
    setMessage("");
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{videoData.title}</h1>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <video controls className="w-full aspect-video">
                <source src={videoData.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </CardContent>
          </Card>

          {/* Chatbot */}
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] mb-4" ref={chatContainerRef}>
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
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question about the video..."
                  aria-label={
                    enhancedScreenReader
                      ? "Type your question about the video content"
                      : undefined
                  }
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transcription" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="transcription">Transcription</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="quizlet">Quizlet</TabsTrigger>
                </TabsList>
                <TabsContent value="transcription">
                  <ScrollArea className="h-[calc(100vh-24rem)]">
                    <p className="text-sm leading-relaxed">
                      {videoData.transcription ||
                        "Transcription not available yet."}
                    </p>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="summary">
                  <ScrollArea className="h-[calc(100vh-24rem)]">
                    <p className="text-sm leading-relaxed">
                      {videoData.summary || "Summary not available yet."}
                    </p>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="quizlet">
                  <ScrollArea className="h-[calc(100vh-24rem)]">
                    <p className="text-center text-muted-foreground">
                      Quizlet feature coming soon.
                    </p>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
