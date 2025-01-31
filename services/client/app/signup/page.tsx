import { Suspense } from "react";
import { SignupForm } from "../components/forms/signup-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.20))] flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Sign up for Leasy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <SignupForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
