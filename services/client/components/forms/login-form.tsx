"use client";

import React from "react";
import { FormField } from "@/components/forms/form-field";
import { useForm } from "react-hook-form";
import { loginFormSchema, LoginFormSchema } from "@/lib/schemas/useFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useClient } from "@/providers/client-provider";

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useClient();

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
      const response = login(data.email, data.password);

      await toast.promise(response, {
        loading: "Logging in...",
      });

      const user = await response;
      if (!user) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Logged in successfully");
      return user;
    },
  });

  const onSubmit = async (data: LoginFormSchema) => {
    const user = await loginMutation.mutateAsync(data);
    console.log("logg in user", user);
    if (!user) return;
    router.push("/dashboard/video");
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
