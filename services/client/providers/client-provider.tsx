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

type ClientContextType = {
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

  // Simulate loading data
  // TODO: Replace with actual data fetching
  useEffect(() => {
    console.log("fetching data");
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setName("John Doe");
        setEmail("john.doe@example.com");
        setIsLogged(true);
        setBio("I am a software engineer");
      } catch (e) {
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [name, email, isLogged]);

  const logout = () => {
    setIsLogged(false);
    setName(undefined);
    setEmail(undefined);
    setBio(undefined);
    setAvatar(undefined);
    console.log("Logged out");
  };

  // TODO: Implement authentication
  const login = () => {};

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
