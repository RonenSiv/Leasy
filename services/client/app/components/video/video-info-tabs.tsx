"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quizlet } from "@/app/components/quizlet/quizlet";
import { TreeMindMap } from "@/app/components/mind-map/mind-map";
import { Spinner } from "@/app/components/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizQuestions } from "@/hooks/use-quiz";
import { useEffect, useRef, useState } from "react";
import { LinkifiedWikiContent } from "@/app/components/wiki/linkified-wiki-content";
import { cn } from "@/lib/utils";

interface VideoData {
  uuid: string;
  transcription: string | Array<{ start: string; end: string; text: string }>;
  summary: string;
  mind_map: any;
  quiz: {
    uuid: string;
  };
}

interface VideoInfoTabsProps {
  videoData: VideoData;
  currentTime?: number;
  onSeekTo?: (time: number) => void;
}

export function VideoInfoTabs({
  videoData,
  currentTime,
  onSeekTo,
}: VideoInfoTabsProps) {
  const {
    questions,
    isError,
    isLoading: isQuizLoading,
    mutate,
  } = useQuizQuestions(videoData.quiz.uuid);
  const [activeTab, setActiveTab] = useState<string>("transcription");
  const [parsedTranscription, setParsedTranscription] = useState<
    Array<{
      start: string;
      end: string;
      text: string;
    }>
  >([]);
  const activeSegmentRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastActiveSegmentIndex = useRef<number | null>(null);

  useEffect(() => {
    try {
      // Handle both cases: when transcription is already an object or when it's a JSON string
      if (typeof videoData.transcription === "string") {
        const parsed = JSON.parse(videoData.transcription);
        setParsedTranscription(parsed);
      } else if (Array.isArray(videoData.transcription)) {
        setParsedTranscription(videoData.transcription);
      }
    } catch (error) {
      console.error("Failed to parse transcription:", error);
      setParsedTranscription([]);
    }
  }, [videoData.transcription]);

  // Scroll to active segment
  useEffect(() => {
    if (activeSegmentRef.current && activeTab === "transcription") {
      // Get the viewport element inside the ScrollArea
      const viewport = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      ) as HTMLElement;

      if (viewport) {
        // Find the current active segment index
        const currentIndex = parsedTranscription.findIndex((segment) =>
          currentTime
            ? isTimeInSegment(currentTime, segment.start, segment.end)
            : false,
        );

        // Only scroll if we have a new active segment
        if (
          currentIndex !== -1 &&
          currentIndex !== lastActiveSegmentIndex.current
        ) {
          // Calculate the center position
          const offsetTop = activeSegmentRef.current.offsetTop;
          const centerPosition =
            offsetTop -
            viewport.clientHeight / 2 +
            activeSegmentRef.current.clientHeight / 2;

          // Always scroll to center the active line
          viewport.scroll({
            top: centerPosition,
            behavior: "smooth",
          });

          // Update the last active segment index
          lastActiveSegmentIndex.current = currentIndex;
        }
      }
    }
  }, [activeTab, currentTime, parsedTranscription]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const isTimeInSegment = (currentTime: number, start: string, end: string) => {
    const startSeconds = timeToSeconds(start);
    const endSeconds = timeToSeconds(end);
    return currentTime >= startSeconds && currentTime <= endSeconds;
  };

  const timeToSeconds = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":").map((part) => {
      if (part.includes(",")) {
        return Number.parseFloat(part.replace(",", "."));
      }
      return Number.parseInt(part, 10);
    });
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (timeString: string) => {
    // Convert "00:00:00,000" to "00:00:00"
    const parts = timeString.split(",")[0].split(":");
    return parts.join(":");
  };

  const handleSegmentClick = (startTime: string) => {
    if (onSeekTo) {
      const seconds = timeToSeconds(startTime);
      onSeekTo(seconds);
    }
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
            <ScrollArea ref={scrollAreaRef} className="h-full p-4">
              <div className="space-y-4">
                {parsedTranscription.map((segment, index) => {
                  const isActive = currentTime
                    ? isTimeInSegment(currentTime, segment.start, segment.end)
                    : false;

                  return (
                    <div
                      key={index}
                      ref={isActive ? activeSegmentRef : null}
                      className={cn(
                        "p-2 rounded transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary/20 font-medium"
                          : "hover:bg-muted",
                      )}
                      onClick={() => handleSegmentClick(segment.start)}
                    >
                      <div className="text-xs text-muted-foreground">
                        {formatTime(segment.start)} - {formatTime(segment.end)}
                      </div>
                      <p>{segment.text}</p>
                    </div>
                  );
                })}
              </div>
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
