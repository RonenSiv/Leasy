import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

async function fetchWithAuth(endpoint: string, options: any = {}) {
  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options,
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API call failed: ${error.response?.statusText}`);
    }
  }
}

export const api = {
  auth: {
    register: (data: { email: string; full_name: string; password: string }) =>
      fetchWithAuth("/register", { method: "POST", data }),

    login: (data: { email: string; password: string }) =>
      fetchWithAuth("/login", { method: "POST", data }),

    logout: () => fetchWithAuth("/logout", { method: "POST" }),

    getUser: () => fetchWithAuth("/user"),
  },
  lecture: {
    getLectures: (page = 1, sortBy = "date", sortDirection = "desc") =>
      fetchWithAuth(
        `/lecture?page=${page}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
      ),

    createLecture: (data: FormData) =>
      fetchWithAuth("/lecture", {
        method: "POST",
        data,
        headers: { "Content-Type": "multipart/form-data" },
      }),

    getLecture: (uuid: string) => fetchWithAuth(`/lecture/${uuid}`),

    updateLastWatchedTime: (uuid: string, lastWatchedTime: number) =>
      fetchWithAuth(`/video/last-watched-time/${uuid}`, {
        method: "PUT",
        data: { last_watched_time: lastWatchedTime },
      }),

    fixAudio: (uuid: string) =>
      fetchWithAuth(`/video/fix-audio/${uuid}`, { method: "PUT" }),

    getQuizQuestions: (uuid: string) =>
      fetchWithAuth(`/quiz/questions/${uuid}`),

    answerQuiz: (uuid: string, answers: Record<string, string>) =>
      fetchWithAuth(`/quiz/answer/${uuid}`, {
        method: "PUT",
        data: answers,
      }),

    sendChatMessage: (uuid: string, message: string) =>
      fetchWithAuth(`/chat/send-message/${uuid}`, {
        method: "POST",
        data: { message },
      }),

    getChatMessages: (uuid: string, page = 1) =>
      fetchWithAuth(`/chat/messages/${uuid}?page=${page}`),
  },
};
