"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api";

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  waitUntilLoaded: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const resolveRef = useRef<(() => void) | null>(null);

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: api.auth.getUser,
    staleTime: 1000 * 60,
  });

  const waitUntilLoaded = () => {
    if (!isLoading) return Promise.resolve();
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve;
    });
  };

  useEffect(() => {
    if (!isLoading && resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  }, [isLoading]);

  const loginMutation = useMutation({
    mutationFn: (args: { email: string; password: string }) =>
      api.auth.login(args),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (args: { email: string; password: string; fullName: string }) =>
      api.auth.register({
        email: args.email,
        full_name: args.fullName,
        password: args.password,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const signup = async (email: string, password: string, fullName: string) => {
    await signupMutation.mutateAsync({ email, password, fullName });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    waitUntilLoaded,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
