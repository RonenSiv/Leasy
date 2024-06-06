"use client";
import React, { useRef } from "react";
import { FormField } from "@/app/components/Forms/FormField";
import { loginUser } from "@/app/actions/actions";
import { useForm } from "react-hook-form";
import {
  loginFormSchema,
  LoginFormSchema,
} from "@/app/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(loginUser, {
    success: undefined,
  });

  return (
    <form
      className="max-w-sm mx-auto mt-5"
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        state.success = false;
        handleSubmit(() => {
          formAction(new FormData(formRef.current!));
        })(e);
      }}
    >
      <FormField
        label="Your email"
        type="email"
        placeholder="you@example.com"
        status={
          errors.password ||
          errors.email ||
          (state.success !== undefined && !state.success)
            ? "error"
            : "none"
        }
        statusMessage={""}
        name="email"
        register={register("email")}
        required
      />

      <FormField
        label="Password"
        type="password"
        placeholder="Password"
        status={
          errors.password ||
          errors.email ||
          (state.success !== undefined && !state.success)
            ? "error"
            : "none"
        }
        statusMessage={""}
        name="password"
        register={register("password")}
        required
      />
      {errors.email && (
        <div className="pb-5 text-red-500">Invalid email or password</div>
      )}
      <button
        type="submit"
        className="text-white dark:text-gray-800 bg-action hover:bg-[#41e084] dark:hover:bg-[#2CA15D] font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        Login
      </button>
    </form>
  );
};
