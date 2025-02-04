"use client";

import useSWR from "swr";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/app/actions/server-actions";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("User fetch failed");
    return res.json();
  });

export function useUser() {
  const { data, error, mutate } = useSWR("/api/user", fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    dedupingInterval: 1000,
  });

  return {
    user: data,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
    handleLogin: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await loginUser({ email, password });
      return result;
    },
    handleRegister: async ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const result = await registerUser({ name: fullName, email, password });
      return result;
    },
    handleLogout: async () => {
      const result = await logoutUser();
      if (result && result.success) {
        await mutate(null, false);
      }
      return result;
    },
  };
}
