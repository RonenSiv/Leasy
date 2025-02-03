"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quizlet } from "@/app/components/quizlet/quizlet";
import { Lecture } from "@/types";

interface VideoInfoTabsProps {
  videoData: Lecture;
  // Optional fixed height (e.g., "600px") that will be applied as both min and max height.
  height?: string;
}

export function VideoInfoTabs({ videoData, height }: VideoInfoTabsProps) {
  // If a height is provided, apply it as inline style.
  const containerStyle = height
    ? { minHeight: height, maxHeight: height }
    : undefined;

  return (
    <Card style={containerStyle} className="h-full">
      <CardContent style={containerStyle} className="p-0 h-full">
        <Tabs defaultValue="transcription" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="quizlets">Quizlets</TabsTrigger>
          </TabsList>
          <TabsContent value="transcription" className="h-full pb-5">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">
                {videoData?.transcription || "Transcription not available yet."}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="summary" className="h-full pb-5">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">
                {videoData?.summary || "Summary not available yet."}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="quizlets" className="h-full pb-5">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">
                <Quizlet
                  questions={[
                    {
                      id: "1",
                      question: "test",
                      options: ["test1", "test2", "test3", "test4"],
                      correctAnswer: "test1",
                    },
                    {
                      id: "2",
                      question: "test2",
                      options: ["test1", "test2", "test3", "test4"],
                      correctAnswer: "test2",
                    },
                    {
                      id: "3",
                      question: "test3",
                      options: ["test1", "test2", "test3", "test4"],
                      correctAnswer: "test2",
                    },
                  ]}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

VideoInfoTabs.displayName = "VideoInfoTabs";
