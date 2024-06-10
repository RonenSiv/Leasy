"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/app/components/ui/video-player/VideoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MdExpand } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="absolute top-2 right-2 bg-transparent hover:bg-transparent text-secondary-foreground hover:scale-110">
          <MdExpand />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full h-full"></div>
      </DrawerContent>
    </Drawer>
  );
};

export default function VideoPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const params = useParams();
  const videoId = Array.isArray(params.videoId)
    ? params.videoId[0]
    : params.videoId;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen h-full flex-1">
      <ResizablePanelGroup
        direction="vertical"
        className="w-full h-full flex-1 border-0 gap-4"
      >
        <ResizablePanel>
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full h-full flex-1 border-0 gap-4"
          >
            <ResizablePanel minSize={50}>
              <VideoPlayer
                videoId={videoId}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={25}>
              <Tabs
                defaultValue="transcription"
                className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar h-full bg-background"
              >
                <TabsList className={"flex justify-center gap-4"}>
                  <TabsTrigger value="transcription">Transcription</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="quizzlet">Quizzlet</TabsTrigger>
                </TabsList>
                <ScrollArea className="w-full h-full pb-16 px-4">
                  <TabsContent value="transcription">
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Aut est natus nulla repellat suscipit. Ad aperiam
                      consectetur consequuntur eius eos ipsam maiores nostrum
                      pariatur quam, rem sequi sint temporibus vel!
                    </div>
                    <div>
                      A ab aliquam amet animi architecto aspernatur atque autem
                      culpa ea, ipsa itaque iusto laboriosam maxime minima nisi
                      nostrum omnis, provident quas rem saepe sapiente unde
                      veniam voluptas? Facere, possimus?
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Aut est natus nulla repellat suscipit. Ad aperiam
                      consectetur consequuntur eius eos ipsam maiores nostrum
                      pariatur quam, rem sequi sint temporibus vel!
                    </div>
                    <div>
                      A ab aliquam amet animi architecto aspernatur atque autem
                      culpa ea, ipsa itaque iusto laboriosam maxime minima nisi
                      nostrum omnis, provident quas rem saepe sapiente unde
                      veniam voluptas? Facere, possimus?
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Aut est natus nulla repellat suscipit. Ad aperiam
                      consectetur consequuntur eius eos ipsam maiores nostrum
                      pariatur quam, rem sequi sint temporibus vel!
                    </div>
                    <div>
                      A ab aliquam amet animi architecto aspernatur atque autem
                      culpa ea, ipsa itaque iusto laboriosam maxime minima nisi
                      nostrum omnis, provident quas rem saepe sapiente unde
                      veniam voluptas? Facere, possimus?
                    </div>
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Aut est natus nulla repellat suscipit. Ad aperiam
                      consectetur consequuntur eius eos ipsam maiores nostrum
                      pariatur quam, rem sequi sint temporibus vel!
                    </div>
                    <div>
                      A ab aliquam amet animi architecto aspernatur atque autem
                      culpa ea, ipsa itaque iusto laboriosam maxime minima nisi
                      nostrum omnis, provident quas rem saepe sapiente unde
                      veniam voluptas? Facere, possimus?
                    </div>
                  </TabsContent>
                  <TabsContent value="summary">
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Aut est natus nulla repellat suscipit. Ad aperiam
                      consectetur consequuntur eius eos ipsam maiores nostrum
                      pariatur quam, rem sequi sint temporibus vel!
                    </div>
                    <div>
                      A ab aliquam amet animi architecto aspernatur atque autem
                      culpa ea, ipsa itaque iusto laboriosam maxime minima nisi
                      nostrum omnis, provident quas rem saepe sapiente unde
                      veniam voluptas? Facere, possimus?
                    </div>
                  </TabsContent>
                  <TabsContent value="quizzlet">
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Aut est natus nulla repellat suscipit. Ad aperiam
                      consectetur consequuntur eius eos ipsam maiores nostrum
                      pariatur quam, rem sequi sint temporibus vel!
                    </div>
                    <div>
                      A ab aliquam amet animi architecto aspernatur atque autem
                      culpa ea, ipsa itaque iusto laboriosam maxime minima nisi
                      nostrum omnis, provident quas rem saepe sapiente unde
                      veniam voluptas? Facere, possimus?
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={25}>
          <Card className="relative w-full h-full">
            <CardContent>
              <ChatDrawer />
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}
