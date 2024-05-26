"use client";
import { useContext } from "react";
import { LeasySession } from "@/app/model/auth/auth";
import { SessionContext } from "@/app/provider/ClientProvider";

export const useClientAuthSession = (): LeasySession => {
  return useContext(SessionContext)!;
};
