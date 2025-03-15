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
  showcase?: boolean;
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
  showcase = false,
}: QuizletProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [questions, setQuestions] =
    React.useState<QuizQuestion[]>(initialQuestions);
  const [localQuizState, setLocalQuizState] =
    React.useState<QuizState>(initialQuizState);
  const [localQuizResults, setLocalQuizResults] = React.useState<
    QuizAnswerResponse | undefined
  >(undefined);

  const {
    data: apiQuizState,
    mutate: mutateQuizState,
    isLoading: apiIsLoading,
    isValidating: apiIsValidating,
  } = useSWR<QuizState>(!showcase ? `quiz-state-${quizId}` : null, null, {
    fallbackData: initialQuizState,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: apiQuizResults, mutate: mutateResults } =
    useSWR<QuizAnswerResponse>(
      !showcase && apiQuizState?.submitted ? `/quiz/answer/${quizId}` : null,
      null,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    );

  const quizState = showcase ? localQuizState : apiQuizState;
  const quizResults = showcase ? localQuizResults : apiQuizResults;
  const isLoading = showcase ? false : apiIsLoading;
  const isValidating = showcase ? false : apiIsValidating;

  React.useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const mockCorrectAnswers = React.useMemo(() => {
    return questions?.reduce(
      (acc, question) => {
        // Assign option index 1 (second option) as correct answer for all questions in showcase
        acc[question.question_uuid] = 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [questions]);

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

    if (showcase) {
      setLocalQuizState(newState);
    } else {
      await mutateQuizState(newState, false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const answers = quizState?.answers || {};

      if (showcase) {
        // Calculate score locally for showcase mode
        let correctCount = 0;
        const totalQuestions = questions.length;

        const questionsData = questions.map((question) => {
          const isCorrect =
            answers[question.question_uuid] ===
            mockCorrectAnswers[question.question_uuid];
          if (isCorrect) correctCount++;

          return {
            question_uuid: question.question_uuid,
            correct_option: mockCorrectAnswers[question.question_uuid],
            selected_option: answers[question.question_uuid],
            is_correct: isCorrect,
          };
        });

        const score =
          totalQuestions > 0
            ? Math.round((correctCount / totalQuestions) * 100)
            : 0;

        // Create mock API response
        const mockResponse: QuizAnswerResponse = {
          data: {
            quiz_id: quizId,
            score,
            // @ts-ignore
            questions_data: questionsData,
          },
          status: 200,
          message: "Success",
        };

        setLocalQuizResults(mockResponse);
        setLocalQuizState({
          answers,
          submitted: true,
          score,
        });
      } else {
        // Real API call for non-showcase mode
        const answersBody = Object.entries(answers).map(
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
          answers,
          submitted: true,
          score: res.data.score,
        };

        await mutateQuizState(newState, false);
        await mutateResults(res);
      }
    } catch (error) {
      toast.error("Failed to submit quiz answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = async () => {
    if (showcase) {
      setLocalQuizState(initialQuizState);
      setLocalQuizResults(undefined);
    } else {
      await mutateQuizState(initialQuizState, false);
      await mutateResults(undefined);
    }
  };

  const handleGenerateNewQuestions = async () => {
    if (!summary) return;

    try {
      setIsGenerating(true);

      if (showcase) {
        setLocalQuizState(initialQuizState);
        setLocalQuizResults(undefined);

        setTimeout(() => {
          setIsGenerating(false);
        }, 1500);
      } else {
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
        setIsGenerating(false);
      }
    } catch (error) {
      setQuestions(initialQuestions);

      if (showcase) {
        setLocalQuizState(initialQuizState);
        setLocalQuizResults(undefined);
      } else {
        await mutateQuizState(initialQuizState, false);
        await mutateResults(undefined);
      }

      toast.error("Failed to generate new questions. Please try again.");
      console.error("Failed to generate new questions:", error);
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
                  // Determine if this is the selected answer
                  const isSelected =
                    quizState.answers[question.question_uuid] ===
                    option.option_index;

                  // Determine if this is the correct answer
                  const correctOption = showcase
                    ? mockCorrectAnswers[question.question_uuid]
                    : quizResults?.data.questions_data.find(
                        (q) => q.question_uuid === question.question_uuid,
                      )?.correct_option;

                  const isCorrect = option.option_index === correctOption;

                  if (isSelected && isCorrect) {
                    // Selected and correct
                    additionalClasses = "bg-green-500/10 border-green-500";
                  } else if (isSelected && !isCorrect) {
                    // Selected but incorrect
                    additionalClasses =
                      "bg-destructive/50 border-destructive/60";
                  } else if (!isSelected && isCorrect) {
                    // Not selected but is correct
                    additionalClasses = "bg-green-500/10 border-green-500";
                  }
                } else {
                  // Not submitted yet, just highlight selected
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
                    className={`justify-start text-left break-words whitespace-pre-wrap h-auto min-h-10 py-2 px-3 flex-wrap ${additionalClasses} hover:bg-primary/50`}
                    onClick={() =>
                      handleOptionClick(
                        question.question_uuid,
                        option.option_index,
                      )
                    }
                    disabled={quizState?.submitted}
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
        {quizState?.submitted && (
          <p className="text-center text-lg font-semibold">
            Final Score: {quizState.score}%
          </p>
        )}
        <div className="flex justify-end gap-2">
          {quizState?.submitted ? (
            <>
              <Button onClick={handleRestart}>Restart Test</Button>
              {!showcase && (
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
