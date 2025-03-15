"use client";

import { LoginCredentials, RegisterCredentials, User } from "@/types/api-types";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/app/actions/fetcher";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type GoogleLoginState =
  | "idle"
  | "initiated"
  | "success"
  | "error"
  | "cancelled";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  mutate: () => void;
  error: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  loginWithGoogle: () => void;
  googleLoginState: GoogleLoginState;
  resetGoogleLoginState: () => void;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, error, mutate } = useSWR("/user", fetcher.get);
  const router = useRouter();
  const [googleLoginState, setGoogleLoginState] =
    useState<GoogleLoginState>("idle");

  // Reference to store the timestamp when Google login was initiated
  const googleLoginTimestampRef = useRef<number | null>(null);

  // Set a timeout to check if the login process is taking too long,
  // which likely means the user closed the popup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (googleLoginState === "initiated") {
      googleLoginTimestampRef.current = Date.now();

      // If no success/error callback is triggered within 1 minute,
      // assume the user closed the popup
      timeoutId = setTimeout(() => {
        // Only reset if we're still in the initiated state
        if (googleLoginState === "initiated") {
          setGoogleLoginState("cancelled");
        }
      }, 60000); // 1 minute timeout
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [googleLoginState]);

  // Add a window focus event listener to detect when the popup is closed
  useEffect(() => {
    const handleWindowFocus = () => {
      // If login was initiated and we regain focus without a success/error state,
      // the user likely closed the popup
      if (
        googleLoginState === "initiated" &&
        googleLoginTimestampRef.current &&
        Date.now() - googleLoginTimestampRef.current > 1000 // At least 1 second has passed
      ) {
        // Small delay to allow success callback to fire if it's going to
        setTimeout(() => {
          if (googleLoginState === "initiated") {
            setGoogleLoginState("cancelled");
          }
        }, 300);
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [googleLoginState]);

  const resetGoogleLoginState = () => {
    setGoogleLoginState("idle");
    googleLoginTimestampRef.current = null;
  };

  const login = async ({ email, password }: LoginCredentials) => {
    const response = await fetcher.post("/login", { email, password });
    await mutate({
      ...user,
      full_name: response.full_name,
      email: response.email,
    });
    return response;
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoginState("success");
        const response = await fetcher.post("/google-login", {
          token: tokenResponse.access_token,
        });
        await mutate({
          ...user,
          full_name: response.full_name,
          email: response.email,
        });
        toast.success("Login successful!");
        router.push("/dashboard");
        return response;
      } catch (err) {
        console.error("Error sending token:", err);
        toast.error("An error occurred during Google login. Please try again.");
        setGoogleLoginState("error");
      }
    },
    onError: () => {
      console.error("Google Login Failed");
      toast.error("Google login failed. Please try again.");
      setGoogleLoginState("error");
    },
    overrideScope: true,
    scope: "profile email",
  });

  const loginWithGoogle = () => {
    setGoogleLoginState("initiated");
    googleLogin();
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
    return response;
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
        loginWithGoogle,
        googleLoginState,
        resetGoogleLoginState,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
