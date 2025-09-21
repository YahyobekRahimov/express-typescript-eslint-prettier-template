import type { Request, Response } from "express";
import CustomError from "../utils/custom-error.js"; // Import your custom error class
import { IS_DEVELOPMENT } from "../config/config.js";

export const errorHandler = (
  err: Error | CustomError, // Type the error parameter
  req: Request,
  res: Response,
) => {
  let statusCode = 500;
  let message = "Something went wrong";

  // Check if the error is an instance of our CustomError
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // You can add more specific error checks here if needed
    // For example, handling Mongoose validation errors
    console.error("UNHANDLED ERROR:", err); // Log unexpected errors
  }

  res.status(statusCode).json({
    status: "error",
    message,
    // Conditionally include the stack trace for debugging
    stack: IS_DEVELOPMENT ? err.stack : undefined,
  });
};
