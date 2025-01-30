import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth-service";

export const middleware = async (request: NextRequest) => {
  const token = request.cookies.get("LeasyToken"); // Adjust token name as per your cookies
  const currentUser = await authService.getCurrentUser({
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  const currentPath = request.nextUrl.pathname;
  if (
    !currentUser &&
    !currentPath.startsWith("/authentication") &&
    !currentPath.startsWith("/signup") &&
    currentPath !== "/"
  ) {
    return Response.redirect(new URL("/authentication", request.url));
  }

  if (
    currentUser &&
    (request.nextUrl.pathname.startsWith("/authentication") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    return Response.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
