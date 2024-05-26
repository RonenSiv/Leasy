import { LeasySession } from "@/app/model/auth/auth";
import { getServerClient } from "@/app/model/auth/client.server";
import { cookies as nextCookies } from "next/headers";

export const useServerAuthSession = (): LeasySession => {
  return {
    client: getServerClient({ cookieStore: nextCookies() }),
  };
};
