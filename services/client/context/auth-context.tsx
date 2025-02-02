"use client";

import type React from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  waitUntilLoaded: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const resolveRef = useRef<(() => void) | null>(null);

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const userData = await api.auth.getUser();
        return userData;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    },
    staleTime: 1000 * 60,
    retry: false,
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

  const loginMutation = useMutation<
    User,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async (args) => {
      try {
        const result = await api.auth.login(args);
        if (!result) {
          throw new Error("Login failed");
        }
        return result;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["authUser"], data);

      await queryClient.prefetchQuery({
        queryKey: ["lectures", data.uuid],
        queryFn: () => api.lecture.getLectures(),
      });
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
    },
  });

  const signupMutation = useMutation<
    User,
    Error,
    { email: string; password: string; fullName: string }
  >({
    mutationFn: async (args) => {
      try {
        const result = await api.auth.register({
          email: args.email,
          full_name: args.fullName,
          password: args.password,
        });
        if (!result) {
          throw new Error("Signup failed");
        }
        return result;
      } catch (error) {
        console.error("Signup error:", error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      // First update the user data
      queryClient.setQueryData(["authUser"], data);

      // Then prefetch the lectures data
      await queryClient.prefetchQuery({
        queryKey: ["lectures", data.uuid],
        queryFn: () => api.lecture.getLectures(),
      });
    },
    onError: (error) => {
      console.error("Signup mutation error:", error);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<void> => {
    try {
      await signupMutation.mutateAsync({ email, password, fullName });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
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
