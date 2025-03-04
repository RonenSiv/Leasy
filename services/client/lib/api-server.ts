import { headers } from "next/headers";

const baseAPIURL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const headersList = headers();
  const token = headersList.get("cookie")?.match(/LeasyToken=([^;]+)/)?.[1];

  const response = await fetch(`${baseAPIURL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Cookie: `LeasyToken=${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getLectures(params: {
  page?: number;
  onlyFavorites?: boolean;
  searchByTitle?: string;
  sortBy?: string;
  sortDirection?: string;
}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  return fetchWithAuth(`/lecture?${searchParams.toString()}`);
}

export async function getLecture(id: string) {
  return fetchWithAuth(`/lecture/${id}`);
}

export async function getQuizQuestions(quizId: string) {
  return fetchWithAuth(`/quiz/questions/${quizId}`);
}
