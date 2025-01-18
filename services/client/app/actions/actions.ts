"use server";
import {
  linkSubmissionSchema,
  registerFormSchema,
} from "@/lib/schemas/useFormSchema";
import { authService } from "@/services/auth-service";

export type FormState = {
  success: boolean | undefined;
  fields?: Record<string, string>;
  issues?: string[];
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
  const client = await authService.register({
    full_name: fullName,
    email,
    password,
    phone_number: "",
  });
  return {
    success: true,
    fields: {
      ...client,
    },
  };
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

export { registerUser, submitLink };
