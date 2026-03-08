import type {} from "next-auth"

declare module "next-auth" {
    interface Session {

        user: {
            id: string
            accessToken?: string
            status: string
            email?: string | null
        }
    }
}