"use server";
import { getClient } from "@/auth/client";
import { redirect } from "next/navigation";
import {
  linkSubmissionSchema,
  loginFormSchema,
  registerFormSchema,
} from "@/lib/schemas/useFormSchema";

export type FormState = {
  success: boolean | undefined;
  fields?: Record<string, string>;
  issues?: string[];
};

const loginUser = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const formData = Object.fromEntries(data);
  const parsed = loginFormSchema.safeParse(formData);
  const { email, password } = parsed.data || {};
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      success: false,
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  await getClient().login({ email, password });
  redirect("/dashboard");
  return { success: true };
};

const registerUser = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const formData = Object.fromEntries(data);
  const parsed = registerFormSchema.safeParse(formData);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      success: false,
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const { email, password, fullName } = parsed.data;
  await getClient().signup({ email, password, fullName });
  redirect("/dashboard");
  return { success: true };
};

const submitLink = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const formData = Object.fromEntries(data);
  const parsed = linkSubmissionSchema.safeParse(formData);
  console.log(parsed.data);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      success: false,
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
  const { url } = parsed.data;
  return { success: true };
};

export { loginUser, registerUser, submitLink };
