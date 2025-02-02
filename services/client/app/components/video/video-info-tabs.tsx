"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lecture } from "@/types";

export function VideoInfoTabs({ videoData }: { videoData: Lecture }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="transcription" className="w-full h-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="quizlets">Quizlets</TabsTrigger>
          </TabsList>
          <TabsContent value="transcription">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">
                {videoData?.transcription || "Transcription not available yet."}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="summary">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">
                {videoData?.summary || "Summary not available yet."}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="quizlets">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">Quizlets not available yet.</div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
