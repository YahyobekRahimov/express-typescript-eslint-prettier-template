import { NextFunction, Response, Request } from "express";
import CustomError from "../utils/custom-error.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import User from "../modules/users/user.model.js";

interface JwtPayload {
  payload: {
    _id: string;
    username: string;
  };
  iat: number;
  exp: number;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization ?? "";

  if (!authorization.startsWith("Bearer"))
    return next(new CustomError("Not authorized, no token", 401));

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET ?? "") as JwtPayload;

    req.user = await User.findById(decoded.payload._id, {
      password: 0,
    });

    if (!req.user) return next(new CustomError("No user found", 401));

    next();
  } catch {
    next(new CustomError("Not authorized, token failed", 401));
  }
};
