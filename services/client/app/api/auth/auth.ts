import { createSession, endSession } from "@/app/api/auth/session-management";

export interface formData {
  email: string;
  password: string;
}

export const login = async (data: formData) => {
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
