import Image from "next/image";
import { CardGrid } from "@/app/components/Cards/CardGrid";
import React from "react";
import { Card } from "@/app/components/Cards/Card";
import Link from "next/link";
import { SignupForm } from "@/app/components/Forms/SignupForm";

export default function Signup() {
  return (
    <CardGrid cols={2}>
      <div className="my-auto">
        <Card
          title="Sign Up"
          subtitle={
            <p>
              Already have an account?{" "}
              <Link href={"/login"} className={"text-action"}>
                {" "}
                Login Up
              </Link>
            </p>
          }
        >
          <SignupForm />
        </Card>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/signup.png"
          width="1600"
          height="1600"
          className="w-[30vw] max-sm:w-[50vw] h-auto"
          alt="auth picture"
          priority
        />
      </div>
    </CardGrid>
  );
}
