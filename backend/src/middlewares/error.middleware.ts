import type { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  //

  // Default Error Properties Section
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  //  Response Section (Environment Based)
  if (process.env.NODE_ENV === "development") {
    // Development response (full error exposure)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
      stack: err.stack,
      error: err,
    });
  }

  return res.status(err.statusCode).json({
    // Production response (no sensitive info)
    status: err.status,
    message: err.isOperational ? err.message : "Something went wrong!",
    errors: err.errors,
  });
};
