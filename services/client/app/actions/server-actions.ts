"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

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
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

/** User */
export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { token } = await serverFetch("/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  cookies().set("LeasyToken", token);
  // revalidate user data
  revalidateTag("user");
  redirect("/dashboard");
}

export async function registerUser(formData: FormData) {
  await serverFetch("/register", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });
  redirect("/login");
}

export async function getUser() {
  return serverFetch("/user", {
    next: { tags: ["user"] },
  });
}

export async function logoutUser() {
  cookies().delete("LeasyToken");
  redirect("/login");
}

/** Lectures */
export async function getLectures() {
  return serverFetch("/lecture", {
    next: { tags: ["lectures"] },
  });
}

export async function getLecture(uuid: string) {
  return serverFetch(`/lecture/${uuid}`, {
    next: { tags: [`lecture-${uuid}`] },
  });
}

export async function updateWatchTime(uuid: string, time: number) {
  await serverFetch(`/video/last-watched-time/${uuid}`, {
    method: "PUT",
    body: JSON.stringify({ last_watched_time: time }),
  });
  revalidateTag(`lecture-${uuid}`);
  revalidateTag("lectures");
}
