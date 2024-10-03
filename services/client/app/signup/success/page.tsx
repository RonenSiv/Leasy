import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle } from "lucide-react"; // Icon for success indication

export default function PostSignup() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="w-full p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Signup Successful! 🎉
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-400">
            Welcome to <span className={"font-bold"}>Leasy</span> 👋 Please
            verify your email to activate your account and unlock all the
            features.
          </p>
          <p className="text-sm text-muted-foreground">
            Check your inbox for the verification email. Didn’t receive it?{" "}
            <span className="text-primary hover:underline cursor-pointer">
              Resend
            </span>
          </p>

          <div className="flex justify-center mt-6">
            <Link href="/dashboard/video">
              <Button className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 ease-out">
                Continue to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
