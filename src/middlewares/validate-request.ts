import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      if (err.errors && Array.isArray(err.errors)) {
        const messages = err.errors
          .map((e: { message: string }) => e.message)
          .join(", ");
        return res.status(400).json({
          success: false,
          message: `Validation error: ${messages}`,
        });
      }
      return res.status(400).json({
        success: false,
        message: "Validation error",
      });
    }
  };
