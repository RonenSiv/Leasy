"use client";

import React, { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-api-service";

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60,
  });

  const loginMutation = useMutation({
    mutationFn: (args: { email: string; password: string }) =>
      authService.login(args.email, args.password),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (args: { email: string; password: string; fullName: string }) =>
      authService.signup(args.email, args.password, args.fullName),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
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
