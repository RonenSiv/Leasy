import {
  createSession,
  endSession,
  getCurrentSession,
} from "@/app/model/auth/session-management";

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

export const isLoggedIn = async () => {
  // check if user is logged in
  const session = await getCurrentSession();
  console.log("session", session);
  return !!session;
};
