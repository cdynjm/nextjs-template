// lib/errors/handle-api-error.ts
import axios from "axios";
import { toast } from "sonner";

export function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    toast("Oops, something went wrong", {
      description: error.response?.data?.description || error.message,
      action: {
          label: "Close",
          onClick: () => console.log(""),
        },
    });
  } else if (error instanceof Error) {
    toast("Oops, something went wrong", {
      description: error.message,
      action: {
          label: "Close",
          onClick: () => console.log(""),
        },
    });
  } else {
    toast("Oops, something went wrong", {
      description: "Unknown error",
      action: {
          label: "Close",
          onClick: () => console.log(""),
        },
    });
  }
}