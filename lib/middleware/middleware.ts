import { Context, Next } from "hono"
import { verifyToken } from "./verify"

export const middleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization")

  const user = verifyToken(authHeader)

  if (!user) {
    return c.redirect("/", 302)
  }

  c.set("user", user)

  await next()
}