import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { IS_DEVELOPMENT } from "../config/config.js";

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
) => {
  // Log the error
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: error.message,
    statusCode: error instanceof AppError ? error.statusCode : 500,
    path: req.path,
    method: req.method,
    ...(IS_DEVELOPMENT && { stack: error.stack }),
  });

  // Handle Prisma errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`,
    });
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  }

  // Handle AppError instances
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Handle generic errors
  const statusCode = 500;
  const message = IS_DEVELOPMENT ? error.message : "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(IS_DEVELOPMENT && { stack: error.stack }),
  });
};

// Async error wrapper to catch errors in async route handlers
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
