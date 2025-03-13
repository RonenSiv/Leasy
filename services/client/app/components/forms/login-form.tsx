"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import Link from "next/link";

// Zod schema for the login form
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  // States for normal email/password flow
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle, googleLoginState, resetGoogleLoginState } =
    useAuth();
  const router = useRouter();

  // Setup react-hook-form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (googleLoginState === "success") {
      setIsGoogleLoading(false);
      resetGoogleLoginState();
    } else if (
      googleLoginState === "error" ||
      googleLoginState === "cancelled"
    ) {
      setIsGoogleLoading(false);
      resetGoogleLoginState();

      if (googleLoginState === "cancelled") {
        toast.error("Google login was cancelled");
      }
    }
  }, [googleLoginState, resetGoogleLoginState]);

  const startGoogleLoginFlow = () => {
    setIsGoogleLoading(true);
    loginWithGoogle();
  };

  // On submit for email+password
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });
      if (result?.email) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="you@example.com"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Button */}
        <Button
          variant="outline"
          className="w-full mt-6"
          disabled={isLoading || isGoogleLoading}
          onClick={startGoogleLoginFlow}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in with Google...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504
                         110.8 504 0 393.2 0 256S110.8 8 248 8c66.8
                         0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6
                         94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7
                         156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1
                         c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Continue with Google
            </>
          )}
        </Button>
        <div className="mt-4 text-center">
          <Link href="/signup" className="text-sm text-primary hover:underline">
            Don't have an account yet? Sign up
          </Link>
        </div>
      </div>
    </Form>
  );
}
