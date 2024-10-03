import Image from "next/image";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SignupForm } from "@/components/Forms/signup-form";
import Head from "next/head";

export default function Signup() {
  return (
    <>
      <Head>
        <title>Sign Up - Leasy</title>
        <meta
          name="description"
          content="Create an account to get started with Leasy."
        />
      </Head>
      <main className="flex justify-center items-center h-full w-full bg-background p-4">
        <div className="flex flex-col md:flex-row gap-4 rounded-lg w-full md:max-w-5xl">
          {/* Signup Card */}
          <Card className="w-full my-6 min-w-[300px]">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                <span className="hidden md:inline-block">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-link hover:text-link-hover"
                  >
                    Login
                  </Link>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm />
              {/* Mobile Login Link */}
              <Link
                href="/login"
                className={`${buttonVariants({ variant: "outline" })} md:hidden w-full max-w-sm mt-5`}
              >
                Login
              </Link>
            </CardContent>
          </Card>

          {/* Image Section */}
          <div className="flex flex-col justify-center items-center hidden lg:flex">
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
      </main>
    </>
  );
}
