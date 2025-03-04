"use client";

import { LoginCredentials, RegisterCredentials, User } from "@/types/api-types";
import type React from "react";
import { createContext, useContext } from "react";
import useSWR from "swr";
import { fetcher } from "@/app/actions/fetcher";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  mutate: () => void;
  error: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, error, mutate } = useSWR("/user", fetcher.get);
  const login = async ({ email, password }: LoginCredentials) => {
    const response = await fetcher.post("/login", { email, password });
    await mutate({
      ...user,
      full_name: response.full_name,
      email: response.email,
    });
    return response.json();
  };

  const register = async ({
    email,
    password,
    full_name,
  }: RegisterCredentials) => {
    const response = await fetcher.post("/register", {
      email,
      password,
      full_name,
    });
    await mutate();
    return response.json();
  };

  const logout = async () => {
    await fetcher.post("/logout");
    await mutate(null);
  };

  const checkAuth = async () => {
    const response = await fetcher.get("/user");
    await mutate();
    return response.json();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !user && !error,
        mutate,
        error: !!error,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
