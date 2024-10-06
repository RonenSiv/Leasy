"use client";
import React from "react";
import { FormField } from "@/components/forms/form-field";
import { loginUser } from "@/app/actions/actions";
import { useForm } from "react-hook-form";
import { loginFormSchema, LoginFormSchema } from "@/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const prevState = { success: undefined, fields: {}, issues: [] };

      const response = await loginUser(prevState, formData);
      if (response.success) {
        console.log("Login successful!");
      } else {
        console.log("Login failed!", response.issues);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <form className="max-w-sm mt-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Email Field */}
      <FormField
        label="Your email"
        type="email"
        placeholder="you@example.com"
        status={errors.email ? "error" : "none"}
        statusMessage={errors.email ? errors.email.message : ""}
        name="email"
        register={register("email")}
        required
      />

      {/* Password Field */}
      <FormField
        label="Password"
        type="password"
        placeholder="Password"
        status={errors.password ? "error" : "none"}
        statusMessage={errors.password ? errors.password.message : ""}
        name="password"
        register={register("password")}
        required
      />

      {(errors.email || errors.password) && (
        <div className="pb-5 text-red-500">Invalid email or password</div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
