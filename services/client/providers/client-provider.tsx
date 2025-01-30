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
import { authService } from "@/services/auth-service";

export interface User {
  full_name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export type ClientContextType = {
  name: string | undefined;
  setName: Dispatch<SetStateAction<string | undefined>>;
  email: string | undefined;
  setEmail: Dispatch<SetStateAction<string | undefined>>;
  isLogged: boolean | undefined;
  setIsLogged: Dispatch<SetStateAction<boolean | undefined>>;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  login: (email: string, password: string) => Promise<User | null>;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: FC<{ children?: ReactNode }> = (props) => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [isLogged, setIsLogged] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (process.env.NEXT_PUBLIC_SERVER_ON === "false") {
        setName(mockClient.name);
        setEmail(mockClient.email);
        setIsLogged(true);
      } else {
        try {
          const user = await authService.getCurrentUser({});
          if (!user) {
            setIsLoading(false);
            return;
          }
          setName(user?.full_name);
          setEmail(user?.email);
          setIsLogged(true);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [name, email, isLogged]);

  const logout = async (): Promise<void> => {
    setIsLogged(false);
    setName(undefined);
    setEmail(undefined);
    await authService.logout();
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    const user = await authService.login(email, password);
    if (!user) {
      setError("Login failed");
      return null;
    }

    setName(user.full_name);
    setEmail(user.email);
    setIsLogged(true);
    return user;
  };

  return (
    <ClientContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        isLogged,
        setIsLogged,
        isLoading,
        error,
        logout,
        login,
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
