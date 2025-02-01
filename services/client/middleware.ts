import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { api } from "./app/api/server-api";

const protectedRoutes = [
  "/dashboard",
  "/upload",
  "/browse",
  "/settings",
  "/lecture",
];

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("LeasyToken");

  // Check if the pathname is a protected route or starts with a protected pattern
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Check if the pathname is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  const isLoggedIn = await api.auth.getUser();
  // If it's a protected route and there's no token
  if (isProtectedRoute && !isLoggedIn) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set({
      name: "redirectTo",
      value: pathname,
      maxAge: 60 * 60,
      path: "/",
    });
    return response;
  }

  // If it's an auth route and there is a token
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For all other routes, continue
  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|fonts|images|favicon.ico|sitemap.xml).*)"],
};
