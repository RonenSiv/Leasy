import Image from "next/image";
import { CardGrid } from "@/app/components/CardGrid";
import React from "react";
import { Card } from "@/app/components/Card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormData, signup } from "@/app/model/auth/auth";
import { SignupForm } from "@/app/components/SignupForm";

interface SignUpFormData extends FormData {
  fullName: string;
}

export default function Signup() {
  const setFormData = async (data: SignUpFormData) => {
    "use server";
    // TODO: handle logic when DB is present
    await signup(data);
    redirect("/");
  };

  return (
    <CardGrid cols={2}>
      <div className="my-auto">
        <Card
          title="Sign Up"
          subtitle={
            <p>
              Already have an account?{" "}
              <Link href={"/login"} className={"text-[#2CA15D]"}>
                {" "}
                Login Up
              </Link>
            </p>
          }
        >
          <SignupForm setFormData={setFormData} />
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
