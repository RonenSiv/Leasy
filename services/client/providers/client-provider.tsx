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
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

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
  login: (email: string, password: string) => Promise<User>;
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
          const user = await authService.getCurrentUser();
          if (!user) {
            setIsLoading(false);
            return;
          }
          setName(user?.name);
          setEmail(user?.email);
          setIsLogged(true);
          setBio("");
          setAvatar(undefined);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [name, email, isLogged]);

  const logout = async (): Promise<void> => {
    const user = await authService.logout();
    setIsLogged(false);
    setName(undefined);
    setEmail(undefined);
    setBio(undefined);
    setAvatar(undefined);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const user = await authService.login(email, password);

    setName(user.name);
    setEmail(user.email);
    setIsLogged(true);
    setBio("");
    setAvatar("");
    return user;
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
