"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { ResponsiveLayout } from "@/components/responsive-grid";
import { VideoPlayer } from "@/components/video-player/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { loadFromLS, saveToLS } from "@/lib/utils/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaCircleInfo } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Chat } from "@/components/chat/chat";
import NoSsr from "@/components/no-ssr";
import { useMountedState } from "react-use";
import { LearnPageSkeleton } from "@/components/learn-page-skeleton";

const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];
const initialLayout = [
  {
    i: "0",
    x: 0,
    y: 0,
    w: 8,
    h: 12,
    minW: 6,
    minH: 6,
    static: false,
    resizeHandles: availableHandles,
  },
  {
    i: "1",
    x: 8,
    y: 0,
    w: 4,
    h: 22,
    static: false,
    resizeHandles: availableHandles,
  },
  {
    i: "2",
    x: 0,
    y: 10,
    w: 8,
    h: 10,
    minW: 4,
    minH: 10,
    static: false,
    resizeHandles: availableHandles,
  },
];

const StudyTabs = ({ height = 470 }: { height?: number }) => {
  return (
    <div className="relative flex justify-center rounded-lg">
      <Tabs
        defaultValue="transcription"
        className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar bg-background rounded-lg"
        style={{ height: `${height}px` }}
      >
        <TabsList className={"flex justify-center gap-4"}>
          <TabsTrigger value="transcription">Transcription</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="quizzlet">Quizzlet</TabsTrigger>
        </TabsList>
        <ScrollArea className="w-full h-full pb-16 px-4 ">
          <TabsContent value="transcription">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut est
              natus nulla repellat suscipit. Ad aperiam consectetur consequuntur
              eius eos ipsam maiores nostrum pariatur quam, rem sequi sint
              temporibus vel!
            </div>
          </TabsContent>
          <TabsContent value="summary">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut est
              natus nulla repellat suscipit. Ad aperiam consectetur consequuntur
              eius eos ipsam maiores nostrum pariatur quam, rem sequi sint
              temporibus vel!
            </div>
            <div>
              A ab aliquam amet animi architecto aspernatur atque autem culpa
              ea, ipsa itaque iusto laboriosam maxime minima nisi nostrum omnis,
              provident quas rem saepe sapiente unde veniam voluptas? Facere,
              possimus?
            </div>
          </TabsContent>
          <TabsContent value="quizzlet">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut est
              natus nulla repellat suscipit. Ad aperiam consectetur consequuntur
              eius eos ipsam maiores nostrum pariatur quam, rem sequi sint
              temporibus vel!
            </div>
            <div>
              A ab aliquam amet animi architecto aspernatur atque autem culpa
              ea, ipsa itaque iusto laboriosam maxime minima nisi nostrum omnis,
              provident quas rem saepe sapiente unde veniam voluptas? Facere,
              possimus?
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default function VideoPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const params = useParams();
  const [layout, setLayout] = useState<Layout[]>(initialLayout as Layout[]);
  const [alert, setAlert] = useState(false);
  const isMounted = useMountedState();

  const onLayoutChange = useCallback((layout: Layout[]) => {
    setLayout(layout);
    saveToLS("layouts", layout);
  }, []);

  const videoId = Array.isArray(params.videoId)
    ? params.videoId[0]
    : params.videoId;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleAlertClose = () => {
    setAlert(false);
    saveToLS("close-video-page-alert", true);
  };

  useEffect(() => {
    const didClose = loadFromLS("close-video-page-alert");
    setAlert(!didClose);
  }, []);

  if (!isMounted()) return <LearnPageSkeleton />;
  return (
    <NoSsr>
      <section className="flex flex-col items-start justify-start w-full min-h-screen h-full flex-1">
        {alert && (
          <Alert className={"relative"}>
            <FaCircleInfo className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can drag and resize the tabs and video player to your liking.
              <IoMdClose
                className="h-4 w-4 cursor-pointer absolute top-2 right-2"
                onClick={handleAlertClose}
              />
            </AlertDescription>
          </Alert>
        )}
        <ResponsiveLayout
          onLayoutChange={onLayoutChange}
          initialLayout={layout}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          preventCollision={true}
          gridContent={[
            <div key={0} className={"w-full h-full"}>
              <VideoPlayer
                videoId={videoId}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
              />
            </div>,
            <StudyTabs key={1} height={layout?.[1]?.h * 39} />,
            <div
              key={2}
              className="relative w-full h-full bg-background rounded-lg"
            >
              <Chat id="1" missingKeys={[]} />
            </div>,
          ]}
        />
      </section>
    </NoSsr>
  );
}
