import { Hono } from "hono";
import { handle } from "hono/vercel";
import { middleware } from "@/lib/auth/middleware";
import { User } from "@/types";
import { UsersController } from "@/lib/controllers/users-controller";
import { ToastError } from "@/lib/exceptions/toast-error";
import { api } from "@/lib/api/endpoints";

const app = new Hono();

app.get(api.GET_USERS, middleware, async (c) => {
  const users = await UsersController.getUsers();
  return c.json(users);
});

app.post(api.CREATE_USER, middleware, async (c) => {
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
    return c.json(
      {
        success: false,
        description: "Something went wrong",
      },
      500
    );
  }
});

app.patch(api.UPDATE_USER, middleware, async (c) => {
  try {
    const body = (await c.req.json()) as User;

    const updated = await UsersController.updateUser(body);

    return c.json({
      user: updated.user,
      success: true,
      description: updated.toastDescription,
      forceLogout: updated.forceLogout
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

app.delete(api.DELETE_USER, middleware, async (c) => {
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
