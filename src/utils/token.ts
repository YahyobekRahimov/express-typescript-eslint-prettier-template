import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { JWT_SECRET } from "../config/config.js";

interface GenerateTokenRes {
  token: string;
  expiresIn?: number | StringValue;
}

export const generateToken = (
  payload: unknown,
  expiresIn?: number | StringValue,
): GenerateTokenRes => {
  expiresIn = expiresIn ?? "30d";
  const token = jwt.sign({ payload }, JWT_SECRET ?? "", {
    expiresIn: expiresIn,
  });
  return { token, expiresIn };
};
