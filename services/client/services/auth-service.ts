import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

interface User {
  name: string;
  email: string;
}

class AuthService {
  async login(email: string, password: string): Promise<User> {
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
      console.log(response);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
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

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
      });
      console.log("api data", response);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
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
    await axios.post(`${API_URL}/logout`);
  }
}

export const authService = new AuthService();
