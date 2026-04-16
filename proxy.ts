import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/book"];
const adminRoutes = ["/admin"];
const authRoutes = ["/auth/login", "/auth/register"];

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    const payload = JSON.parse(atob(padded));

    if (!payload || typeof payload !== "object") return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getValidRefreshPayload(token?: string) {
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const exp = payload.exp;
  if (typeof exp !== "number") return null;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (exp <= nowInSeconds) return null;

  return payload;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authStorage = request.cookies.get("hotelix-auth");
  const refreshTokenCookie = request.cookies.get("refreshToken");
  const refreshPayload = getValidRefreshPayload(refreshTokenCookie?.value);

  let isAuthenticated = false;
  let userRole = "";
  let authenticatedByRefresh = false;

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage.value);
      isAuthenticated = parsed?.state?.isAuthenticated ?? false;
      userRole = parsed?.state?.user?.role ?? "";
    } catch {
      isAuthenticated = false;
    }
  }

  // Server-set HttpOnly refresh token is accepted only when structurally valid and not expired.
  if (!isAuthenticated && refreshPayload) {
    isAuthenticated = true;
    authenticatedByRefresh = true;
  }

  // If role is not available in storage cookie, derive it from JWT payload.
  if (!userRole && refreshPayload) {
    if (typeof refreshPayload.role === "string") {
      userRole = refreshPayload.role;
    }
  }

  // Unauthenticated → login
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ADMIN tries /dashboard → /admin
  if (pathname.startsWith("/dashboard") && userRole === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // GUEST/HOST tries /admin → /dashboard
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Already logged in tries auth pages
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );
  // Do not force-redirect auth pages based only on refresh cookie presence.
  if (isAuthRoute && isAuthenticated && !authenticatedByRefresh) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/book/:path*",
    "/auth/:path*",
  ],
};