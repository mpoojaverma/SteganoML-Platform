import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/encode",
  "/decode",
  "/analytics",
  "/job-history",
  "/settings",
];

export function middleware(
  request: NextRequest
) {
  const auth =
    request.cookies.get(
      "steganoml_auth"
    )?.value;

  const path =
    request.nextUrl.pathname;

  const isProtected =
    protectedRoutes.some((route) =>
      path.startsWith(route)
    );

  if (
    isProtected &&
    auth !== "true"
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/encode/:path*",
    "/decode/:path*",
    "/analytics/:path*",
    "/job-history/:path*",
    "/settings/:path*",
  ],
};