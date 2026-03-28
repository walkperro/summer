import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SUMMER_ADMIN_ACCESS_COOKIE } from "@/lib/summer/admin-constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isReviewPage = pathname === "/review" || pathname.startsWith("/review/");
  const isReviewApi = pathname.startsWith("/api/review");

  if (!isAdminPath && !isReviewPage && !isReviewApi) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(SUMMER_ADMIN_ACCESS_COOKIE)?.value;

  if (!accessToken) {
    if (isReviewApi) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/review", "/review/:path*", "/api/review/:path*"],
};
