// lib/errors/toast-error.ts
export class ToastError extends Error {
  toastDescription: string;

  constructor(message: string, toastDescription?: string) {
    super(message);
    this.name = "ToastError";
    this.toastDescription = toastDescription ?? message;
  }
}