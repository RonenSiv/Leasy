// NOT IN USE!!!
"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { mockClient } from "@/mocks/mock-client-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface User {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
        setUser(mockClient);
      } else {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/me`);
          if (res.ok) {
            const data: User = await res.json();
            setUser(data);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
      console.log("Logging in with mock data");
      setUser(mockClient);
      return mockClient;
    }
    console.log("Logging in with real data");
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(res);
    if (res.ok) {
      const data: User = await res.json();
      console.log(data);
      setUser(data);
      return data;
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = async (): Promise<void> => {
    if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
      setUser(null);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/logout`, { method: "POST" });
    if (res.ok) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
