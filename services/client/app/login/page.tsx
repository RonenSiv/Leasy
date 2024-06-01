import Image from "next/image";
import { CardGrid } from "@/app/components/ui/cards/CardGrid";
import React from "react";
import { Card } from "@/app/components/ui/cards/Card";
import Link from "next/link";
import { LoginForm } from "@/app/components/Forms/LoginForm";

export default function Login() {
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
          <LoginForm />
          {/*<Form />*/}
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
