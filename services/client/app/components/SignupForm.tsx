"use client";
import React, { FormEventHandler, useEffect, useState } from "react";
import { FormField, FormFieldStatus } from "@/app/components/FormField";
import validator from "validator";

interface FormData {
  email: string;
  password: string;
  fullName: string;
}

interface SignupFormProps {
  setFormData: (data: FormData) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ setFormData }) => {
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
    rePassword: false,
    fullName: false,
  });

  const [status, setStatus] = useState<{
    [key: string]: FormFieldStatus | undefined;
  }>({
    email: undefined,
    password: undefined,
    rePassword: undefined,
    fullName: undefined,
  });

  const statusMsg = {
    email: "Invalid email format",
    password: "Invalid password, check password requirements",
    rePassword: "Passwords do not match",
    fullName: "Invalid name length",
  };

  useEffect(() => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      email: errors.email ? "error" : undefined,
      password: errors.password ? "error" : undefined,
      rePassword: errors.rePassword ? "error" : undefined,
      fullName: errors.fullName ? "error" : undefined,
    }));
  }, [errors]);

  const handleValidation = (formData: FormData & { rePassword: string }) => {
    const fullNameValidator = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
    const isValidEmail = validator.isEmail(formData.email);
    const isStrongPassword = validator.isStrongPassword(formData.password);
    const isValidName = fullNameValidator.test(formData.fullName);
    const arePasswordsEqual = validator.equals(
      formData.password,
      formData.rePassword,
    );

    setErrors({
      email: !isValidEmail,
      password: !isStrongPassword,
      rePassword: !arePasswordsEqual,
      fullName: !isValidName,
    });

    return isValidEmail && isStrongPassword && isValidName && arePasswordsEqual;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const {
      email,
      password,
      "confirm-password": rePassword,
      "full-name": fullName,
    } = Object.fromEntries(formData.entries());

    if (
      handleValidation({
        email: email ? (email as string) : "",
        password: password ? (password as string) : "",
        rePassword: rePassword ? (rePassword as string) : "",
        fullName: fullName ? (fullName as string) : "",
      })
    ) {
      setFormData({
        email: email ? (email as string) : "",
        password: password ? (password as string) : "",
        fullName: fullName ? (fullName as string) : "",
      });
    }
  };

  return (
    <form className="max-w-sm mx-auto mt-5" onSubmit={handleSubmit}>
      <FormField
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        status={status.email}
        statusMessage={statusMsg.email}
        name="email"
        onChange={() => setErrors({ ...errors, email: false })}
        required
      />
      <FormField
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        status={status.fullName}
        statusMessage={statusMsg.fullName}
        name="full-name"
        informativeLabel
        informativeLabelMessage="Name must be at least 2 words, each between 2 and 40 characters"
        onChange={() => setErrors({ ...errors, fullName: false })}
        required
      />
      <FormField
        label="Password"
        type="password"
        placeholder="Enter your password"
        status={status.password}
        statusMessage={statusMsg.password}
        informativeLabel
        informativeLabelMessage="Password must be at least 8 characters long and contain: uppercase letter, number and a symbol"
        name="password"
        onChange={() => setErrors({ ...errors, password: false })}
        required
      />
      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Enter your password"
        status={status.rePassword || status.password}
        statusMessage={statusMsg.rePassword || statusMsg.password}
        name="confirm-password"
        onChange={() => setErrors({ ...errors, rePassword: false })}
        required
      />
      <button
        type="submit"
        className="text-white bg-[#2CA15D] hover:bg-[#1F7D45] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        Sign Up
      </button>
    </form>
  );
};
