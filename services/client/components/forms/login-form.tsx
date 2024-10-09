// components/forms/login-form.tsx
"use client";

import React from "react";
import { FormField } from "@/components/forms/form-field";
import { loginUser } from "@/app/actions/actions";
import { useForm } from "react-hook-form";
import { loginFormSchema, LoginFormSchema } from "@/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

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

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormSchema) => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const prevState = { success: undefined, fields: {}, issues: [] };
      const response = loginUser(prevState, formData);
      await toast.promise(response, {
        loading: "Logging in...",
        success: "Login successful!",
        error: "Login failed: " + response.then((r) => r?.issues?.join(", ")),
      });

      return response;
    },
  });

  const onSubmit = (data: LoginFormSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <form className="max-w-sm mt-5" onSubmit={handleSubmit(onSubmit)}>
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

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
