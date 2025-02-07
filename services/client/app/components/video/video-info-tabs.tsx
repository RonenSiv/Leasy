"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quizlet } from "@/app/components/quizlet/quizlet";
import { TreeMindMap } from "@/app/components/mind-map/mind-map";
import { MarkDownViewer } from "@/app/components/mark-down-viewer";
import useSWR from "swr";
import { Spinner } from "@/app/components/spinner";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function VideoInfoTabs({ videoData }: { videoData: any }) {
  const {
    data: quizData,
    error,
    isLoading,
  } = useSWR(`/quiz/${videoData.quiz.uuid}`, fetcher);

  return (
    <Tabs defaultValue="transcription" className="h-full">
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
        <ScrollArea className="h-full p-4">
          <MarkDownViewer>{videoData.summary}</MarkDownViewer>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="mind-map" className="h-[calc(100%-3rem)]">
        <ScrollArea className="h-full p-4">
          <TreeMindMap data={videoData.mind_map} />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="quizlets" className="h-[calc(100%-3rem)]">
        <ScrollArea className="h-full p-4">
          {isLoading ? (
            <Spinner />
          ) : error ? (
            "Error loading quiz"
          ) : (
            <Quizlet questions={quizData?.questions || []} />
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
