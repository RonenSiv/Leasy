"use server";

import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { LectureResource, User, Video } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Create an Axios instance with the base URL and withCredentials enabled.
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * A universal server-side fetch function using Axios.
 * It reads the LeasyToken from cookies and sets it in the Authorization header.
 * NOTE: We remove the "next: { tags: ... }" option since Axios does not support it.
 */
export async function axiosServerFetch(
  endpoint: string,
  options: AxiosRequestConfig & {
    onUploadProgress?: (e: AxiosProgressEvent) => void;
  } = {},
) {
  // Get token from cookies
  const token = cookies().get("LeasyToken")?.value;

  const headers = {
    "Content-Type": options.headers?.["Content-Type"] || "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await axiosInstance.request({
      url: endpoint,
      method: options.method || "GET",
      data: options.data,
      params: options.params,
      headers,
      onUploadProgress: options.onUploadProgress,
      ...options,
    });

    // Optionally, if the response contains a Set-Cookie header, update the cookie.
    // (Axios does not pass Next.js-specific options so you must handle it manually.)
    const setCookieHeader = response.headers["set-cookie"];
    if (
      setCookieHeader &&
      Array.isArray(setCookieHeader) &&
      setCookieHeader.length > 0
    ) {
      // Example: extract token value from "LeasyToken=...; path=/; httponly; samesite=lax"
      const cookieStr = setCookieHeader[0];
      const tokenMatch = cookieStr.match(/^LeasyToken=([^;]+)/);
      if (tokenMatch) {
        const newToken = tokenMatch[1];
        cookies().set("LeasyToken", newToken, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
        });
      }
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `API call failed: ${error.response?.statusText}`,
        error.response?.data,
      );
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

/** Authentication */
export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await axiosServerFetch("/login", {
    method: "POST",
    data: JSON.stringify({ email, password }),
  });
  revalidateTag("user");
  return res;
}

export async function registerUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  console.log("Registering user");
  await axiosServerFetch("/register", {
    method: "POST",
    data: JSON.stringify({
      full_name: name,
      email,
      password,
    }),
  });
  redirect("/login");
}

export async function logoutUser() {
  cookies().delete("LeasyToken");
  redirect("/login");
}

/** User */
export async function getUser(): Promise<User> {
  return axiosServerFetch("/user");
}

/** Lectures */
export async function getLectures(
  params: {
    page?: number;
    search?: string;
    sortField?: string;
    sortOrder?: "asc" | "desc";
  } = {},
): Promise<{
  data: {
    dashboard: {
      total_videos: number;
      overall_progress: number;
      completed_videos: number;
      num_of_pages: number;
    };
    videos: Video[];
  };
}> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.search) searchParams.set("search", params.search);
  if (params.sortField) searchParams.set("sort_by", params.sortField);
  if (params.sortOrder) searchParams.set("sort_direction", params.sortOrder);
  return axiosServerFetch(`/lecture?${searchParams.toString()}`);
}

export async function getLecture(uuid: string): Promise<{
  data: LectureResource;
}> {
  return axiosServerFetch(`/lecture/${uuid}`);
}

export async function createLecture(formData: FormData) {
  const newFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    newFormData.append(key, value as any);
  }
  const res = await axiosServerFetch("/lecture", {
    method: "POST",
    data: newFormData,
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res) {
    throw new Error("Lecture creation failed");
  }
  revalidateTag("lectures");
  redirect("/browse");
}

/** Video */
export async function updateWatchTime(uuid: string, time: number) {
  await axiosServerFetch(`/video/last-watched-time/${uuid}`, {
    method: "PUT",
    data: JSON.stringify({ last_watched_time: time }),
  });
  revalidateTag(`lecture-${uuid}`);
  revalidateTag("lectures");
}

export async function fixVideoAudio(uuid: string) {
  return axiosServerFetch(`/video/fix-audio/${uuid}`, {
    method: "PUT",
  });
}

/** Chats */
export async function sendChatMessage(chatUuid: string, message: string) {
  const res = await axiosServerFetch(`/chat/send-message/${chatUuid}`, {
    method: "POST",
    data: JSON.stringify({ message }),
  });
  revalidateTag(`lecture-chat-${chatUuid}`);
  return res;
}

export async function getChatMessages(chatUuid: string, page = 1) {
  return axiosServerFetch(`/chat/messages/${chatUuid}?page=${page}`);
}

/** Quizzes */
export async function getQuizQuestions(quizUuid: string): Promise<any[]> {
  return axiosServerFetch(`/quiz/questions/${quizUuid}`);
}

export async function submitQuizAnswer(quizUuid: string, answers: any[]) {
  return axiosServerFetch(`/quiz/answer/${quizUuid}`, {
    method: "PUT",
    data: JSON.stringify({ answers }),
  });
}

export async function serverInitialLectureLoad(params?: {
  page?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}) {
  try {
    const response = await getLectures({
      page: params?.page,
      search: params?.search,
      sortField:
        params?.sortField === "date" ? "created_at" : params?.sortField,
      sortOrder: params?.sortOrder,
    });
    return response.data;
  } catch (error) {
    console.error("Initial server-side lecture load failed", error);
    return null;
  }
}
