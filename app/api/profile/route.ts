import { Hono } from "hono";
import { handle } from "hono/vercel";
import { middleware } from "@/lib/auth/middleware";
import { ProfileController } from "@/lib/controllers/profile-controller";
import { User } from "@/types";

const app = new Hono();

app.patch("/api/profile", middleware, async (c) => {

  const body = (await c.req.json()) as User;
  const updated = await ProfileController.updateProfile(body);
  return c.json({ success: true, user: updated });

});

export const PATCH = handle(app);
