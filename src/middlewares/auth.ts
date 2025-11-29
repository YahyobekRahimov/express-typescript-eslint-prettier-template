import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

// Middleware to verify JWT token from cookie
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (!token) {
    return next();
  }

  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: number;
      username: string;
      role: "admin" | "staff";
    };
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.clearCookie("authToken");
  }

  next();
};

// Middleware to check if user is authenticated
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.redirect("/auth/signin");
  }
  next();
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .render("error", { message: "Access denied. Admin only." });
  }
  next();
};

// Middleware to check if user is staff
export const isStaff = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== "staff" && req.user.role !== "admin")) {
    return res
      .status(403)
      .render("error", { message: "Access denied. Staff only." });
  }
  next();
};
