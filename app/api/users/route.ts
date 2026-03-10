import { Hono } from "hono";
import { handle } from "hono/vercel";
import { middleware } from "@/lib/auth/middleware";
import { User } from "@/types";
import { UsersController } from "@/lib/controllers/users-controller";
import { ToastError } from "@/lib/errors/toast-error";

const app = new Hono();

app.get("/api/users", middleware, async (c) => {
  const data = await UsersController.getUsers();
  return c.json(data);
});

app.post("/api/users", middleware, async (c) => {
  try {
    const body = (await c.req.json()) as User;
    
    const created = await UsersController.createUser(body);

    return c.json({
      success: true,
      description: created.toastDescription,
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
    console.log('hey')
    return c.json(
      {
        success: false,
        description: "Something went wrong",
      },
      500
    );
  }
});

app.patch("/api/users", middleware, async (c) => {
  try {
    const body = (await c.req.json()) as User;

    const updated = await UsersController.updateUser(body);

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

app.delete("/api/users", middleware, async (c) => {
  try {
    const body = (await c.req.json()) as User;

    const deleted = await UsersController.deleteUser(body);

    return c.json({
      success: true,
      description: deleted.toastDescription,
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



export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
