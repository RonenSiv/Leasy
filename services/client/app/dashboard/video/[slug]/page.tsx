"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import StudyHeader from "@/components/study-page/study-header";
import PageTitle from "@/components/study-page/page-title";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import VideoPlayerCardSkeleton from "@/components/study-page/skeletons/video-player-skeleton";
import LearningMaterialsCardSkeleton from "@/components/study-page/skeletons/learning-material-card-skeleton";
import ChatSkeleton from "@/components/chatbot/chat-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Dynamically import client components to prevent SSR issues
const DynamicVideoPlayerCard = dynamic(
  () => import("@/components/study-page/video-player-card"),
  {
    ssr: false,
    loading: () => <VideoPlayerCardSkeleton />,
  },
);
const DynamicLearningMaterialsCard = dynamic(
  () => import("@/components/study-page/learning-material-card"),
  { ssr: false, loading: () => <LearningMaterialsCardSkeleton /> },
);
const DynamicAIStudyBuddyCard = dynamic(
  () => import("@/components/study-page/ai-study-buddy"),
  { ssr: false, loading: () => <ChatSkeleton /> },
);

const ResponsiveGridLayout = WidthProvider(Responsive);

const queryClient = new QueryClient();

export default function StudyPage() {
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

  const renderContent = () => (
    <>
      {isMobile ? (
        <div className="space-y-4">
          <DynamicVideoPlayerCard handleVideoProgress={handleVideoProgress} />
          <DynamicLearningMaterialsCard
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
              <DynamicAIStudyBuddyCard />
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
            <DynamicVideoPlayerCard handleVideoProgress={handleVideoProgress} />
          </div>
          <div key="chat" className="h-full">
            <DynamicAIStudyBuddyCard />
          </div>
          <div key="tabs" className="h-full">
            <DynamicLearningMaterialsCard
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
    <QueryClientProvider client={queryClient}>
      <StudyHeader
        studyTime={studyTime}
        toggleStudyTimer={toggleStudyTimer}
        studyProgress={studyProgress}
        isStudying={isStudying}
      />
      <PageTitle title="Big Buck Bunny" />
      {renderContent()}
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
    </QueryClientProvider>
  );
}
