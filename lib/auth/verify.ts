import jwt from "jsonwebtoken"

export function verifyToken(authHeader?: string) {

    if (!authHeader) return null

    try {

        const token = authHeader.replace("Bearer ", "")

        return jwt.verify(
            token,
            process.env.NEXTAUTH_SECRET!
        )

    } catch {
        return null
    }
}