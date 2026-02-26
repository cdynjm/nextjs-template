import { Hono } from "hono"
import { db } from "@/lib/db/connection"
import { users } from "@/lib/db/models"
import { handle } from "hono/vercel"
import { verifyToken } from "@/lib/auth/verify"

const app = new Hono()

app.get("/api/users", async (c) => {

    const authHeader = c.req.header("authorization")

    const user = verifyToken(authHeader)

    if (!user) {
        return c.json(
            { error: "Unauthorized" },
            401
        )
    }

    const data = await db.select().from(users)

    return c.json(data)
})

export const GET = handle(app)