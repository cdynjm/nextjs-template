import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { JWT } from "next-auth/jwt";

import {
  RouteGuard,
  Role,
  adminGuard,
} from "@/lib/guard";

// Define the default dashboard per role
const roleDashboards: Record<Role, string> = {
  admin: "/admin/dashboard",
};

const routeGuards: RouteGuard[] = [
  // Root redirect
  {
    matcher: (path) => path === "/",
    authRequired: false,
    redirectIfAuth: undefined,
    redirectIfUnauth: "/login",
  },

  // Login page
  {
    matcher: (path) => path === "/login",
    authRequired: false,
    redirectIfAuth: undefined,
  },

  // Shared protected routes (all authenticated roles)
  {
    matcher: (path) => path.startsWith("/profile"),
    authRequired: true,
    redirectIfUnauth: "/login",
  },

  // Protected routes:

  adminGuard,
];

function getRoleDashboard(token: JWT | null): string {
  const role = token?.role as Role | undefined;
  return role && roleDashboards[role] ? roleDashboards[role] : "/login";
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api/");
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as JWT | null;
  const userRole = token?.role as Role | undefined;

  for (const guard of routeGuards) {
    const matched = isApiRoute
      ? guard.apiMatcher?.(pathname)
      : guard.matcher(pathname);

    if (!matched) continue;

    if (guard.authRequired && !token) {
      return isApiRoute
        ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL(guard.redirectIfUnauth!, req.url));
    }

    if (guard.authRequired && token && guard.allowedRoles) {
      if (!userRole || !guard.allowedRoles.includes(userRole)) {
        return isApiRoute
          ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
          : NextResponse.redirect(
              new URL(
                guard.redirectIfUnauthorized ?? getRoleDashboard(token),
                req.url,
              ),
            );
      }
    }

    if (!guard.authRequired && token) {
      return NextResponse.redirect(new URL(getRoleDashboard(token), req.url));
    }

    if (!guard.authRequired && !token && guard.redirectIfUnauth) {
      return NextResponse.redirect(new URL(guard.redirectIfUnauth, req.url));
    }
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/profile/:path*",

    //PAGES ROUTES

    "/admin/:path*",

    //API ROUTES

    "/api/admin/:path*",

  ],
};
