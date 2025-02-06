"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quizlet } from "@/app/components/quizlet/quizlet";
import { LectureResource } from "@/types";
import useSWR from "swr";
import { Spinner } from "@/app/components/spinner";
import { TreeMindMap } from "@/app/components/mind-map/mind-map";
import { MarkDownViewer } from "@/app/components/mark-down-viewer";

function useQuizQuestions(quizUuid: string) {
  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch quiz questions");
      return res.json();
    });
  const { data, error, isLoading } = useSWR(
    `/api/quiz/questions/${quizUuid}`,
    fetcher,
  );
  return { data, error, isLoading };
}

interface VideoInfoTabsProps {
  videoData: LectureResource;
  height?: string;
}

export function VideoInfoTabs({ videoData, height }: VideoInfoTabsProps) {
  const containerStyle = height
    ? { minHeight: height, maxHeight: height }
    : undefined;

  // Assume the quiz uuid is the same as the video uuid (adjust if necessary)
  const quizUuid = videoData.quiz.uuid;
  const {
    data: quizData,
    error: quizError,
    isLoading: quizLoading,
  } = useQuizQuestions(quizUuid);

  // Transform the API response into the shape expected by Quizlet.
  // The API returns an object with a "data" key containing an array of questions.
  const transformedQuestions =
    quizData && quizData.data
      ? quizData.data.map((q: any) => ({
          id: q.question_uuid,
          question: q.question_text,
          options: q.options.map((opt: any) => opt.option_text),
          // Note: The API doesn’t provide a correct answer.
          // You can add it here if available.
        }))
      : [];

  return (
    <Card style={containerStyle} className="h-full">
      <CardContent style={containerStyle} className="p-0 h-full">
        <Tabs defaultValue="transcription" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value={"mind-map"}>Mind Map</TabsTrigger>
            <TabsTrigger value="quizlets">Quizlets</TabsTrigger>
          </TabsList>
          <TabsContent value="transcription" className="h-full pb-5">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm max-w-full">
                <MarkDownViewer>
                  {videoData?.transcription ||
                    "Transcription not available yet."}
                </MarkDownViewer>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="summary" className="h-full pb-5">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">
                <MarkDownViewer>
                  {videoData?.summary || "Summary not available yet."}
                </MarkDownViewer>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value={"mind-map"} className="h-full pb-5">
            <ScrollArea className="h-full">
              <TreeMindMap data={videoData.mind_map} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="quizlets" className="h-full pb-20">
            <ScrollArea className="h-full">
              <div className="p-4 text-sm">
                {quizLoading && <Spinner />}
                {quizError && "Error loading quiz."}
                {!quizLoading &&
                !quizError &&
                transformedQuestions.length > 0 ? (
                  <Quizlet questions={transformedQuestions} />
                ) : (
                  !quizLoading &&
                  !quizError &&
                  transformedQuestions.length === 0 &&
                  "No quiz questions available."
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

VideoInfoTabs.displayName = "VideoInfoTabs";
