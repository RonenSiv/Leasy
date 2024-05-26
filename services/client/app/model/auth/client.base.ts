import { CookieStore, getAccessToken, getRefreshToken } from "./cookie-store";
import {
  LEASY_ACCESS_TOKEN,
  LEASY_REFRESH_TOKEN,
} from "@/app/model/auth/auth.consts";
import { SignupFormData } from "@/app/model/auth/data-types";
import { decrypt, encrypt } from "@/app/utils/encoder";

export const signup = async (data: SignupFormData) => {
  if (process.env.NODE_ENV === "development") return true;
  const { email, password, fullName } = data;

  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, fullName }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
};

export const getClient = ({ cookieStore }: { cookieStore: CookieStore }) => {
  const login = async (email: string, password: string) => {
    if (process.env.NODE_ENV === "development") {
      const data = {
        email,
        name: "name",
      };
      const token = await encrypt({ data });
      console.log("token", token);
      cookieStore.set(LEASY_ACCESS_TOKEN, token);
      cookieStore.set(LEASY_REFRESH_TOKEN, "refreshToken", {
        expires: new Date(Date.now() + 1000 * 60),
      });
      return;
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    cookieStore.set("accessToken", data.accessToken);
    cookieStore.set("refreshToken", data.refreshToken);
  };

  const logout = () => {
    cookieStore.remove(LEASY_REFRESH_TOKEN);
    cookieStore.remove(LEASY_ACCESS_TOKEN);
  };

  const refreshToken = async () => {
    if (process.env.NODE_ENV === "development") {
      const randomToken = Math.random().toString(36).substring(7);
      return cookieStore.set(LEASY_ACCESS_TOKEN, randomToken);
    }
    const refreshToken = getRefreshToken(cookieStore);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch("/api/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    cookieStore.set(LEASY_ACCESS_TOKEN, data.accessToken);
  };

  const loggedIn = () => {
    const accessToken = getAccessToken(cookieStore);
    return !!accessToken;
  };

  const getAccessTokenFromClient = () => getAccessToken(cookieStore);

  const getData = async () => {
    if (process.env.NODE_ENV === "development") {
      const session = cookieStore.get("session");
      if (!session) return null;
      return await decrypt(session);
    }
  };

  return {
    login,
    logout,
    refreshToken,
    getAccessTokenFromClient,
    loggedIn,
  };
};

export type ClientType = ReturnType<typeof getClient>;
