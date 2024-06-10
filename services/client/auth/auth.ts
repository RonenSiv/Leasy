import Cookies from "js-cookie";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt, sessionExpirationTime } from "@/auth/auth-utils";

export const startSession = async (payload: any) => {
  Cookies.set("session", await encrypt(payload), {
    expires: new Date(Date.now() + sessionExpirationTime * 1000),
    httpOnly: true,
  });
  console.log("Session started");
};

export const getSession = async () => {
  const session = Cookies.get("session");
  if (!session) return null;
  return await decrypt(session);
};

export const updateSession = async (request: NextRequest) => {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const newExpiration = getMoreSessionTime();
  parsed.expires = newExpiration;
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: newExpiration,
  });
  return res;
};

export const endSession = () => {
  Cookies.remove("session");
};

export const getMoreSessionTime = () => {
  return new Date(Date.now() + sessionExpirationTime * 1000);
};
