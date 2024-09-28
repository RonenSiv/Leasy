"use client";
import React, { useEffect, useState } from "react";
import { FormField } from "@/components/Forms/form-field";
import { registerUser } from "@/app/actions/actions";
import { useForm } from "react-hook-form";
import {
  registerFormSchema,
  RegisterFormSchema,
} from "@/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

export const SignupForm = () => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  const [state, formAction] = useFormState(registerUser, {
    success: undefined,
  });

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const password = watch("password", "");

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  return (
    <form
      className="max-w-sm mt-5"
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        state.success = false;
        handleSubmit(() => {
          formAction(new FormData(formRef.current!));
        })(e);
      }}
      ref={formRef}
    >
      <FormField
        label="Your email"
        type="email"
        placeholder="you@example.com"
        status={errors.email ? "error" : "none"}
        statusMessage={errors.email?.message}
        name="email"
        register={register("email")}
        required
      />
      <FormField
        label="Password"
        type="password"
        placeholder="Password"
        status={errors.password ? "error" : "none"}
        statusMessage={errors.password?.message}
        name="password"
        register={register("password")}
        required
      />
      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Re-enter Password"
        status={errors.confirmPassword ? "error" : "none"}
        statusMessage={errors.confirmPassword?.message}
        name="confirmPassword"
        register={register("confirmPassword")}
        required
      />
      <FormField
        label="Full Name"
        type="text"
        placeholder="John Doe"
        status={errors.fullName ? "error" : "none"}
        statusMessage={errors.fullName?.message}
        name="fullName"
        register={register("fullName")}
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
          At least one number and special character, e.g., ! @
        </li>
      </ul>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
};
