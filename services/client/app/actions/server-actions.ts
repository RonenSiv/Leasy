"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { LectureResource, User, Video } from "@/types";
import { revalidate } from "@/app/actions/mutations";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const token = cookies().get("LeasyToken")?.value;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    console.error(`API call failed: ${res.statusText}`);
    return;
  }

  const setCookieHeader = res.headers.get("set-cookie");

  if (setCookieHeader) {
    const tokenCookie = setCookieHeader.split(";")[0];
    const tokenValue = tokenCookie.split("=")[1];

    cookies().set("LeasyToken", tokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return res.json();
}

/** Authentication */
export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await serverFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  revalidateTag("user");
  revalidate("/user");
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
  await serverFetch("/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: name,
      email,
      password,
    }),
  });
  redirect("/login");
  revalidate("/user");
}

export async function logoutUser() {
  revalidateTag("user");
  cookies().delete("LeasyToken");
  return { success: true };
}

/** User */
export async function getUser(): Promise<User> {
  return serverFetch("/user", {
    next: { tags: ["user"] },
  });
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
  if (params.search) searchParams.set("search_by_title", params.search);
  if (params.sortField) searchParams.set("sort_by", params.sortField);
  if (params.sortOrder) searchParams.set("sort_direction", params.sortOrder);

  revalidate("/lecture");

  return serverFetch(`/lecture?${searchParams.toString()}`, {
    next: { tags: ["lectures"] },
  });
}

export async function getLecture(uuid: string): Promise<{
  data: LectureResource;
}> {
  revalidate("/lecture");
  return serverFetch(`/lecture/${uuid}`, {
    next: { tags: [`lecture-${uuid}`] },
  });
}

export async function updateWatchTime(uuid: string, time: number) {
  await serverFetch(`/video/last-watched-time/${uuid}`, {
    method: "PUT",
    body: JSON.stringify({ last_watched_time: time }),
  });
  revalidate("/lecture");
  revalidateTag(`lecture-${uuid}`);
  revalidateTag("lectures");
}

/** Chats */
export async function sendChatMessage(chatUuid: string, message: string) {
  const res = await serverFetch(`/chat/send-message/${chatUuid}`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  revalidate("/lecture");
  revalidate("/chat");
  revalidateTag(`lecture-chat-${chatUuid}`);
  return res;
}

export async function getChatMessages(chatUuid: string, page = 1) {
  return serverFetch(`/chat/messages/${chatUuid}?page=${page}`, {
    next: { tags: [`lecture-chat-${chatUuid}`] },
  });
}

/** Quizzes */
export async function getQuizQuestions(quizUuid: string): Promise<any[]> {
  return serverFetch(`/quiz/questions/${quizUuid}`);
}

export async function submitQuizAnswer(quizUuid: string, answers: any[]) {
  revalidate("/lecture");
  revalidate("/quiz");
  return serverFetch(`/quiz/answer/${quizUuid}`, {
    method: "PUT",
    body: JSON.stringify({ answers }),
  });
}
