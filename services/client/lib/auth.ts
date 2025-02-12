import { create } from "zustand";
import api from "./api";
import { RegisterCredentials, User } from "@/types/api-types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  registerWithGoogle: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const authURL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8000/auth";

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const response = await api.get("/user");
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const response = await api.post("/login", { email, password });
    set({ user: response.data, isLoading: false });
    return response.data;
  },

  logout: async () => {
    await api.post("/logout");
    set({ user: null });
  },

  register: async (credentials) => {
    const response = await api.post("/register", credentials);
    set({ user: response.data, isLoading: false });
    return response.data;
  },

  loginWithGoogle: async () => {
    window.location.href = `${authURL}/google`;
  },

  registerWithGoogle: async () => {},
}));

useAuth.getState().checkAuth();
