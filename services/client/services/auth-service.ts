import axios from "axios";
import { User } from "@/providers/client-provider";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

class AuthService {
  constructor() {}

  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error: any) {
      return null;
    }
  }

  async register(data: {
    full_name: string;
    email: string;
    password: string;
    phone_number?: string;
  }): Promise<User> {
    try {
      data.phone_number = data.phone_number || "0544380698";
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    }
  }

  async getCurrentUser({
    headers,
  }: {
    headers?: Record<string, string>;
  }): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
        headers,
      });
      if (response.status !== 200) {
        return null;
      }
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/user`, data);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Profile update failed");
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      await axios.post(`${API_URL}/password/change`, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Password change failed",
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/logout`, { withCredentials: true });
      Cookies.remove("LeasyToken");
    } catch (error: any) {
      console.error("Failed to logout:", error);
    }
  }
}

export const authService = new AuthService();
