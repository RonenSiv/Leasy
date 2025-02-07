import useSWR from "swr";
import api from "@/lib/api";
import { QuizQuestion } from "@/types/api-types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useQuizQuestions(quizUuid: string) {
  const { data, error, mutate } = useSWR<{ data: QuizQuestion[] }>(
    `/quiz/questions/${quizUuid}`,
    fetcher,
  );

  return {
    questions: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
