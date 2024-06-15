import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const registerFormSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    fullName: z
      .string()
      .min(1, "Full name is required")
      .refine(
        (value) =>
          value.split(" ").filter((word) => word.length >= 2).length >= 2,
        "Full name must contain at least 2 words with at least 2 characters each",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const linkSubmissionSchema = z.object({
  url: z.string().url(),
});

export const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  bio: z.string().max(160, "Bio must be at most 160 characters long"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type LinkSubmissionSchema = z.infer<typeof linkSubmissionSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
