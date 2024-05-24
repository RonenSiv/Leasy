"use client";
import React, { FormEventHandler, useState } from "react";
import { FormField } from "@/app/components/FormField";
import validator from "validator";

interface LoginFormProps {
  setFormData: (data: { email: string; password: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ setFormData }) => {
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

  const emailStatus = isEmailError ? "error" : undefined;
  const passwordStatus = isPasswordError ? "error" : undefined;
  const emailStatusMsg = isEmailError ? "Invalid email address" : undefined;
  const passwordStatusMsg = isPasswordError
    ? "Invalid password, check password requires"
    : undefined;
  const informativeLabelMessage =
    "Password must be at least 8 characters long and contain: uppercase letter, number and a symbol";

  const handleLogin: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const isValidEmail = validator.isEmail(email);
    const isStrongPassword = validator.isStrongPassword(password);

    setIsEmailError(!isValidEmail);
    setIsPasswordError(!isStrongPassword);

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
        status={emailStatus}
        statusMessage={emailStatusMsg}
        name="email"
        required
      />
      <FormField
        label="Your password"
        type="password"
        placeholder="Enter your password"
        status={passwordStatus}
        statusMessage={passwordStatusMsg}
        informativeLabel
        informativeLabelMessage={informativeLabelMessage}
        name="password"
        required
      />
      <button
        type="submit"
        className="text-white bg-[#2CA15D] hover:bg-[#1F7D45] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        Login
      </button>
    </form>
  );
};
