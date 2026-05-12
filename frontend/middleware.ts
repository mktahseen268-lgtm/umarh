import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /[locale]/admin/* routes
  if (/^\/[a-z]{2}\/admin(\/|$)/.test(pathname) && !/^\/[a-z]{2}\/admin\/login/.test(pathname)) {
    const token = request.cookies.get("access_token");
    if (!token) {
      const locale = pathname.split("/")[1] ?? "en";
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect all /[locale]/agency/* routes (exclude /agency/login)
  if (/^\/[a-z]{2}\/agency(\/|$)/.test(pathname) && !/^\/[a-z]{2}\/agency\/login/.test(pathname)) {
    const token = request.cookies.get("access_token");
    if (!token) {
      const locale = pathname.split("/")[1] ?? "en";
      const loginUrl = new URL(`/${locale}/agency/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Enable locale routing on all paths except _next, api, static
    "/((?!_next|api|_vercel|.*\\..*).*)",
  ],
};
