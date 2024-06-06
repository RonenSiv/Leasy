import Image from "next/image";
import { CardGrid } from "@/app/components/ui/cards/CardGrid";
import React from "react";
import { Card } from "@/app/components/ui/cards/Card";
import Link from "next/link";
import { SignupForm } from "@/app/components/Forms/SignupForm";

export default function Signup() {
  return (
    <CardGrid cols={2}>
      <div className="my-auto">
        <Card
          title="Sign Up"
          subtitle={
            <p className={"max-md:hidden"}>
              Already have an account?{" "}
              <Link href={"/login"} className={"text-action"}>
                {" "}
                Login
              </Link>
            </p>
          }
        >
          <div className="flex flex-col gap-4">
            <SignupForm />
            <Link
              href={"/login"}
              className={
                "md:hidden text-blue-700 dark:text-blue-600 bg-blue-200 hover:bg-[#3b82f6] dark:hover:bg-[#3b92f6] dark:hover:text-gray-50 hover:text-gray-50 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
              }
            >
              Login
            </Link>
          </div>
        </Card>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/signup.png"
          width="1600"
          height="1600"
          className="w-[30vw] max-sm:w-[50vw] h-auto p-8"
          alt="auth picture"
          priority
        />
      </div>
    </CardGrid>
  );
}
