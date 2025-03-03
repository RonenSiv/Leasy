"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Send } from "lucide-react";
import { Spinner } from "@/app/components/spinner";

// Define TypeScript interfaces to match the existing types
interface QuizOption {
  option_index: number;
  option_text: string;
}

interface QuizQuestion {
  question_uuid: string;
  question_text: string;
  options: QuizOption[];
}

interface QuestionData {
  question_uuid: string;
  correct_option: number;
}

interface QuizAnswerResponse {
  data: {
    score: number;
    questions_data: QuestionData[];
  };
}

interface QuizletProps {
  quizId: string;
  questions: QuizQuestion[];
  onNewQuestions: () => void;
  summary?: string;
}

interface QuizState {
  answers: Record<string, number>;
  submitted: boolean;
  score: number;
}

const initialQuizState: QuizState = {
  answers: {},
  submitted: false,
  score: 0,
};

// Mock correct answers for showcase
const mockCorrectAnswers: Record<string, number> = {
  q1: 1, // The correct answer for question 1 is option index 1
  q2: 2, // The correct answer for question 2 is option index 2
  q3: 1, // The correct answer for question 3 is option index 1
};

export function Quizlet({
  quizId,
  questions: initialQuestions,
  onNewQuestions,
  summary,
}: QuizletProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [questions, setQuestions] =
    React.useState<QuizQuestion[]>(initialQuestions);
  const [quizState, setQuizState] = React.useState<QuizState>(initialQuizState);
  const [quizResults, setQuizResults] = React.useState<
    QuizAnswerResponse | undefined
  >(undefined);

  React.useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const handleOptionClick = (questionId: string, optionNumber: number) => {
    if (quizState.submitted) return;

    setQuizState((prevState) => ({
      ...prevState,
      answers: { ...prevState.answers, [questionId]: optionNumber },
      submitted: false,
      score: 0,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calculate score based on mock correct answers
      let correctCount = 0;
      const questionsData: QuestionData[] = [];

      Object.entries(quizState.answers).forEach(([questionId, answer]) => {
        const correctAnswer = mockCorrectAnswers[questionId];
        questionsData.push({
          question_uuid: questionId,
          correct_option: correctAnswer,
        });

        if (answer === correctAnswer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / questions.length) * 100);

      // Create mock quiz results
      const mockResults: QuizAnswerResponse = {
        data: {
          score,
          questions_data: questionsData,
        },
      };

      setQuizState((prevState) => ({
        ...prevState,
        submitted: true,
        score,
      }));

      setQuizResults(mockResults);
    } catch (error) {
      console.error("Failed to submit quiz answers:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setQuizState(initialQuizState);
    setQuizResults(undefined);
  };

  const handleGenerateNewQuestions = async () => {
    if (!summary) return;

    try {
      setIsGenerating(true);
      setQuizState(initialQuizState);
      setQuizResults(undefined);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For the showcase, we'll just reuse the same questions
      // In a real implementation, this would generate new questions
      setQuestions(questions);
      onNewQuestions();
    } catch (error) {
      console.error("Failed to generate new questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <Spinner full={false} />
        <p className="mt-4 text-center">
          Please wait while we generate new questions for you
        </p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>No questions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 relative">
      {questions.map((question, idx) => (
        <div key={question.question_uuid} className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Question {idx + 1} of {questions.length}
            </h3>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-4 break-words whitespace-pre-wrap max-w-full">
              {question.question_text}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {question.options.map((option) => {
                let additionalClasses = "";
                if (quizState.submitted) {
                  if (
                    quizState.answers[question.question_uuid] ===
                      option.option_index &&
                    quizState.answers[question.question_uuid] ===
                      quizResults?.data.questions_data.find(
                        (q) => q.question_uuid === question.question_uuid,
                      )?.correct_option
                  ) {
                    additionalClasses = "bg-green-500/10 border-green-500";
                  } else if (
                    quizState.answers[question.question_uuid] ===
                      option.option_index &&
                    option.option_index !==
                      quizResults?.data.questions_data.find(
                        (q) => q.question_uuid === question.question_uuid,
                      )?.correct_option
                  ) {
                    additionalClasses =
                      "bg-destructive/50 border-destructive/60";
                  } else {
                    if (
                      option.option_index ===
                      quizResults?.data.questions_data.find(
                        (q) => q.question_uuid === question.question_uuid,
                      )?.correct_option
                    ) {
                      additionalClasses = "bg-green-500/10 border-green-500";
                    }
                  }
                } else {
                  if (
                    quizState.answers[question.question_uuid] ===
                    option.option_index
                  ) {
                    additionalClasses = "bg-primary/10 border-primary";
                  }
                }

                return (
                  <Button
                    key={option.option_index}
                    variant="outline"
                    className={`justify-start text-left break-words whitespace-pre-wrap h-auto min-h-10 py-2 px-3 flex-wrap ${additionalClasses} hover:bg-primary/50`}
                    onClick={() =>
                      handleOptionClick(
                        question.question_uuid,
                        option.option_index,
                      )
                    }
                    disabled={quizState.submitted}
                  >
                    <span className="w-full overflow-hidden text-wrap">
                      {option.option_text}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0 bg-background p-4 border-t flex flex-col gap-2">
        {quizState.submitted && (
          <p className="text-center text-lg font-semibold">
            Final Score: {quizState.score}%
          </p>
        )}
        <div className="flex justify-end gap-2">
          {quizState.submitted ? (
            <>
              <Button onClick={handleRestart}>Restart Test</Button>
              {summary && (
                <Button
                  variant="secondary"
                  onClick={handleGenerateNewQuestions}
                  disabled={isGenerating}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  New Questions
                </Button>
              )}
            </>
          ) : (
            <>
              {isSubmitting ? (
                <Button disabled className="min-w-[100px]">
                  <Spinner className="w-4 h-4 mr-2" />
                  Submitting...
                </Button>
              ) : (
                <Button
                  disabled={
                    Object.keys(quizState.answers).length < questions.length ||
                    isSubmitting
                  }
                  onClick={handleSubmit}
                  className="min-w-[100px]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Test
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
