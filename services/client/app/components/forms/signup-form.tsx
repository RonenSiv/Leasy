"use client";

import { useState } from "react";
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
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import zxcvbn from "zxcvbn";
import { useAuth } from "@/context/auth-context";
import { useGoogleAuthPopup } from "@/hooks/use-google-auth-popup";

const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const authURL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8000/auth";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // we'll now store the percentage strength (0–100)
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const { register } = useAuth();
  const { loading: googleAuthLoading, openGooglePopup } = useGoogleAuthPopup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  // Use zxcvbn to get a real strength score (0 to 4) and convert it to percentage
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    const result = zxcvbn(password);
    return (result.score / 4) * 100;
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await register(data);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    openGooglePopup(`${authURL}/google`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="John Doe" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setPasswordStrength(
                        calculatePasswordStrength(e.target.value),
                      );
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <Progress value={passwordStrength} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Password strength: {Math.round(passwordStrength)}%
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign up"
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
        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={handleGoogleLogin}
          disabled={googleAuthLoading}
        >
          {googleAuthLoading ? (
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
        <Link href="/login" className="text-sm text-primary hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </Form>
  );
}
