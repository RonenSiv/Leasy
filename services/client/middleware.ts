import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  // if (process.env.NODE_ENV === "development") return NextResponse.next();
  // const currentUser = request.cookies.get("session")?.value;
  // const currentPath = request.nextUrl.pathname;
  //
  // if (
  //   !currentUser &&
  //   !currentPath.startsWith("/login") &&
  //   !currentPath.startsWith("/signup") &&
  //   currentPath !== "/"
  // ) {
  //   return Response.redirect(new URL("/login", request.url));
  // }
  //
  // if (
  //   currentUser &&
  //   (request.nextUrl.pathname.startsWith("/login") ||
  //     request.nextUrl.pathname.startsWith("/signup"))
  // ) {
  //   return Response.redirect(new URL("/", request.url));
  // }
  return NextResponse.next();
};
//
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };
