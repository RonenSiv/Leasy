"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { QuizAnswerResponse, QuizQuestion } from "@/types/api-types";
import { RefreshCw, Send } from "lucide-react";
import { Spinner } from "@/app/components/spinner";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import api from "@/lib/api";

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

  const {
    data: quizState,
    mutate: mutateQuizState,
    isLoading,
    isValidating,
  } = useSWR<QuizState>(`quiz-state-${quizId}`, null, {
    fallbackData: initialQuizState,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: quizResults, mutate: mutateResults } =
    useSWR<QuizAnswerResponse>(
      quizState?.submitted ? `/quiz/answer/${quizId}` : null,
      null,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    );

  React.useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const handleOptionClick = async (
    questionId: string,
    optionNumber: number,
  ) => {
    if (quizState?.submitted) return;

    const newState: QuizState = {
      answers: { ...(quizState?.answers || {}), [questionId]: optionNumber },
      submitted: false,
      score: 0,
    };

    await mutateQuizState(newState, false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const answersBody = Object.entries(quizState?.answers || {}).map(
        ([question_uuid, answer]) => ({
          question_uuid,
          answer,
        }),
      );

      const { data: res } = await api.put<QuizAnswerResponse>(
        `/quiz/answer/${quizId}`,
        {
          answers: answersBody,
        },
      );

      const newState: QuizState = {
        answers: quizState?.answers || {},
        submitted: true,
        score: res.data.score,
      };

      await mutateQuizState(newState, false);
      await mutateResults(res);
    } catch (error) {
      toast.error("Failed to submit quiz answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = async () => {
    await mutateQuizState(initialQuizState, false);
    await mutateResults(undefined);
  };

  const handleGenerateNewQuestions = async () => {
    if (!summary) return;

    try {
      setIsGenerating(true);
      await mutateQuizState(initialQuizState, false);
      await mutateResults(undefined);

      const { data } = await api.put<{ questions: QuizQuestion[] }>(
        `/quiz/generate-new-questions/${quizId}`,
        {
          summary,
        },
      );

      setQuestions(data.questions);
      onNewQuestions();
    } catch (error) {
      setQuestions(initialQuestions);
      await mutateQuizState(initialQuizState, false);
      await mutateResults(undefined);
      toast.error("Failed to generate new questions. Please try again.");
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
        <img src="/quiz.png" alt="Quiz" className="w-48 h-48 mt-4" />
      </div>
    );
  }

  if (isLoading || isValidating) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <Spinner full={false} />
        <p className="mt-4 text-center">We're preparing the quiz for you 🚀</p>
        <img src="/quiz.png" alt="Quiz" className="w-48 h-48 mt-4" />
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
              {question.options.map((option, optionIdx) => {
                let additionalClasses = "";
                if (quizState?.submitted) {
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
                    quizState?.answers[question.question_uuid] ===
                    option.option_index
                  ) {
                    additionalClasses = "bg-primary/10 border-primary";
                  }
                }
                return (
                  <Button
                    key={optionIdx}
                    variant="outline"
                    className={`justify-start text-left break-words whitespace-pre-wrap ${additionalClasses} hover:bg-primary/50`}
                    onClick={() =>
                      handleOptionClick(
                        question.question_uuid,
                        option.option_index,
                      )
                    }
                    disabled={quizState?.submitted}
                  >
                    <span className="w-full">{option.option_text}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0 bg-background p-4 border-t flex flex-col gap-2">
        {quizState?.submitted && (
          <p className="text-center text-lg font-semibold">
            Final Score: {quizState.score}%
          </p>
        )}
        <div className="flex justify-end gap-2">
          {quizState?.submitted ? (
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
                <Spinner className="w-4 h-4" />
              ) : (
                <Button
                  disabled={
                    Object.keys(quizState?.answers || {}).length <
                      questions.length || isSubmitting
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
