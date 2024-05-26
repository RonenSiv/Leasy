import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/app/model/auth/client.server";

export const middleware = async (request: NextRequest) => {
  const requestHeaders = new Headers(request.headers);
  const requestUrl = request.url;
  requestHeaders.set("x-middleware-request-url", requestUrl);
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  const client = getServerClient({
    cookieStore: request.cookies,
  });
  const isLoggedIn = client.loggedIn();
  const currentPath = request.nextUrl.pathname;

  if (
    !isLoggedIn &&
    !currentPath.startsWith("/login") &&
    !currentPath.startsWith("/signup") &&
    currentPath !== "/"
  ) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (
    isLoggedIn &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  return res;
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
