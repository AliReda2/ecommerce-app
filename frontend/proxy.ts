// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const adminPublic = ["/admin/login", "/admin/register"];
  if (adminPublic.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Guard admin routes only
  if (pathname.startsWith("/admin")) {
    const accessToken = req.cookies.get("access_token")?.value;
    if (!accessToken) {
      const redirectUrl = new URL("/", req.url);
      // optional: preserve return URL for after-login navigation
      redirectUrl.searchParams.set("returnUrl", pathname + (search || ""));
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// limit proxy to admin routes (same matcher pattern you used)
export const config = {
  matcher: ["/admin/:path*"],
};
