import Image from "next/image";
import { CardGrid } from "@/app/components/CardGrid";
import React from "react";
import { Card } from "@/app/components/Card";
import Link from "next/link";
import { LoginForm } from "@/app/components/LoginForm";
import { redirect } from "next/navigation";
import { FormData, login } from "@/app/api/auth/auth";

export default function Login() {
  const setFormData = async (data: FormData) => {
    "use server";
    // TODO: handle logic when DB is present
    await login(data);
    redirect("/");
  };

  return (
    <CardGrid cols={2}>
      <div className="my-auto">
        <Card
          title="Login"
          subtitle={
            <p>
              Doesn’t have an account?{" "}
              <Link href={"/signup"} className={"text-[#2CA15D]"}>
                {" "}
                Sign Up
              </Link>
            </p>
          }
        >
          <LoginForm setFormData={setFormData} />
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
