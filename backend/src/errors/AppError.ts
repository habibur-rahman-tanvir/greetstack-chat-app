export class AppError extends Error {
  status: "fail" | "error";
  isOperational: boolean;

  constructor(
    public message: string,
    public statusCode?: number | undefined,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
