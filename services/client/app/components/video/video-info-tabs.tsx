"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quizlet } from "@/app/components/quizlet/quizlet";
import { TreeMindMap } from "@/app/components/mind-map/mind-map";
import { MarkDownViewer } from "@/app/components/mark-down-viewer";
import { Spinner } from "@/app/components/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizQuestions } from "@/hooks/use-quiz";
import { useState } from "react";
import { LinkifiedWikiContent } from "@/app/components/wiki/linkified-wiki-content";

interface VideoData {
  uuid: string;
  transcription: string;
  summary: string;
  mind_map: any; // Replace 'any' with the correct type for mind_map
  quiz: {
    uuid: string;
  };
}

interface VideoInfoTabsProps {
  videoData: VideoData;
}

export function VideoInfoTabs({ videoData }: VideoInfoTabsProps) {
  const {
    questions,
    isError,
    isLoading: isQuizLoading,
    mutate,
  } = useQuizQuestions(videoData.quiz.uuid);
  const [activeTab, setActiveTab] = useState<string>("transcription");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full h-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="mind-map">Mind Map</TabsTrigger>
            <TabsTrigger value="quizlets">Quizlets</TabsTrigger>
          </TabsList>

          <TabsContent value="transcription" className="h-[calc(100%-3rem)]">
            <ScrollArea className="h-full p-4">
              <MarkDownViewer>{videoData.transcription}</MarkDownViewer>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="summary" className="h-[calc(100%-3rem)]">
            <ScrollArea className="h-full">
              <div className="p-4">
                <LinkifiedWikiContent
                  summary={videoData.summary}
                  lectureId={videoData.uuid}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="mind-map" className="h-[calc(100%-3rem)]">
            <ScrollArea className="h-full p-4">
              <TreeMindMap data={videoData.mind_map} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="quizlets" className="h-[calc(100%-3rem)]">
            <ScrollArea className="h-full p-4">
              {isQuizLoading ? (
                <Spinner />
              ) : isError ? (
                <p className="text-red-500 dark:text-red-400">
                  Error loading quiz
                </p>
              ) : (
                <Quizlet
                  quizId={videoData.quiz.uuid}
                  questions={questions || []}
                  summary={videoData.summary}
                  onNewQuestions={mutate}
                />
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
