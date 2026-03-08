import { Hono } from "hono";
import { handle } from "hono/vercel";
import { authMiddleware } from "@/lib/auth/middleware";

import { UsersController } from "@/lib/controllers/UsersController";

const app = new Hono();

app.get("/api/users", authMiddleware, async (c) => {
  const data = await UsersController.getUsers();
  return c.json(data);
});

export const GET = handle(app);
