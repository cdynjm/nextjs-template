import { Hono } from "hono";
import { ToastError } from "@/lib/exceptions/toast-error";

export function handleHonoError(app: Hono) {
  app.onError((err, c) => {
    if (err instanceof ToastError) {

      console.error("[Hono Error]:", err);
      
      return c.json(
        {
          success: false,
          description: err.toastDescription,
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
  });
}