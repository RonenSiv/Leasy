"use client";

import React, { useEffect, useRef, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat } from "@/components/chat/chat";
import { EnhancedVideoPlayer } from "@/components/enhanced-video-player";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { BookOpen, BookOpenText, Brain, Clock, Youtube } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  mockVideoQuizlets,
  mockVideoSummary,
  mockVideoTranscription,
} from "@/mocks/mocks";

const ResponsiveGridLayout = WidthProvider(Responsive);

const MotionCard = motion(Card);

interface MotionCardComponentProps {
  children: React.ReactNode;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  headerClasses: string;
  contentClasses: string;
}

interface VideoPlayerCardProps {
  handleVideoProgress: (progress: number) => void;
}

interface LearningMaterialsCardProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  quizAnswers: { [key: string]: string };
  handleQuizAnswer: (questionId: string, answer: string) => void;
  handleQuizSubmit: () => void;
  quizSubmitted: boolean;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

const MotionCardComponent: React.FC<MotionCardComponentProps> = ({
  children,
  title,
  icon: Icon,
  headerClasses,
  contentClasses,
}) => (
  <MotionCard
    className="overflow-hidden shadow-lg h-full"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <CardHeader
      className={`drag-handle cursor-move ${headerClasses} text-white`}
    >
      <CardTitle className="flex items-center">
        <Icon className="mr-2" /> {title}
      </CardTitle>
    </CardHeader>
    <CardContent className={contentClasses}>{children}</CardContent>
  </MotionCard>
);

const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  handleVideoProgress,
}) => (
  <MotionCardComponent
    title="Video Player"
    icon={Youtube}
    headerClasses="bg-gradient-to-r from-purple-500 to-indigo-500"
    contentClasses="p-0 h-[calc(100%-4rem)]"
  >
    <EnhancedVideoPlayer
      videoId="BigBuckBunny"
      onProgressChange={handleVideoProgress}
    />
  </MotionCardComponent>
);

