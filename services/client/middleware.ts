import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/app/api/auth/session-management";

export const middleware = async (request: NextRequest) => {
  const currentUser = request.cookies.get("session")?.value;
  const currentPath = request.nextUrl.pathname;

  if (
    !currentUser &&
    !currentPath.startsWith("/login") &&
    currentPath !== "/"
  ) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (currentUser && request.nextUrl.pathname.startsWith("/login")) {
    return Response.redirect(new URL("/", request.url));
  }
  await updateSession(request);
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
