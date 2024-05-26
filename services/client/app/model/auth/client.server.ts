import { CookieStore } from "./cookie-store";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { getClient } from "@/app/model/auth/client.base";

export type RequestCookiesGetter = Pick<RequestCookies, "get">;
const getCookieAdapter = (cookieStore: RequestCookiesGetter): CookieStore => {
  return {
    get: (name) => cookieStore.get(name)?.value,
  };
};
export const getServerClient = ({
  cookieStore,
}: {
  cookieStore: RequestCookiesGetter;
}) => getClient({ cookieStore: getCookieAdapter(cookieStore) });
