"use client";

import { createContext, PropsWithChildren } from "react";
import { LeasySession } from "@/app/model/auth/auth";
import { getBrowserClient } from "@/app/model/auth/client.browser";

export const SessionContext = createContext<LeasySession | null>(null);

export const ClientProvider = ({ children }: PropsWithChildren<{}>) => (
  <SessionContext.Provider value={{ client: getBrowserClient() }}>
    {children}
  </SessionContext.Provider>
);
