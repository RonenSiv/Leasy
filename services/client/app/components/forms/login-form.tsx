"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth-context";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormData = z.infer<typeof loginSchema>;

// Helper to open a centered popup
const popupCenter = (url: string, title: string) => {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width = window.innerWidth || document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  const systemZoom = width / window.screen.availWidth;

  const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
  const top = (height - 550) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    url,
    title,
    `width=${500 / systemZoom},height=${
      550 / systemZoom
    },top=${top},left=${left}`,
  );

  if (newWindow) {
    newWindow.focus();
  }
  return newWindow;
};

const authURL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8000/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false); // for email/password login
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false); // for Google flow
  const [showPassword, setShowPassword] = useState(false);

  const popUpRef = useRef<Window | null>(null);
  const router = useRouter();
  const { login, checkAuth } = useAuth();

  // Build your form with react-hook-form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });
      if (result?.email) {
        toast.success("Login successful!");
        window.location.href = "/dashboard";
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

  /**
   * Google login button click
   */
  const handleGoogleLogin = async () => {
    try {
      // Show loader/spinner on the button
      setGoogleAuthLoading(true);

      // Open the popup
      popUpRef.current = popupCenter(`${authURL}/google`, "Google Login");

      // If we fail to open a popup
      if (!popUpRef.current) {
        setGoogleAuthLoading(false);
        toast.error("Unable to open popup.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setGoogleAuthLoading(false);
    }
  };

  /**
   * 1) Detect if popup is manually closed by the user
   *    We'll poll every half-second while googleAuthLoading is true
   */
  useEffect(() => {
    if (!googleAuthLoading || !popUpRef.current) return;

    const timer = setInterval(() => {
      if (popUpRef.current && popUpRef.current.closed) {
        clearInterval(timer);
        setGoogleAuthLoading(false);
        toast.error("Popup closed before login.");
      }
    }, 500);

    // Cleanup
    return () => clearInterval(timer);
  }, [googleAuthLoading]);

  /**
   * 2) Listen for "google-auth-success" messages from the popup
   *    (In case your backend or final page calls window.opener.postMessage)
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // If you want to trust only your backend domain, check event.origin
      if (event.data === "google-auth-success") {
        // We got success!
        popUpRef.current?.close();
        setGoogleAuthLoading(false);

        toast.success("Login successful!");
        router.push("/dashboard");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    onClick={() => setShowPassword(!showPassword)}
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
        <Button type="submit" className="w-full" disabled={isLoading}>
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

        {/* Google login button */}
        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={handleGoogleLogin}
          disabled={googleAuthLoading} // disable while loading
        >
          {googleAuthLoading ? (
            // Show a loading spinner if googleAuthLoading is true
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
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
      </div>

      <div className="mt-4 text-center">
        <Link href="/signup" className="text-sm text-primary hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </Form>
  );
}
