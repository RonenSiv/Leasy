"use client";
import React, { useRef } from "react";
import { FormField } from "@/components/Forms/form-field";
import { loginUser } from "@/app/actions/actions";
import { useForm } from "react-hook-form";
import { loginFormSchema, LoginFormSchema } from "@/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";

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
      className="max-w-sm mt-5"
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
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};
