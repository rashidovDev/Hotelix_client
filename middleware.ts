import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/bookings",
  "/dashboard/profile",
  "/dashboard/reviews",
  "/book",
];

// Routes that require HOST or ADMIN role
const hostRoutes = [
  "/admin",
  "/admin/hotels",
];

// Routes only for guests (not logged in)
const authRoutes = [
  "/auth/login",
  "/auth/register",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from zustand persisted storage via cookies
  const authStorage = request.cookies.get("hotelix-auth");

  let isAuthenticated = false;
  let userRole = "";

  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage.value);
      isAuthenticated = parsed?.state?.isAuthenticated ?? false;
      userRole = parsed?.state?.user?.role ?? "";
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect unauthenticated users away from protected routes
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect non-host/admin users away from admin routes
  const isHostRoute = hostRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isHostRoute && !["HOST", "ADMIN"].includes(userRole)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && isAuthenticated) {
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


// Your route protection now works like this:

// /dashboard/*     → must be logged in
// /admin/*         → must be HOST or ADMIN
// /book/*          → must be logged in
// /auth/*          → redirects to /dashboard if already logged in