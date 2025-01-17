"use client";

import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { mockClient } from "@/mocks/mock-client-data";
import { User } from "@/contexts/auth-context";

export type ClientContextType = {
  name: string | undefined;
  setName: Dispatch<SetStateAction<string | undefined>>;
  session: string | undefined;
  setSession: Dispatch<SetStateAction<string | undefined>>;
  email: string | undefined;
  setEmail: Dispatch<SetStateAction<string | undefined>>;
  bio: string | undefined;
  setBio: Dispatch<SetStateAction<string | undefined>>;
  avatar: string | undefined;
  setAvatar: Dispatch<SetStateAction<string | undefined>>;
  isLogged: boolean | undefined;
  setIsLogged: Dispatch<SetStateAction<boolean | undefined>>;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: FC<{ children?: ReactNode }> = (props) => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState<string | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [isLogged, setIsLogged] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
        setName(mockClient.name);
        setEmail(mockClient.email);
        setIsLogged(true);
        setBio(mockClient.bio);
        setAvatar(mockClient.avatar);
      } else {
        try {
          const res = await fetch("/api/user");
          if (res.ok) {
            const data: User = await res.json();
            setName(data.name);
            setEmail(data.email);
            setIsLogged(true);
            setBio(data.bio);
            setAvatar(data.avatar);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [name, email, isLogged]);

  const logout = async (): Promise<void> => {
    if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
      setIsLogged(false);
      setName(undefined);
      setEmail(undefined);
      setBio(undefined);
      setAvatar(undefined);
      return;
    }

    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      setIsLogged(false);
      setName(undefined);
      setEmail(undefined);
      setBio(undefined);
      setAvatar(undefined);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
      setName(mockClient.name);
      setEmail(mockClient.email);
      setIsLogged(true);
      setBio(mockClient.bio);
      setAvatar(mockClient.avatar);
      return mockClient;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data: User = await res.json();
      setName(data.name);
      setEmail(data.email);
      setIsLogged(true);
      setBio(data.bio);
      setAvatar(data.avatar);
      return data;
    } else {
      throw new Error("Login failed");
    }
  };

  return (
    <ClientContext.Provider
      value={{
        name,
        setName,
        session,
        setSession,
        email,
        setEmail,
        bio,
        setBio,
        avatar,
        setAvatar,
        isLogged,
        setIsLogged,
        isLoading,
        error,
        logout,
      }}
    >
      {props.children}
    </ClientContext.Provider>
  );
};

export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
