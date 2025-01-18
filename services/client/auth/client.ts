import axios from "axios";
import { endSession, getSession, startSession } from "@/auth/auth";
import { encrypt } from "@/auth/auth-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface FormData {
  email?: string;
  password?: string;
}

export interface SignupFormData extends FormData {
  fullName: string;
}

export const getClient = () => {
  const login = async (data: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/api/login`, data);
    if (response.status !== 200) {
      throw new Error("Invalid authentication");
    }
    return {
      email: data.email,
      fullName: response.data.full_name,
    };
  };

  const logout = () => {
    endSession();
  };

  const signup = async (data: SignupFormData) => {
    if (process.env.NODE_ENV === "development") {
      await startSession({ email: data.email, password: data.password });
      return await encrypt({
        email: data.email,
        password: data.password,
      });
    }
    const response = await axios.post(`${API_BASE_URL}/api/register`, data);
    if (response.status !== 200) {
      throw new Error("Invalid signup");
    }
    const token = response.data.token;
    if (!token) {
      throw new Error("Invalid signup");
    }
    return token;
  };

  const loggedIn = async () => {
    if (process.env.NODE_ENV === "development") {
      return (await getSession()) !== null;
    }
  };

  const auth = () => {
    const getData = async () => {
      if (process.env.NODE_ENV === "development") {
        return getSession();
      }
      const accessToken = getSession();
      const response = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    };

    const getAccessToken = async () => {
      if (process.env.NODE_ENV === "development") {
        const session = await getSession();
        return session;
      }
      const response = await axios.get("/api/refresh", {
        headers: {
          Authorization: `Bearer ${await getSession()}`,
        },
      });
      return response.data.accessToken;
    };

    return {
      getData,
      getAccessToken,
    };
  };

  return {
    login,
    logout,
    signup,
    loggedIn,
    auth,
  };
};
