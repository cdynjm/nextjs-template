import { Hono } from "hono";
import { handle } from "hono/vercel";
import { middleware } from "@/lib/auth/middleware";

import { UsersController } from "@/lib/controllers/users-controller";

const app = new Hono();

app.get("/api/users", middleware, async (c) => {
  const data = await UsersController.getUsers();
  return c.json(data);
});

export const GET = handle(app);
