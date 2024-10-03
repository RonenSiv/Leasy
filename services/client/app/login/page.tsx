import Image from "next/image";
import React from "react";
import Link from "next/link";
import { LoginForm } from "@/components/Forms/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Head from "next/head";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login - Leasy</title>
        <meta
          name="description"
          content="Login to Leasy to access your account."
        />
      </Head>
      <section className="flex justify-center items-center h-full w-full bg-background p-4">
        <div className="flex flex-col md:flex-row gap-4 rounded-lg w-full md:max-w-5xl">
          {/* Login Card */}
          <Card className="max-md:w-full md:w-1/2 py-5 gap-4 min-md:h-[50vh] h-full min-w-[300px]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                <span className="max-md:hidden">
                  Doesn’t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-link hover:text-link-hover"
                  >
                    Sign Up
                  </Link>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <LoginForm />
              <Link
                href="/signup"
                className={`${buttonVariants({ variant: "outline" })} md:hidden w-full max-w-sm mt-5`}
              >
                Sign Up
              </Link>
            </CardContent>
          </Card>

          {/* Image Section */}
          <div className="flex flex-col justify-center items-center max-md:hidden">
            <Image
              src="/signup.png"
              width={1600}
              height={1600}
              className="w-[30vw] max-sm:w-[50vw] h-auto p-8"
              alt="Signup illustration"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
}
