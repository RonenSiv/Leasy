import { createSession, endSession } from "@/app/api/auth/session-management";

export interface FormData {
  email: string;
  password: string;
}

interface SignupFormData extends FormData {
  fullName: string;
}

export const login = async (data: FormData) => {
  // TODO fetch real data
  const user = {
    email: data.email,
    password: data.password,
  };

  await createSession(user);
};

export const logout = async () => {
  await endSession();
};

export const signup = async (data: SignupFormData) => {
  const createdUser = data;
  await createSession(createdUser);
};
