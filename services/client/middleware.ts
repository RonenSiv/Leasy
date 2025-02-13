import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { mutate } from "swr";

const protectedRoutes = [
  "/dashboard",
  "/upload",
  "/browse",
  "/settings",
  "/video",
];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("LeasyToken")?.value;
  let isLoggedIn = false;
  await mutate("/user");
  if (token) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      isLoggedIn = res.status === 200;
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtectedRoute && !isLoggedIn) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("redirectTo", pathname, {
      maxAge: 60 * 60,
      path: "/",
    });
    return response;
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|fonts|images|favicon.ico|sitemap.xml).*)"],
};
