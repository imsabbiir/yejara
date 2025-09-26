import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isUserRoot = pathname === "/user";
  const isProtected = pathname.startsWith("/user");
const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user IS logged in and tries to access exactly /user (redirect to profile)
  if (isUserRoot && token) {
    return NextResponse.redirect(new URL("/user/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user", "/user/:path*", "/login", "/signup"],
};
