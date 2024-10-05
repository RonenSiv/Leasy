import axios from "axios";
import { endSession, getSession, startSession } from "@/auth/auth";
import { encrypt } from "@/auth/auth-utils";

export interface FormData {
  email?: string;
  password?: string;
}

export interface SignupFormData extends FormData {
  fullName: string;
}

export const getClient = () => {
  const login = async (data: FormData) => {
    if (process.env.NODE_ENV === "development") {
      await startSession(data);
      const token = await encrypt({
        email: data.email,
        password: data.password,
      });
      console.log(token);
      return token;
    }

    const response = await axios.post("/api/login", data);
    if (response.status !== 200) {
      throw new Error("Invalid authentication");
    }
    const token = response.data.token;
    if (!token) {
      throw new Error("Invalid authentication");
    }
    const user = {
      email: data.email,
      token,
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
    const response = await axios.post("/api/signup", data);
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