const LearningMaterialsCard: React.FC<LearningMaterialsCardProps> = ({
  activeTab,
  handleTabChange,
  quizAnswers,
  handleQuizAnswer,
  handleQuizSubmit,
  quizSubmitted,
  notes,
  setNotes,
}) => (
  <MotionCardComponent
    title="Learning Materials"
    icon={BookOpenText}
    headerClasses="bg-gradient-to-r from-pink-500 to-rose-500"
    contentClasses="p-4 h-[calc(100%-4rem)]"
  >
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger
          value="transcription"
          className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
        >
          Transcript
        </TabsTrigger>
        <TabsTrigger
          value="summary"
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Summary
        </TabsTrigger>
        <TabsTrigger
          value="quizlets"
          className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
        >
          Quiz
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
        >
          Notes
        </TabsTrigger>
      </TabsList>
      <ScrollArea className="flex-grow">
        <TabsContent value="transcription">
          <div className="rounded-md border-2 border-purple-300 p-4 bg-white dark:bg-gray-800">
            {mockVideoTranscription.map((line, index) => (
              <p key={index} className="mb-2">
                {line.text}
                <br />
              </p>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="rounded-md border-2 border-blue-300 p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-4 text-xl text-blue-600 dark:text-blue-400">
              Video Summary: Big Buck Bunny
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {mockVideoSummary.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="quizlets">
          <div className="rounded-md border-2 border-green-300 p-4 bg-white dark:bg-gray-800">
            <div className="space-y-6">
              {mockVideoQuizlets.map((quizlet, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2 text-lg text-green-600 dark:text-green-400">
                    Question {index + 1}: {quizlet.question}
                  </h4>
                  <div className="space-y-2">
                    {quizlet.options.map((option, index) => (
                      <Button
                        key={option}
                        variant="outline"
                        className={`w-full justify-start text-left ${
                          quizAnswers[quizlet.id] === option
                            ? "bg-green-100 dark:bg-green-900"
                            : ""
                        }`}
                        onClick={() => handleQuizAnswer(quizlet.id, option)}
                        disabled={quizSubmitted}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                onClick={handleQuizSubmit}
                disabled={
                  quizSubmitted || Object.keys(quizAnswers).length !== 2
                }
                className="w-full mt-4"
              >
                Submit Quiz
              </Button>
              {quizSubmitted && (
                <p className="text-center font-semibold">
                  {Object.keys(quizAnswers).length === 2 &&
                  quizAnswers["q1"] === "Big Buck Bunny" &&
                  quizAnswers["q2"] === "He sets clever traps"
                    ? "🎉 Congratulations! You passed the quiz!"
                    : "😢 Oops! You might want to review the material and try again."}
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <div className="rounded-md border-2 border-yellow-300 p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-4 text-xl text-yellow-600 dark:text-yellow-400">
              Study Notes
            </h3>
            <textarea
              className="w-full h-[200px] p-2 border rounded-md"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your notes here..."
            />
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  </MotionCardComponent>
);

const AIStudyBuddyCard: React.FC = () => (
  <MotionCardComponent
    title="AI Study Buddy"
    icon={Brain}
    headerClasses="bg-gradient-to-r from-green-500 to-teal-500"
    contentClasses="p-0 h-[calc(100%-4rem)]"
  >
    <Chat id="example-chat-id" missingKeys={[]} />
  </MotionCardComponent>
);

export default function VideoPage() {
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "video", x: 0, y: 0, w: 16, h: 6, minW: 4, minH: 3 },
      { i: "chat", x: 8, y: 6, w: 4, h: 6, minW: 3, minH: 3 },
      { i: "tabs", x: 0, y: 6, w: 8, h: 6, minW: 4, minH: 3 },
    ],
  });

  const [activeTab, setActiveTab] = useState("transcription");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [notes, setNotes] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [studyProgress, setStudyProgress] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isStudying) {
      timerRef.current = setInterval(() => {
        setStudyTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStudying]);

  const onLayoutChange = (layout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleQuizSubmit = () => {
    const correctAnswers = {
      q1: "Big Buck Bunny",
      q2: "He sets clever traps",
    };
    const totalQuestions = Object.keys(correctAnswers).length;
    const correctCount = Object.keys(quizAnswers).reduce((acc, questionId) => {
      return (
        acc +
        (quizAnswers[questionId] ===
        correctAnswers[questionId as keyof typeof correctAnswers]
          ? 1
          : 0)
      );
    }, 0);
    const score = (correctCount / totalQuestions) * 100;

    setQuizSubmitted(true);

    if (score >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      const sadIndicator = document.createElement("div");
      sadIndicator.innerHTML = "😢";
      sadIndicator.style.position = "fixed";
      sadIndicator.style.top = "50%";
      sadIndicator.style.left = "50%";
      sadIndicator.style.transform = "translate(-50%, -50%)";
      sadIndicator.style.fontSize = "5rem";
      sadIndicator.style.opacity = "0";
      sadIndicator.style.transition = "opacity 0.5s";
      document.body.appendChild(sadIndicator);

      setTimeout(() => {
        sadIndicator.style.opacity = "1";
      }, 100);

      setTimeout(() => {
        sadIndicator.style.opacity = "0";
      }, 2000);

      setTimeout(() => {
        document.body.removeChild(sadIndicator);
      }, 2500);
    }
  };

  const toggleStudyTimer = () => {
    setIsStudying(!isStudying);
  };

  const handleVideoProgress = (progress: number) => {
    setStudyProgress(progress * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const renderContent = () => (
    <>
      {isMobile ? (
        <div className="space-y-4">
          <VideoPlayerCard handleVideoProgress={handleVideoProgress} />
          <LearningMaterialsCard
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            quizAnswers={quizAnswers}
            handleQuizAnswer={handleQuizAnswer}
            handleQuizSubmit={handleQuizSubmit}
            quizSubmitted={quizSubmitted}
            notes={notes}
            setNotes={setNotes}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                <Brain className="mr-2" /> Open AI Study Buddy
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <Chat id="example-chat-id" missingKeys={[]} />
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={onLayoutChange}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".drag-handle"
        >
          <div key="video" ref={videoRef}>
            <VideoPlayerCard handleVideoProgress={handleVideoProgress} />
          </div>
          <div key="chat">
            <AIStudyBuddyCard />
          </div>
          <div key="tabs">
            <LearningMaterialsCard
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              quizAnswers={quizAnswers}
              handleQuizAnswer={handleQuizAnswer}
              handleQuizSubmit={handleQuizSubmit}
              quizSubmitted={quizSubmitted}
              notes={notes}
              setNotes={setNotes}
            />
          </div>
        </ResponsiveGridLayout>
      )}
    </>
  );

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 min-h-screen text-foreground">
      <style jsx global>{`
        .react-grid-item.react-grid-placeholder {
          background: rgba(124, 58, 237, 0.2) !important;
          border: 2px dashed #8b5cf6;
          border-radius: 12px;
        }

        .react-resizable-handle {
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="6" height="6"%3E%3Cpath d="M6 6H0V4.2h4.2V0H6v6z" fill="%238b5cf6"%3E%3C/path%3E%3C/svg%3E');
          background-position: bottom right;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
          bottom: 0;
          right: 0;
          width: 20px;
          height: 20px;
          padding: 0 3px 3px 0;
        }
      `}</style>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="text-purple-500" />
          <span className="font-bold">{formatTime(studyTime)}</span>
        </div>
        <Button
          onClick={toggleStudyTimer}
          variant="outline"
          className="bg-purple-500 text-white hover:bg-purple-600"
        >
          {isStudying ? "Pause Study" : "Start Study"}
        </Button>
        <div className="flex items-center space-x-2">
          <BookOpen className="text-purple-500" />
          <Progress value={studyProgress} className="w-[100px]" />
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400">
        Big Buck Bunny
      </h1>
      {renderContent()}
    </div>
  );
}
