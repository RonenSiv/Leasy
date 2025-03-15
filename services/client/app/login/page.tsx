import { Suspense } from "react";
import { LoginForm } from "@/app/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-background/60 rounded-3xl shadow-2xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Log in to your account
          </p>
          <Suspense
            fallback={
              <div className="text-foreground text-center">Loading...</div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
