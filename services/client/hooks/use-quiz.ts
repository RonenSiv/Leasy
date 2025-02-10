import useSWR from "swr";
import { QuizQuestion } from "@/types/api-types";
import { fetcher } from "@/app/actions/fetcher";

export function useQuizQuestions(quizUuid?: string) {
  const { data, error, mutate } = useSWR<{ data: QuizQuestion[] }>(
    `/quiz/questions/${quizUuid}`,
    fetcher.get,
  );

  return {
    questions: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
