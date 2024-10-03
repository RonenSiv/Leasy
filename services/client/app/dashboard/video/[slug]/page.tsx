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
import { Award, BookOpen, Brain, Clock, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ResponsiveGridLayout = WidthProvider(Responsive);

const MotionCard = motion(Card);

export default function FunVideoPage() {
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "video", x: 0, y: 0, w: 8, h: 6, minW: 4, minH: 3 },
      { i: "chat", x: 8, y: 0, w: 4, h: 12, minW: 3, minH: 3 },
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

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
      // Show sad indicator
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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-600 dark:text-purple-400">
        Welcome to Your Fun Learning Journey! 🚀
      </h1>
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
          {isStudying ? "Pause Study Session" : "Start Study Session"}
        </Button>
        <div className="flex items-center space-x-2">
          <BookOpen className="text-purple-500" />
          <Progress value={studyProgress} className="w-[100px]" />
        </div>
      </div>
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
          <MotionCard
            className="overflow-hidden shadow-lg h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardHeader className="drag-handle cursor-move bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2" /> Video Player
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <EnhancedVideoPlayer
                videoId="BigBuckBunny" // Ensure this ID is correct
                onProgressChange={handleVideoProgress}
              />
            </CardContent>
          </MotionCard>
        </div>

        <div key="chat">
          <MotionCard
            className="overflow-hidden shadow-lg h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardHeader className="drag-handle cursor-move bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <CardTitle className="flex items-center">
                <Brain className="mr-2" /> AI Study Buddy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <Chat id="example-chat-id" missingKeys={[]} />
            </CardContent>
          </MotionCard>
        </div>

        <div key="tabs">
          <MotionCard
            className="overflow-hidden shadow-lg h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CardHeader className="drag-handle cursor-move bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <CardTitle className="flex items-center">
                <Award className="mr-2" /> Learning Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-4rem)]">
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
                    Transcription
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
                    Quizlets
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
                      <p className="mb-4">
                        This is the transcription of the video. It includes all
                        the spoken words and important audio cues from the
                        content.
                      </p>
                      <p className="mb-2">
                        <strong>Narrator:</strong> In a sun-dappled forest
                        glade, a big-eyed bunny named Big Buck Bunny peacefully
                        enjoys nature...
                      </p>
                      <p className="mb-2">
                        <strong>Narrator:</strong> Suddenly, three rodent
                        bullies appear, disrupting the tranquil scene with their
                        mischievous antics.
                      </p>
                      <p>
                        <strong>Narrator:</strong> What follows is a comical
                        tale of revenge, as our gentle hero devises clever traps
                        to outsmart the troublemakers...
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="summary">
                    <div className="rounded-md border-2 border-blue-300 p-4 bg-white dark:bg-gray-800">
                      <h3 className="font-semibold mb-4 text-xl text-blue-600 dark:text-blue-400">
                        Video Summary: Big Buck Bunny
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Introduction to Big Buck Bunny, a gentle giant rabbit
                          in a peaceful forest
                        </li>
                        <li>
                          Arrival of three mischievous rodents who disrupt the
                          forest's harmony
                        </li>
                        <li>
                          Big Buck Bunny's transformation from a passive victim
                          to a clever trickster
                        </li>
                        <li>
                          Series of humorous traps and pranks set by Big Buck
                          Bunny to teach the bullies a lesson
                        </li>
                        <li>
                          Resolution and return to peace in the forest, with a
                          hint of Big Buck Bunny's newfound confidence
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="quizlets">
                    <div className="rounded-md border-2 border-green-300 p-4 bg-white dark:bg-gray-800">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2 text-lg text-green-600 dark:text-green-400">
                            Question 1: Main Character
                          </h4>
                          <p className="mb-2">
                            Who is the main character of the video?
                          </p>
                          <div className="space-y-2">
                            {[
                              "Big Buck Bunny",
                              "Little Red Riding Hood",
                              "Bugs Bunny",
                              "Peter Rabbit",
                            ].map((option) => (
                              <Button
                                key={option}
                                variant="outline"
                                className={`w-full justify-start text-left ${quizAnswers["q1"] === option ? "bg-green-100 dark:bg-green-900" : ""}`}
                                onClick={() => handleQuizAnswer("q1", option)}
                                disabled={quizSubmitted}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-lg text-green-600 dark:text-green-400">
                            Question 2: Plot Development
                          </h4>
                          <p className="mb-2">
                            How does Big Buck Bunny respond to the bullies?
                          </p>
                          <div className="space-y-2">
                            {[
                              "He runs away",
                              "He sets clever traps",
                              "He calls for help",
                              "He becomes their friend",
                            ].map((option) => (
                              <Button
                                key={option}
                                variant="outline"
                                className={`w-full justify-start text-left ${quizAnswers["q2"] === option ? "bg-green-100 dark:bg-green-900" : ""}`}
                                onClick={() => handleQuizAnswer("q2", option)}
                                disabled={quizSubmitted}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={handleQuizSubmit}
                          disabled={
                            quizSubmitted ||
                            Object.keys(quizAnswers).length !== 2
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
            </CardContent>
          </MotionCard>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
