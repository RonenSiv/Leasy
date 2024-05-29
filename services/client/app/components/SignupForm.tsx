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

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
    number: false,
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({ ...errors, password: false });
    const password = e.target.value;
    setPasswordCriteria({
      length: password.length >= 10,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      number: /[0-9]/.test(password),
    });
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
        name="password"
        onChange={handlePasswordChange}
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
      <ul className="max-w-md space-y-1 list-inside text-gray-400 text-sm my-2">
        <li className="flex items-center">
          <svg
            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill={passwordCriteria.length ? "#39CF78" : "#d1d5db"}
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          At least 8 characters
        </li>
        <li className="flex items-center">
          <svg
            className="w-3.5 h-3.5 me-2 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill={
              passwordCriteria.uppercase && passwordCriteria.lowercase
                ? "#39CF78"
                : "#d1d5db"
            }
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          At least one lowercase character and one uppercase character
        </li>
        <li className="flex items-center">
          <svg
            className="w-3.5 h-3.5 me-2 flex-shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill={
              passwordCriteria.number && passwordCriteria.specialChar
                ? "#39CF78"
                : "#d1d5db"
            }
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          At least one number and special character, e.g., ! @ #
        </li>
      </ul>

      <button
        type="submit"
        className="text-white dark:text-gray-800 bg-action hover:bg-[#41e084] dark:hover:bg-[#2CA15D] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        Sign Up
      </button>
    </form>
  );
};
