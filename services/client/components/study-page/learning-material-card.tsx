// components/client/LearningMaterialsCard.tsx
"use client";

import React from "react";
import MotionCardComponent from "./motion-card-component";
import { BookOpenText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  mockVideoQuizlets,
  mockVideoSummary,
  mockVideoTranscription,
} from "@/mocks/mocks";

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
                    {quizlet.options.map((option, idx) => (
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
                  quizSubmitted ||
                  Object.keys(quizAnswers).length !== mockVideoQuizlets.length
                }
                className="w-full mt-4"
              >
                Submit Quiz
              </Button>
              {quizSubmitted && (
                <p className="text-center font-semibold">
                  {Object.keys(quizAnswers).length ===
                    mockVideoQuizlets.length &&
                  Object.entries({
                    q1: "Big Buck Bunny",
                    q2: "He sets clever traps",
                  }).every(
                    ([key, value]) =>
                      quizAnswers[key as keyof typeof quizAnswers] === value,
                  )
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

export default LearningMaterialsCard;
