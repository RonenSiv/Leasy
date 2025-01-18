import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/auth/auth";
import { authService } from "@/services/auth-service";

export const middleware = async (request: NextRequest) => {
  if (process.env.NODE_ENV === "development") return NextResponse.next();
  const currentUser = await authService.getCurrentUser();
  const currentPath = request.nextUrl.pathname;

  if (
    !currentUser &&
    !currentPath.startsWith("/authentication") &&
    !currentPath.startsWith("/signup") &&
    currentPath !== "/"
  ) {
    return Response.redirect(new URL("/authentication", request.url));
  }
  await updateSession(request);

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
