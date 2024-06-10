import Image from "next/image";
import React from "react";
import { Card } from "@/app/components/ui/cards/Card";
import Link from "next/link";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SignupForm } from "@/components/Forms/SignupForm";

export default function Signup() {
  return (
    <div
      className={
        "flex flex-col md:flex-row gap-4 bg-background rounded-lg items-center h-full w-screen md:max-w-5xl max-w-md md:px-20"
      }
    >
      <Card className={"w-full py-5 gap-4  min-w-[300px]"}>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            <span className={"max-md:hidden"}>
              Already have an account?{" "}
              <Link
                href={"/login"}
                className={"text-link hover:text-link-hover"}
              >
                {" "}
                Login
              </Link>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className={"h-full"}>
          <SignupForm />
          <Link
            href={"/login"}
            className={`${buttonVariants({ variant: "outline" })} md:hidden w-full max-w-sm mt-5`}
          >
            Login
          </Link>
        </CardContent>
      </Card>
      <div className="flex flex-col justify-center items-center max-lg:hidden">
        <Image
          src="/signup.png"
          width="1600"
          height="1600"
          className="w-[30vw] max-sm:w-[50vw] h-auto p-8"
          alt="auth picture"
          priority
        />
      </div>
    </div>
  );
}
