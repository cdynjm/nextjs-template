import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { JWT } from "next-auth/jwt"

type RouteGuard = {
    matcher: (path: string) => boolean
    authRequired: boolean
    redirectIfAuth?: string
    redirectIfUnauth?: string
}

const routeGuards: RouteGuard[] = [
    {
        matcher: (path) => path === "/",
        authRequired: false,
        redirectIfAuth: "/dashboard",
        redirectIfUnauth: "/login"
    },

    {
        matcher: (path) => path === "/login",
        authRequired: false,
        redirectIfAuth: "/dashboard"
    },

    // Protected routes
    {
        matcher: (path) =>
            path.startsWith("/dashboard") ||
            path.startsWith("/users") ||
            path.startsWith("/profile")
            ,
        authRequired: true,
        redirectIfUnauth: "/login"
    }
]

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    }) as JWT | null

    for (const guard of routeGuards) {
        
        if (!guard.matcher(pathname)) continue

        if (guard.authRequired && !token) {
            return NextResponse.redirect(
                new URL(guard.redirectIfUnauth!, req.url)
            )
        }

        if (!guard.authRequired && token && guard.redirectIfAuth) {
            return NextResponse.redirect(
                new URL(guard.redirectIfAuth, req.url)
            )
        }

        if (!guard.authRequired && !token && guard.redirectIfUnauth) {
            return NextResponse.redirect(
                new URL(guard.redirectIfUnauth, req.url)
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/dashboard/:path*",
        "/users/:path*",
        "/profile/:path*"
    ]
}