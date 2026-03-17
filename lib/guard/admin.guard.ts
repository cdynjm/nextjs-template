import { RouteGuard } from "./types"

export const adminGuard: RouteGuard = {
    matcher: (path) => path.startsWith("/admin"),
    apiMatcher: (path) => path.startsWith("/api/admin"),
    authRequired: true,
    allowedRoles: ["admin"],
    redirectIfUnauth: "/login",
    redirectIfUnauthorized: "/"
}