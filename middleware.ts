import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { JWT } from "next-auth/jwt"

export async function middleware(req: NextRequest): Promise<NextResponse> {

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    }) as JWT | null

    const pathname = req.nextUrl.pathname

    if (pathname === "/") {

        if (token) {
            return NextResponse.redirect(
                new URL("/dashboard", req.url)
            )
        }

        return NextResponse.redirect(
            new URL("/login", req.url)
        )
    }

    if (pathname === "/login") {

        if (token) {
            return NextResponse.redirect(
                new URL("/dashboard", req.url)
            )
        }

        return NextResponse.next()
    }

    if (pathname.startsWith("/dashboard")) {

        if (!token) {
            return NextResponse.redirect(
                new URL("/login", req.url)
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/", "/login", "/dashboard/:path*"]
}