// components/authentication-not-found.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/forms/login-form";
import { SignupForm } from "@/components/forms/signup-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientImage } from "@/components/client-image";
import { useMediaQuery } from "usehooks-ts";
import { AuthenticationSkeleton } from "@/app/authentication/auth-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const WelcomeCard = ({
  isLogin,
  onToggle,
}: {
  isLogin: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      className="w-full sm:w-1/2 bg-emerald-500 text-white p-12"
      initial={{ x: isLogin ? "0%" : "100%" }}
      animate={{ x: isLogin ? "0%" : "100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6 flex flex-col justify-between h-full"
      >
        <div>
          <h2 className="text-4xl font-bold">
            {isLogin ? "Welcome Back!" : "Hey there! 👋"}
          </h2>
          <p className="text-lg">
            {isLogin
              ? "To keep connected with us please authenticate with your personal info"
              : "Enter your personal details and start your journey with us"}
          </p>
        </div>
        <div className={`flex justify-center w-full space-x-2`}>
          <ClientImage src="/signup.png" alt="Login" className="w-2/3 h-auto" />
        </div>
        <div>
          <p>
            {isLogin ? "New to Leasy?" : "Already have an account with Leasy?"}
          </p>
          <Button
            variant="outline"
            className="w-full bg-transparent border-white text-white hover:bg-white hover:text-emerald-500"
            onClick={onToggle}
          >
            {isLogin ? "SIGN UP" : "SIGN IN"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isScreenWide = useMediaQuery("(min-width: 640px)");

  const toggleView = () => setIsLogin(!isLogin);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <AuthenticationSkeleton />;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex sm:items-center justify-center flex-1 w-full">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-xl">
          <div className="flex flex-col sm:flex-row">
            {mounted && isScreenWide && (
              <WelcomeCard isLogin={isLogin} onToggle={toggleView} />
            )}
            <motion.div
              className={`${
                mounted && isScreenWide ? "sm:w-1/2" : "w-full"
              } bg-background p-12 flex flex-col max-sm:rounded-xl`}
              initial={
                mounted && isScreenWide
                  ? { x: isLogin ? "0%" : "-100%" }
                  : undefined
              }
              animate={
                mounted && isScreenWide
                  ? { x: isLogin ? "0%" : "-100%" }
                  : undefined
              }
              transition={
                mounted && isScreenWide
                  ? { duration: 0.5, ease: "easeInOut" }
                  : undefined
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 "
              >
                <h2 className="text-3xl font-bold">
                  {isLogin ? "Sign in to Leasy" : "Create Account"}
                </h2>
                <ScrollArea className="sm:h-[calc(100vh-300px)] w-full">
                  {isLogin ? <LoginForm /> : <SignupForm />}
                </ScrollArea>
                {!mounted || !isScreenWide ? (
                  <div className="font-thin">
                    {isLogin
                      ? "New to Leasy? "
                      : "Already have an account with Leasy? "}
                    <span
                      className="cursor-pointer text-emerald-500 underline"
                      onClick={toggleView}
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </span>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
