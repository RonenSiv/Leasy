"use client";
import React, { FormEventHandler, useState } from "react";
import { FormField } from "@/app/components/FormField";
import validator from "validator";

interface LoginFormProps {
  setFormData: (data: { email: string; password: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setFormData }) => {
  const [isInvalidLogin, setIsInvalidLogin] = useState<boolean>(false);

  const handleLogin: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const isValidEmail = validator.isEmail(email);
    const isStrongPassword = validator.isStrongPassword(password);

    setIsInvalidLogin(!isValidEmail || !isStrongPassword);

    if (isValidEmail && isStrongPassword) {
      setFormData({ email, password });
    }
  };

  return (
    <form className="max-w-sm mx-auto mt-5" onSubmit={handleLogin}>
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
        className="text-white bg-[#2CA15D] hover:bg-[#1F7D45] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        Login
      </button>
    </form>
  );
};
