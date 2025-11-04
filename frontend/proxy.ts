import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminPublic = ["/admin-auth/login", "/admin-auth/register"];
  if (adminPublic.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Guard admin routes only
  if (pathname.startsWith("/admin")) {
    const accessToken = req.cookies.get("access_token")?.value;
    if (!accessToken) {
      const redirectUrl = new URL("/login", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
