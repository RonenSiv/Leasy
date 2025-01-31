import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  email: string;
  full_name: string;
}

export class AuthService {
  async getCurrentUser() {
    const res = await axios.get<User>(`${API_URL}/api/user`, {
      withCredentials: true,
    });
    return res.data;
  }

  async login(email: string, password: string) {
    const res = await axios.post(
      `${API_URL}/api/login`,
      { email, password },
      { withCredentials: true },
    );
    return res.data;
  }

  async signup(email: string, password: string, fullName: string) {
    const res = await axios.post(
      `${API_URL}/api/register`,
      { email, password, full_name: fullName },
      { withCredentials: true },
    );
    return res.data;
  }

  async logout() {
    return axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
  }
}

export const authService = new AuthService();
