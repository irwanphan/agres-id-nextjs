import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const managerRestrictedPaths = [
  "/admin/user-management",
  "/admin/account-settings",
  "/admin/coupons",
  "/admin/countdown",
  "/admin/hero-banner",
  "/admin/hero-slider",
  "/admin/post-authors",
  "/admin/post-categories",
];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: true,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });
  
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  // Debug logging
  console.log("Middleware Debug:", {
    pathname,
    isAdminRoute,
    hasToken: !!token,
    tokenRole: token?.role,
    tokenEmail: token?.email
  });

  // Protect /admin routes
  if (isAdminRoute) {
    if (!token || (token.role !== "ADMIN" && token.role !== "MANAGER")) {
      console.log("Access denied to admin route:", pathname);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Redirect authenticated users away from signin/signup
  if (isAuthPage && token) {
    const redirectURL =
      token.role === "ADMIN" || token.role === "MANAGER"
        ? "/admin/dashboard"
        : "/my-account";
    return NextResponse.redirect(new URL(redirectURL, req.url));
  }

  if (
    token &&
    token.role === "MANAGER" &&
    managerRestrictedPaths.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protect admin routes and handle authentication pages
export const config = {
  matcher: ["/admin/:path*", "/signin", "/signup"],
};
