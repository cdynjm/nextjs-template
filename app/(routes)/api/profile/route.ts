import { Hono } from "hono";
import { handle } from "hono/vercel";
import { middleware } from "@/lib/middleware/middleware";
import { ProfileService } from "@/lib/services/profile-service";
import { User } from "@/types";
import { ToastError } from "@/lib/exceptions/toast-error";
import { api } from "@/lib/api/endpoints";

const app = new Hono();

app.patch(api.UPDATE_PROFILE, middleware, async (c) => {
  try {
    const body = (await c.req.json()) as User;

    const updated = await ProfileService.updateProfile(body);

    return c.json({
      success: true,
      user: updated.user,
      description: updated.toastDescription,
    });
  } catch (error) {
    if (error instanceof ToastError) {
      return c.json(
        {
          success: false,
          description: error.toastDescription,
        },
        400
      );
    }
    
    return c.json(
      {
        success: false,
        description: "Something went wrong",
      },
      500
    );
  }
});

export const PATCH = handle(app);