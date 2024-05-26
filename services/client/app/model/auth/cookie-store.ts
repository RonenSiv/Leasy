import {
  LEASY_ACCESS_TOKEN,
  LEASY_REFRESH_TOKEN,
} from "@/app/model/auth/auth.consts";
import Cookies from "js-cookie";

export type CookieStore = typeof Cookies;

export const getRefreshToken = (cookieStore: CookieStore): string | undefined =>
  cookieStore.get(LEASY_REFRESH_TOKEN);

export const getAccessToken = (cookieStore: CookieStore): string | undefined =>
  cookieStore.get(LEASY_ACCESS_TOKEN);
