import { Hono } from "hono";
import { handle } from "hono/vercel";
import { middleware } from "@/lib/auth/middleware";
import { ProfileController } from "@/lib/controllers/profile-controller";

const app = new Hono();

app.patch("/api/profile", middleware, async (c) => {
  
    const body = await c.req.json<{
      email: string;
      password: string;
      encrypted_id: string;
    }>();

    const updated = await ProfileController.updateProfile(body);
    return c.json({ success: true, user: updated });
  
});

export const PATCH = handle(app);