"use server";
import { getClient } from "@/app/auth/client";
import { redirect } from "next/navigation";
import {
  loginFormValidator,
  registerFormValidator,
} from "@/app/validators/validators";

const loginUser = async (data: FormData) => {
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (!loginFormValidator({ email, password }).result) {
    return;
  }
  await getClient().login({ email, password });
  redirect("/dashboard");
};

const registerUser = async (data: FormData) => {
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const confirmPassword = data.get("confirm-password") as string;
  const fullName = data.get("full-name") as string;

  if (
    !registerFormValidator({ email, password, fullName, confirmPassword })
      .result
  ) {
    return;
  }
  await getClient().signup({ email, password, fullName });
  redirect("/dashboard");
};

export { loginUser, registerUser };
