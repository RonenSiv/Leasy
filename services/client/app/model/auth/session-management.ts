import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "@/app/model/auth/auth-utils";

export const sessionExpirationTime = 60 * 100;

export const createSession = async (data: any) => {
  const expires = getMoreSessionTime();
  const session = await encrypt({ data, expires });

  return cookies().set("session", session, { expires, httpOnly: true });
};

export const getCurrentSession = async () => {
  const session = cookies().get("session")?.value;
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

export const endSession = async () => {
  cookies().set("session", "", { expires: new Date(0) });
};

export const getMoreSessionTime = () => {
  return new Date(Date.now() + sessionExpirationTime * 1000);
};
