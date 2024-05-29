"use client";

import Image from "next/image";
import { CardGrid } from "@/app/components/CardGrid";
import React from "react";
import { Card } from "@/app/components/Card";
import Link from "next/link";
import { LoginForm } from "@/app/components/LoginForm";
import { FormData, getClient } from "@/app/auth/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const LoginNoSsr = dynamic(() => Promise.resolve(LoginComp), {
  ssr: false,
});

function LoginComp() {
  const router = useRouter();

  const setFormData = async (data: FormData) => {
    const { email, password } = data;
    await getClient().login({ email, password });
    router.push("/dashboard");
  };

  return (
    <CardGrid cols={2}>
      <div className="my-auto">
        <Card
          title="Login"
          subtitle={
            <p>
              Doesn’t have an account?{" "}
              <Link href={"/signup"} className={"text-action"}>
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

export default function Login() {
  return <LoginNoSsr />;
}
