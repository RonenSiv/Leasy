"use client";
import React, { useState } from "react";
import { FormField } from "@/app/components/Forms/FormField";
import { loginUser } from "@/app/actions/actions";
import { loginFormValidator } from "@/app/validators/validators";

export const LoginForm = () => {
  const [isInvalidLogin, setIsInvalidLogin] = useState<boolean>(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const handleLoginValidation = (data: FormData) => {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    if (!loginFormValidator({ email, password }).result) {
      setIsInvalidLogin(true);
      return false;
    }
    return true;
  };
  return (
    <form
      className="max-w-sm mx-auto mt-5"
      action={(data) => loginUser(data)}
      ref={formRef}
    >
      <FormField
        label="Your email"
        type="email"
        placeholder="you@example.com"
        status={isInvalidLogin ? "error" : "none"}
        name="email"
        onChange={() => setIsInvalidLogin(false)}
        required
      />
      <FormField
        label="Your password"
        type="password"
        placeholder="Enter your password"
        status={isInvalidLogin ? "error" : "none"}
        name="password"
        onChange={() => setIsInvalidLogin(false)}
        required
      />
      {isInvalidLogin && (
        <div className="pb-5 text-red-500">Invalid email or password</div>
      )}
      <button
        type="submit"
        className="text-white dark:text-gray-800 bg-action hover:bg-[#41e084] dark:hover:bg-[#2CA15D] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        onClick={(e) => {
          handleLoginValidation(new FormData(formRef.current!));
        }}
      >
        Login
      </button>
    </form>
  );
};
